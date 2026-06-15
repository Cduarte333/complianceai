'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ImportRelatorio from '@/components/ImportRelatorio';
import DosimetriaPanel from '@/components/DosimetriaPanel';
import CursoPlayer from '@/components/CursoPlayer';

type Employee = { id: string; full_name: string; role: string | null };
type Control = { id: string; title: string; description: string | null };
type Training = { id: string; employee_id: string; control_id: string; status: string; score?: number | null };
type TabId = 'colaboradores' | 'treinamentos' | 'dosimetria' | 'curso' | 'importar';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [tab, setTab] = useState<TabId>('colaboradores');

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [trainingName, setTrainingName] = useState('');
  const [trainingDesc, setTrainingDesc] = useState('');

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: empData }   = await supabase.from('employees').select('*').order('full_name');
    const { data: ctrlData }  = await supabase.from('controls').select('*').order('title');
    const { data: trainData } = await supabase.from('employee_trainings').select('*');
    if (empData)   setEmployees(empData);
    if (ctrlData)  setControls(ctrlData);
    if (trainData) setTrainings(trainData);
  }

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('employees').insert([{ full_name: name, role }]);
    if (error) { alert('Erro ao salvar colaborador: ' + error.message); return; }
    setName(''); setRole(''); fetchData();
  }

  async function addControl(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase
      .from('controls')
      .insert([{ title: trainingName, description: trainingDesc }]);
    if (error) { alert('Erro ao criar treinamento: ' + error.message); return; }
    setTrainingName(''); setTrainingDesc(''); fetchData();
  }

  async function removeControl(id: string) {
    if (!confirm('Remover este treinamento? As atribuições dele também serão removidas.')) return;
    const { error } = await supabase.from('controls').delete().eq('id', id);
    if (error) alert('Erro ao remover treinamento: ' + error.message);
    else fetchData();
  }


  async function assignToAll(controlId: string) {
    // só os colaboradores que ainda NÃO têm esse treinamento
    const jaTem = new Set(
      trainings.filter((t) => t.control_id === controlId).map((t) => t.employee_id)
    );
    const alvos = employees.filter((e) => !jaTem.has(e.id));

    if (employees.length === 0) { alert('Não há colaboradores cadastrados.'); return; }
    if (alvos.length === 0) { alert('Todos os colaboradores já têm este treinamento.'); return; }
    if (!confirm(`Atribuir este treinamento a ${alvos.length} colaborador(es)?`)) return;

    const rows = alvos.map((e) => ({ employee_id: e.id, control_id: controlId, status: 'pendente' }));
    const { error } = await supabase.from('employee_trainings').insert(rows);
    if (error) alert('Erro ao atribuir a todos: ' + error.message);
    else fetchData();
  }


  async function assignTraining(employeeId: string, controlId: string) {
    if (!controlId) return;
    const { error } = await supabase
      .from('employee_trainings')
      .insert([{ employee_id: employeeId, control_id: controlId, status: 'pendente' }]);
    if (error) alert('Erro ao atribuir: ' + error.message);
    else fetchData();
  }

  async function completeTraining(trainingId: string) {
    const { error } = await supabase
      .from('employee_trainings')
      .update({ status: 'concluido', completed_at: new Date().toISOString() })
      .eq('id', trainingId);
    if (error) alert('Erro ao atualizar: ' + error.message);
    else fetchData();
  }

  async function removeAssignment(trainingId: string) {
    const { error } = await supabase.from('employee_trainings').delete().eq('id', trainingId);
    if (error) alert('Erro ao remover: ' + error.message);
    else fetchData();
  }

  async function removeEmployee(employeeId: string) {
    if (!confirm('Remover este colaborador e todos os treinamentos dele?')) return;
    const { error } = await supabase.from('employees').delete().eq('id', employeeId);
    if (error) alert('Erro ao remover colaborador: ' + error.message);
    else fetchData();
  }

  const controlTitleById = (id: string) =>
    controls.find((c) => c.id === id)?.title ?? 'Treinamento';

  const totalTreinamentosAtribuidos = trainings.length;
  const treinamentosConcluidos = trainings.filter((t) => t.status === 'concluido').length;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'colaboradores', label: 'Colaboradores' },
    { id: 'treinamentos', label: 'Treinamentos' },
    { id: 'dosimetria', label: 'Dosimetria' },
    { id: 'curso', label: 'Treinamento (Aula)' },
    { id: 'importar', label: 'Importar PDF' },
  ];

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">ComplianceAI</h1>
      <p className="text-gray-500 mb-8">Painel de Gestão da Clínica</p>

      {/* Indicadores (sempre visíveis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm opacity-80">Colaboradores</h3>
          <p className="text-4xl font-bold">{employees.length}</p>
        </div>
        <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm opacity-80">Atribuições Ativas</h3>
          <p className="text-4xl font-bold">{totalTreinamentosAtribuidos}</p>
        </div>
        <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm opacity-80">Conformidade (Concluídos)</h3>
          <p className="text-4xl font-bold">{treinamentosConcluidos}</p>
        </div>
      </div>

      {/* Barra de abas */}
      <div className="flex flex-wrap gap-1 border-b mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              tab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ----- Aba: Colaboradores ----- */}
      {tab === 'colaboradores' && (
        <div>
          <form onSubmit={addEmployee} className="bg-white p-6 rounded-lg mb-6 border shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">Adicionar Novo Colaborador</h2>
            <div className="flex gap-4">
              <input className="border p-2 rounded w-full" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="border p-2 rounded w-full" placeholder="Cargo" value={role} onChange={(e) => setRole(e.target.value)} required />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Salvar</button>
            </div>
          </form>

          <div className="bg-white shadow rounded-lg overflow-hidden border">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Nome</th>
                  <th className="p-4 font-semibold text-gray-700">Cargo</th>
                  <th className="p-4 font-semibold text-gray-700">Treinamentos</th>
                  <th className="p-4 font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const empTrainings = trainings.filter((t) => t.employee_id === emp.id);
                  const available = controls.filter(
                    (c) => !empTrainings.some((t) => t.control_id === c.id)
                  );
                  return (
                    <tr key={emp.id} className="border-b hover:bg-gray-50 align-top">
                      <td className="p-4 font-medium">{emp.full_name}</td>
                      <td className="p-4 text-gray-600">{emp.role}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2 mb-3">
                          {empTrainings.map((t) => (
                            <div key={t.id} className="flex items-center gap-2 text-xs">
                              <span className="font-medium">{controlTitleById(t.control_id)}</span>
                              <span className={`px-2 py-0.5 rounded-full ${t.status === 'concluido' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {t.status}
                              </span>
                              {t.status === 'concluido' && t.score != null && (
                            <span className="text-xs text-gray-500">nota {t.score}%</span>
                          )}
                              {t.status !== 'concluido' && (
                                <button onClick={() => completeTraining(t.id)} className="text-emerald-600 hover:underline">concluir</button>
                              )}
                              <button onClick={() => removeAssignment(t.id)} className="text-red-500 hover:underline">remover</button>
                            </div>
                          ))}
                          {empTrainings.length === 0 && (
                            <span className="text-xs text-gray-400">Nenhum treinamento atribuído</span>
                          )}
                        </div>
                        <select
                          value=""
                          onChange={(e) => { assignTraining(emp.id, e.target.value); e.currentTarget.value = ''; }}
                          className="border p-1 rounded text-xs"
                        >
                          <option value="">+ Atribuir treinamento...</option>
                          {available.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => removeEmployee(emp.id)} className="text-xs text-red-500 hover:underline">excluir</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----- Aba: Treinamentos ----- */}
      {tab === 'treinamentos' && (
        <div>
          <form onSubmit={addControl} className="bg-white p-6 rounded-lg mb-6 border shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-700">Cadastrar Novo Treinamento</h2>
            <div className="flex gap-4">
              <input className="border p-2 rounded w-full" placeholder="Nome do treinamento" value={trainingName} onChange={(e) => setTrainingName(e.target.value)} required />
              <input className="border p-2 rounded w-full" placeholder="Descrição (opcional)" value={trainingDesc} onChange={(e) => setTrainingDesc(e.target.value)} />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
            </div>
          </form>

          <div className="bg-white shadow rounded-lg overflow-hidden border">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Treinamento</th>
                  <th className="p-4 font-semibold text-gray-700">Descrição</th>
                  <th className="p-4 font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {controls.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{c.title}</td>
                    <td className="p-4 text-gray-600">{c.description}</td>
                    <td className="p-4 text-right">
                    <button onClick={() => assignToAll(c.id)} className="text-xs text-blue-600 hover:underline mr-4">atribuir a todos</button>
                    <button onClick={() => removeControl(c.id)} className="text-xs text-red-500 hover:underline">excluir</button>
                    </td>
                  </tr>
                ))}
                {controls.length === 0 && (
                  <tr><td className="p-4 text-gray-400" colSpan={3}>Nenhum treinamento cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----- Aba: Dosimetria ----- */}
      {tab === 'dosimetria' && <DosimetriaPanel />}

      {/* ----- Aba: Importar PDF ----- */}

      {tab === 'curso' && <CursoPlayer onCompleted={fetchData} />}
      {tab === 'importar' && <ImportRelatorio onImported={fetchData} />}
    </main>
  );
}