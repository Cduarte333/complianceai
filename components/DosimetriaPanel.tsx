'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Reading = { cpf: string; monitor_type: string; period: string; dose_msv: number };
type Emp = { full_name: string; cpf: string | null };

const LIM = {
  corpo:  { investigacao: 6, mediaRef: 20, anualMax: 50, acc5: 100 },
  extrem: { investigacao: 150, anual: 500 },
};

const fmt = (n: number) => n.toFixed(2).replace('.', ',');

export default function DosimetriaPanel() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [emps, setEmps] = useState<Emp[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => { load(); }, []);
  async function load() {
    const { data: r } = await supabase.from('dose_readings').select('cpf, monitor_type, period, dose_msv');
    const { data: e } = await supabase.from('employees').select('full_name, cpf');
    if (r) setReadings(r as Reading[]);
    if (e) setEmps(e as Emp[]);
  }

  const yearOf = (p: string) => parseInt(p.slice(0, 4), 10);
  const sum = (cpf: string, type: string, years: number[]) =>
    readings.filter(r => r.cpf === cpf && r.monitor_type === type && years.includes(yearOf(r.period)))
            .reduce((a, r) => a + Number(r.dose_msv), 0);

  const last5 = [year - 4, year - 3, year - 2, year - 1, year];

  const corpoAnual = (v: number) =>
    v >= LIM.corpo.anualMax  ? ['Limite anual (50) excedido', 'bg-red-100 text-red-700'] :
    v >= LIM.corpo.mediaRef  ? ['Acima da referência (20)',   'bg-orange-100 text-orange-700'] :
    v >= LIM.corpo.investigacao ? ['Investigação (≥6)',        'bg-amber-100 text-amber-700'] :
                                ['Normal',                    'bg-emerald-100 text-emerald-700'];
  const acc5 = (v: number) =>
    v >= LIM.corpo.acc5      ? ['Acumulado 5a (100) excedido', 'bg-red-100 text-red-700'] :
    v >= LIM.corpo.acc5 * 0.8 ? ['Atenção (>80%)',             'bg-orange-100 text-orange-700'] :
                                ['Normal',                     'bg-emerald-100 text-emerald-700'];
  const extrem = (v: number) =>
    v >= LIM.extrem.anual       ? ['Limite anual (500) excedido', 'bg-red-100 text-red-700'] :
    v >= LIM.extrem.investigacao ? ['Investigação (≥150)',         'bg-amber-100 text-amber-700'] :
                                  ['Normal',                      'bg-emerald-100 text-emerald-700'];

  const cpfsComDose = new Set(readings.map(r => r.cpf));
  const rows = emps.filter(e => e.cpf && cpfsComDose.has(e.cpf!)).map(e => ({
    full_name: e.full_name,
    cpf: e.cpf!,
    anualCorpo: sum(e.cpf!, 'corpo_inteiro', [year]),
    acc5Corpo:  sum(e.cpf!, 'corpo_inteiro', last5),
    anualExtrem: sum(e.cpf!, 'extremidade', [year]),
  }));

  const years = Array.from(new Set(readings.map(r => yearOf(r.period)))).sort((a, b) => b - a);

  return (
    <div className="bg-white p-6 rounded-lg mb-8 border shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-gray-700">Dosimetria — Limites CNEN NN 3.01</h2>
        <select value={year} onChange={e => setYear(parseInt(e.target.value, 10))}
          className="border p-1 rounded text-sm">
          {(years.length ? years : [year]).map(y => <option key={y} value={y}>Ano {y}</option>)}
        </select>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Corpo inteiro: 20 mSv/ano (média 5a), máx. 50/ano, 100 em 5 anos · Extremidades: 500 mSv/ano ·
        Investigação: 6 mSv (corpo) / 150 mSv (extremidade).
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhuma leitura de dose importada ainda.</p>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-700">Colaborador</th>
                <th className="p-3 font-semibold text-gray-700">Anual corpo ({year})</th>
                <th className="p-3 font-semibold text-gray-700">Acum. 5 anos</th>
                <th className="p-3 font-semibold text-gray-700">Anual extremidade</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const [la, ca] = corpoAnual(r.anualCorpo);
                const [l5, c5] = acc5(r.acc5Corpo);
                const [le, ce] = extrem(r.anualExtrem);
                return (
                  <tr key={r.cpf} className="border-b">
                    <td className="p-3 font-medium">{r.full_name}</td>
                    <td className="p-3">
                      <div>{fmt(r.anualCorpo)} mSv</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ca}`}>{la}</span>
                    </td>
                    <td className="p-3">
                      <div>{fmt(r.acc5Corpo)} mSv</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c5}`}>{l5}</span>
                    </td>
                    <td className="p-3">
                      <div>{fmt(r.anualExtrem)} mSv</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ce}`}>{le}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}