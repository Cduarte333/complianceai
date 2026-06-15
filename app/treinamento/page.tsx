'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import CursoPlayer from '@/components/CursoPlayer';

type Emp = { id: string; full_name: string };

export default function TreinamentoPage() {
  const [cpf, setCpf] = useState('');
  const [emp, setEmp] = useState<Emp | null>(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function identificar(e: React.FormEvent) {
    e.preventDefault();
    const limpo = cpf.replace(/\D/g, '');
    if (limpo.length !== 11) { setErro('Digite um CPF válido (11 dígitos).'); return; }
    setLoading(true);
    setErro('');
    const { data, error } = await supabase
      .from('employees')
      .select('id, full_name')
      .eq('cpf', limpo)
      .maybeSingle();
    setLoading(false);
    if (error) { setErro('Erro ao consultar. Tente novamente.'); return; }
    if (!data) { setErro('CPF não encontrado. Procure o responsável pelo setor.'); return; }
    setEmp(data as Emp);
  }

  if (emp) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Treinamento de Proteção Radiológica</h1>
          <p className="text-gray-500 mb-6">Olá, {emp.full_name}</p>
          <CursoPlayer lockedEmployeeId={emp.id} lockedEmployeeName={emp.full_name} allowReview={false} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form onSubmit={identificar} className="bg-white p-8 rounded-xl border shadow-sm w-full max-w-sm">
        <h1 className="text-xl font-bold mb-1">Acesso ao Treinamento</h1>
        <p className="text-sm text-gray-500 mb-5">Informe seu CPF para iniciar a aula e a avaliação.</p>
        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="CPF (apenas números)"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          inputMode="numeric"
        />
        {erro && <p className="text-sm text-red-600 mb-3">{erro}</p>}
        <button disabled={loading} className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Verificando...' : 'Acessar'}
        </button>
      </form>
    </main>
  );
}