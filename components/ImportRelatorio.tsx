'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Reading = {
  badge_code: string;
  cpf: string;
  full_name: string;
  monitor_type: 'corpo_inteiro' | 'extremidade';
  dose_msv: number;
  raw: string;
};

export default function ImportRelatorio({ onImported }: { onImported: () => void }) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState('');

  async function extractText(file: File): Promise<string> {
    const pdfjsLib: any = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => ('str' in it ? it.str : '')).join(' ') + '\n';
    }
    return text;
  }

  function parseReport(text: string): { period: string; readings: Reading[] } {
    // Período: data final da coleta
    let y = new Date().getFullYear();
    let mo = new Date().getMonth() + 1;
    const pm = text.match(/COLETADOS DE \d{2}\/\d{2}\/\d{4} A \d{2}\/(\d{2})\/(\d{4})/);
    if (pm) { mo = parseInt(pm[1], 10); y = parseInt(pm[2], 10); }
    const period = `${y}-${String(mo).padStart(2, '0')}-01`;

    // Seções: Hp(10) = corpo inteiro | Hp(0,07) = extremidade
    const sections: { i: number; type: 'corpo_inteiro' | 'extremidade' }[] = [];
    const secRe = /Hp\((10|0,07)\)/g;
    let s: RegExpExecArray | null;
    while ((s = secRe.exec(text)) !== null) {
      sections.push({ i: s.index, type: s[1] === '10' ? 'corpo_inteiro' : 'extremidade' });
    }
    const typeAt = (pos: number): 'corpo_inteiro' | 'extremidade' => {
      let t: 'corpo_inteiro' | 'extremidade' = 'corpo_inteiro';
      for (const sec of sections) { if (sec.i <= pos) t = sec.type; else break; }
      return t;
    };

    // Trabalhadores: código CPF NOME + 1º valor (dose do período)
    const re = /(\d{5}\.\d{3}-\d)\s+(\d{11})\s+([A-ZÀ-Ÿ][A-ZÀ-Ÿ ]+?)\s+(ANR|OD|LI|ND|NU|\d+,\d+)/g;
    const rows: Reading[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const token = m[4];
      const dose = /^\d/.test(token) ? parseFloat(token.replace(',', '.')) : 0;
      rows.push({
        badge_code: m[1],
        cpf: m[2],
        full_name: m[3].replace(/\s+/g, ' ').trim(),
        monitor_type: typeAt(m.index),
        dose_msv: dose,
        raw: token,
      });
    }
    return { period, readings: rows };
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setReadings([]);
    try {
      const { period, readings } = parseReport(await extractText(file));
      setPeriod(period);
      setReadings(readings);
      if (readings.length === 0) alert('Nenhuma leitura reconhecida. O layout do PDF pode ser diferente.');
    } catch (err: any) {
      alert('Erro ao ler o PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function importAll() {
    if (readings.length === 0) return;
    setImporting(true);

    // 1) Colaboradores (únicos por CPF)
    const byCpf = new Map<string, Reading>();
    readings.forEach((r) => { if (!byCpf.has(r.cpf)) byCpf.set(r.cpf, r); });
    const empRows = Array.from(byCpf.values()).map((r) => ({
      full_name: r.full_name, cpf: r.cpf, badge_code: r.badge_code,
    }));
    const { error: e1 } = await supabase
      .from('employees').upsert(empRows, { onConflict: 'cpf', ignoreDuplicates: true });
    if (e1) { setImporting(false); alert('Erro ao importar colaboradores: ' + e1.message); return; }

    // 2) Liga CPF -> id
    const { data: emps } = await supabase.from('employees').select('id, cpf');
    const idByCpf = new Map((emps ?? []).map((e: any) => [e.cpf, e.id]));

    // 3) Leituras de dose
    const doseRows = readings.map((r) => ({
      employee_id: idByCpf.get(r.cpf) ?? null,
      cpf: r.cpf,
      monitor_type: r.monitor_type,
      period,
      dose_msv: r.dose_msv,
      source: 'SAPRA Landauer',
    }));
    const { error: e2 } = await supabase
      .from('dose_readings').upsert(doseRows, { onConflict: 'cpf,monitor_type,period' });
    setImporting(false);
    if (e2) { alert('Erro ao importar doses: ' + e2.message); return; }

    alert(`Importado! ${empRows.length} colaborador(es) e ${doseRows.length} leitura(s) de dose.`);
    setReadings([]); setPeriod(''); setFileName('');
    onImported();
  }

  const corpo = readings.filter((r) => r.monitor_type === 'corpo_inteiro').length;
  const extrem = readings.filter((r) => r.monitor_type === 'extremidade').length;

  return (
    <div className="bg-white p-6 rounded-lg mb-8 border shadow-sm">
      <h2 className="font-semibold mb-1 text-gray-700">Importar Relatório de Doses (PDF)</h2>
      <p className="text-sm text-gray-500 mb-4">
        Envie o relatório SAPRA/Landauer. Confira as leituras antes de importar.
      </p>

      <label className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-900">
        Selecionar PDF
        <input type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
      </label>
      {fileName && <span className="ml-3 text-sm text-gray-600">{fileName}</span>}
      {loading && <p className="mt-4 text-sm text-gray-500">Lendo o PDF...</p>}

      {readings.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Período {period.slice(0, 7)} — {corpo} corpo inteiro, {extrem} extremidade
            </span>
            <button onClick={importAll} disabled={importing}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              {importing ? 'Importando...' : `Importar ${readings.length} leitura(s)`}
            </button>
          </div>
          <div className="border rounded-lg max-h-72 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="p-2 font-semibold text-gray-700">Nome</th>
                  <th className="p-2 font-semibold text-gray-700">CPF</th>
                  <th className="p-2 font-semibold text-gray-700">Monitor</th>
                  <th className="p-2 font-semibold text-gray-700">Dose (mSv)</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{r.full_name}</td>
                    <td className="p-2 text-gray-500">{r.cpf}</td>
                    <td className="p-2 text-gray-600">
                      {r.monitor_type === 'corpo_inteiro' ? 'Corpo inteiro' : 'Extremidade'}
                    </td>
                    <td className="p-2">{r.raw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}