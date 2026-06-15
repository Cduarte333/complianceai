'use client';

import { useState, type FC } from 'react';

/* ----------------------------- Módulo 1 ----------------------------- */

const Title: FC = () => {
  const blade = 'M45.03 -26 A52 52 0 0 1 45.03 26 L13.86 8 A16 16 0 0 0 13.86 -8 Z';
  return (
    <div className="flex flex-col items-center py-4">
      <svg width="150" height="150" viewBox="0 0 140 140" role="img" aria-label="Símbolo de radiação ionizante">
        <circle cx="70" cy="70" r="66" fill="#FACC15" />
        <g transform="translate(70,70)" fill="#111827">
          <path d={blade} transform="rotate(0)" />
          <path d={blade} transform="rotate(120)" />
          <path d={blade} transform="rotate(240)" />
          <circle r="12" />
        </g>
      </svg>
      <p className="mt-3 text-sm text-gray-500">Norma CNEN NN 3.05 · Medicina Nuclear</p>
    </div>
  );
};

const Radiofarmaco: FC = () => (
  <svg width="100%" viewBox="0 0 600 150" role="img" aria-label="Radioisótopo mais fármaco resulta em radiofármaco administrado ao paciente">
    <defs><marker id="rf" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#6B7280" strokeWidth="1.5" /></marker></defs>
    <circle cx="70" cy="60" r="34" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
    <text x="70" y="57" textAnchor="middle" fontSize="12" fill="#92400E" fontWeight="600">Radio-</text>
    <text x="70" y="72" textAnchor="middle" fontSize="12" fill="#92400E" fontWeight="600">isótopo</text>
    <text x="140" y="68" textAnchor="middle" fontSize="24" fill="#6B7280">+</text>
    <circle cx="210" cy="60" r="34" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
    <text x="210" y="64" textAnchor="middle" fontSize="13" fill="#1E40AF" fontWeight="600">Fármaco</text>
    <text x="280" y="68" textAnchor="middle" fontSize="24" fill="#6B7280">=</text>
    <rect x="320" y="32" width="120" height="56" rx="10" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" />
    <text x="380" y="64" textAnchor="middle" fontSize="14" fill="#5B21B6" fontWeight="600">Radiofármaco</text>
    <line x1="448" y1="60" x2="500" y2="60" stroke="#6B7280" strokeWidth="2" markerEnd="url(#rf)" />
    <circle cx="540" cy="48" r="12" fill="#9CA3AF" />
    <rect x="528" y="62" width="24" height="30" rx="8" fill="#9CA3AF" />
    <text x="540" y="112" textAnchor="middle" fontSize="12" fill="#6B7280">Paciente</text>
  </svg>
);

const Ionizante: FC = () => (
  <svg width="100%" viewBox="0 0 600 165" role="img" aria-label="Espectro de radiação não ionizante e ionizante separados por um limiar de energia">
    <defs><linearGradient id="en" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#BFDBFE" /><stop offset="1" stopColor="#FCA5A5" /></linearGradient></defs>
    <text x="40" y="30" fontSize="12" fill="#6B7280">menor energia</text>
    <text x="560" y="30" fontSize="12" fill="#6B7280" textAnchor="end">maior energia</text>
    <rect x="40" y="40" width="520" height="26" rx="6" fill="url(#en)" />
    <line x1="330" y1="34" x2="330" y2="78" stroke="#111827" strokeWidth="1.5" strokeDasharray="4 3" />
    <text x="330" y="92" textAnchor="middle" fontSize="11" fill="#374151">limiar de ionização</text>
    <text x="60" y="122" fontSize="13" fill="#1E40AF" fontWeight="600">Não ionizante</text>
    <text x="60" y="140" fontSize="12" fill="#6B7280">luz · rádio · micro-ondas</text>
    <text x="540" y="122" fontSize="13" fill="#B91C1C" fontWeight="600" textAnchor="end">Ionizante</text>
    <text x="540" y="140" fontSize="12" fill="#6B7280" textAnchor="end">raios X · gama · beta · alfa</text>
  </svg>
);

const Penetracao: FC = () => (
  <svg width="100%" viewBox="0 0 600 215" role="img" aria-label="Poder de penetração das radiações">
    <defs><marker id="ga" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#185FA5" strokeWidth="1.5" /></marker></defs>
    <rect x="190" y="30" width="10" height="150" rx="2" fill="#D1D5DB" stroke="#9CA3AF" />
    <rect x="330" y="30" width="18" height="150" rx="2" fill="#D1D5DB" stroke="#9CA3AF" />
    <rect x="470" y="30" width="28" height="150" rx="2" fill="#D1D5DB" stroke="#9CA3AF" />
    <text x="195" y="198" textAnchor="middle" fontSize="12" fill="#6B7280">Papel</text>
    <text x="339" y="198" textAnchor="middle" fontSize="12" fill="#6B7280">Alumínio</text>
    <text x="484" y="198" textAnchor="middle" fontSize="12" fill="#6B7280">Chumbo</text>
    <text x="12" y="62" fontSize="13" fill="#374151" fontWeight="600">Alfa α</text>
    <text x="12" y="107" fontSize="13" fill="#374151" fontWeight="600">Beta β</text>
    <text x="12" y="152" fontSize="13" fill="#374151" fontWeight="600">Gama γ</text>
    <line x1="64" y1="58" x2="190" y2="58" stroke="#D85A30" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="190" cy="58" r="4" fill="#D85A30" />
    <line x1="64" y1="103" x2="330" y2="103" stroke="#BA7517" strokeWidth="3" strokeLinecap="round" />
    <circle cx="330" cy="103" r="4" fill="#BA7517" />
    <line x1="64" y1="148" x2="470" y2="148" stroke="#185FA5" strokeWidth="3" strokeLinecap="round" />
    <line x1="498" y1="148" x2="556" y2="148" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" markerEnd="url(#ga)" />
  </svg>
);

const Distancia: FC = () => {
  const [d, setD] = useState(2);
  const dose = Math.round(100 / (d * d));
  const px = Math.min(70 + d * 80, 540);
  const cor = dose > 50 ? '#DC2626' : dose > 15 ? '#D97706' : '#059669';
  return (
    <div>
      <svg width="100%" viewBox="0 0 600 130" role="img" aria-label={`Pessoa a ${d} metros recebe ${dose}% da dose`}>
        <circle cx="60" cy="60" r="16" fill="#FACC15" stroke="#CA8A04" />
        <text x="60" y="95" textAnchor="middle" fontSize="11" fill="#6B7280">fonte</text>
        {[1, 2, 3].map((i) => (
          <circle key={i} cx="60" cy="60" r={16 + i * 15} fill="none" stroke="#FDE68A" strokeWidth="2" opacity={0.8 - i * 0.2} />
        ))}
        <g style={{ transition: 'transform 0.2s' }} transform={`translate(${px},0)`}>
          <circle cx="0" cy="46" r="11" fill="#6B7280" />
          <rect x="-11" y="59" width="22" height="28" rx="7" fill="#6B7280" />
        </g>
        <text x={px} y="105" textAnchor="middle" fontSize="11" fill="#6B7280">{d} m</text>
      </svg>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-sm text-gray-600">Distância</span>
        <input type="range" min={1} max={5} step={1} value={d} onChange={(e) => setD(parseInt(e.target.value))} className="flex-1" />
      </div>
      <div className="mt-3 text-center">
        <span className="text-3xl font-bold" style={{ color: cor }}>{dose}%</span>
        <span className="text-sm text-gray-500 ml-2">da dose a 1 metro</span>
      </div>
    </div>
  );
};

/* ----------------------------- Módulo 2 ----------------------------- */

const Decaimento: FC = () => (
  <svg width="100%" viewBox="0 0 600 150" role="img" aria-label="Átomo instável emitindo radiação até se estabilizar">
    <circle cx="130" cy="75" r="34" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
    {[[-12, -8], [10, -10], [-4, 10], [14, 8]].map(([dx, dy], i) => (
      <circle key={i} cx={130 + dx} cy={75 + dy} r="5" fill="#D97706" />
    ))}
    <text x="130" y="128" textAnchor="middle" fontSize="12" fill="#92400E">átomo instável</text>
    {[55, 75, 95].map((y, i) => (
      <line key={i} x1="178" y1={y} x2={300 + i * 20} y2={y} stroke="#EF9F27" strokeWidth="2" strokeDasharray="6 4" />
    ))}
    <text x="360" y="80" fontSize="13" fill="#6B7280">radiação emitida</text>
    <text x="130" y="20" textAnchor="middle" fontSize="12" fill="#374151">→ tende ao estado estável</text>
  </svg>
);

const MeiaVida: FC = () => {
  const [days, setDays] = useState(8);
  const T = 8;
  const rem = 100 * Math.pow(0.5, days / T);
  const X = (d: number) => 50 + (d / 32) * 500;
  const Y = (p: number) => 120 - (p / 100) * 95;
  const pts = Array.from({ length: 33 }, (_, d) => `${X(d)},${Y(100 * Math.pow(0.5, d / T))}`).join(' ');
  return (
    <div>
      <svg width="100%" viewBox="0 0 600 145" role="img" aria-label={`Após ${days} dias restam ${rem.toFixed(0)}% dos átomos`}>
        <line x1="50" y1="120" x2="560" y2="120" stroke="#9CA3AF" strokeWidth="1" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#9CA3AF" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke="#2563EB" strokeWidth="2.5" />
        <line x1={X(days)} y1="20" x2={X(days)} y2="120" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx={X(days)} cy={Y(rem)} r="5" fill="#DC2626" />
        <text x="30" y="28" fontSize="11" fill="#6B7280">100%</text>
        <text x="560" y="135" fontSize="11" fill="#6B7280" textAnchor="end">32 dias</text>
      </svg>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-sm text-gray-600">Dias</span>
        <input type="range" min={0} max={32} step={1} value={days} onChange={(e) => setDays(parseInt(e.target.value))} className="flex-1" />
      </div>
      <div className="mt-2 text-center text-sm text-gray-600">
        <span className="font-bold text-gray-800">{days} dias</span> · restam{' '}
        <span className="font-bold text-blue-600">{rem.toFixed(0)}%</span> ·{' '}
        {(days / T).toFixed(1)} meias-vidas (I-131 ≈ 8 dias)
      </div>
    </div>
  );
};

const MeiaVidaEfetiva: FC = () => (
  <svg width="100%" viewBox="0 0 600 140" role="img" aria-label="Meia-vida física mais biológica resultam na efetiva">
    <defs><marker id="mv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#6B7280" strokeWidth="1.5" /></marker></defs>
    <rect x="30" y="30" width="150" height="48" rx="10" fill="#DBEAFE" stroke="#2563EB" />
    <text x="105" y="52" textAnchor="middle" fontSize="13" fill="#1E40AF" fontWeight="600">Física</text>
    <text x="105" y="68" textAnchor="middle" fontSize="11" fill="#3B82F6">decaimento</text>
    <text x="205" y="60" textAnchor="middle" fontSize="22" fill="#6B7280">+</text>
    <rect x="230" y="30" width="150" height="48" rx="10" fill="#DCFCE7" stroke="#16A34A" />
    <text x="305" y="52" textAnchor="middle" fontSize="13" fill="#166534" fontWeight="600">Biológica</text>
    <text x="305" y="68" textAnchor="middle" fontSize="11" fill="#22C55E">eliminação</text>
    <line x1="388" y1="54" x2="420" y2="54" stroke="#6B7280" strokeWidth="2" markerEnd="url(#mv)" />
    <rect x="430" y="30" width="150" height="48" rx="10" fill="#EDE9FE" stroke="#7C3AED" />
    <text x="505" y="52" textAnchor="middle" fontSize="13" fill="#5B21B6" fontWeight="600">Efetiva</text>
    <text x="505" y="68" textAnchor="middle" fontSize="11" fill="#8B5CF6">sempre menor</text>
    <text x="305" y="110" textAnchor="middle" fontSize="12" fill="#6B7280">determina por quanto tempo o paciente permanece como fonte</text>
  </svg>
);

/* ----------------------------- Módulo 3 ----------------------------- */

const Celula: FC = () => (
  <svg width="100%" viewBox="0 0 600 160" role="img" aria-label="Radiação danifica o DNA da célula">
    <ellipse cx="230" cy="80" rx="120" ry="62" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
    <circle cx="230" cy="80" r="40" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <path d="M210 60 Q230 70 250 60 Q230 80 210 70 Q230 90 250 80 Q230 100 210 90" fill="none" stroke="#1E40AF" strokeWidth="2" />
    <text x="230" y="135" textAnchor="middle" fontSize="12" fill="#1E40AF">célula · núcleo · DNA</text>
    <line x1="20" y1="40" x2="190" y2="70" stroke="#D85A30" strokeWidth="3" strokeLinecap="round" />
    <polygon points="190,70 178,62 180,76" fill="#D85A30" />
    <text x="30" y="32" fontSize="12" fill="#B45309">radiação</text>
    <text x="430" y="60" fontSize="13" fill="#374151" fontWeight="600">Possíveis efeitos:</text>
    <text x="430" y="80" fontSize="12" fill="#6B7280">• reparo</text>
    <text x="430" y="98" fontSize="12" fill="#6B7280">• morte celular</text>
    <text x="430" y="116" fontSize="12" fill="#6B7280">• mutação</text>
  </svg>
);

const Efeitos: FC = () => (
  <svg width="100%" viewBox="0 0 600 170" role="img" aria-label="Curvas de efeitos determinísticos e estocásticos">
    <line x1="60" y1="130" x2="560" y2="130" stroke="#9CA3AF" />
    <line x1="60" y1="20" x2="60" y2="130" stroke="#9CA3AF" />
    <text x="300" y="155" textAnchor="middle" fontSize="11" fill="#6B7280">dose →</text>
    <polyline points="60,128 200,124 300,120 360,80 440,35 520,28" fill="none" stroke="#DC2626" strokeWidth="2.5" />
    <polyline points="60,128 560,55" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="6 4" />
    <line x1="300" y1="125" x2="300" y2="135" stroke="#6B7280" />
    <text x="300" y="118" textAnchor="middle" fontSize="10" fill="#6B7280">limiar</text>
    <circle cx="470" cy="40" r="4" fill="#DC2626" />
    <text x="478" y="44" fontSize="12" fill="#B91C1C" fontWeight="600">Determinístico (tem limiar)</text>
    <circle cx="430" cy="78" r="4" fill="#2563EB" />
    <text x="438" y="92" fontSize="12" fill="#1E40AF" fontWeight="600">Estocástico (sem limiar)</text>
  </svg>
);

const FontesNaturais: FC = () => {
  const items = [
    { x: 70, c: '#A16207', t1: 'Solo', t2: 'U · Th' },
    { x: 210, c: '#0E7490', t1: 'Radônio', t2: 'no ar' },
    { x: 350, c: '#4F46E5', t1: 'Cósmica', t2: 'do espaço' },
    { x: 490, c: '#6B7280', t1: 'Paciente', t2: 'injetado' },
  ];
  return (
    <svg width="100%" viewBox="0 0 600 150" role="img" aria-label="Fontes de radiação naturais e o paciente">
      {items.map((it, i) => (
        <g key={i}>
          <circle cx={it.x} cy="55" r="28" fill="none" stroke={it.c} strokeWidth="2" />
          <text x={it.x} y="50" textAnchor="middle" fontSize="12" fill={it.c} fontWeight="600">{it.t1}</text>
          <text x={it.x} y="66" textAnchor="middle" fontSize="10" fill="#6B7280">{it.t2}</text>
        </g>
      ))}
      <text x="300" y="125" textAnchor="middle" fontSize="12" fill="#6B7280">maior parte da exposição vem de fontes naturais</text>
    </svg>
  );
};

/* ----------------------------- Módulo 4 ----------------------------- */

const Alara: FC = () => (
  <svg width="100%" viewBox="0 0 600 175" role="img" aria-label="Triângulo ALARA: tempo, distância e blindagem">
    <polygon points="300,25 130,150 470,150" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
    <text x="300" y="95" textAnchor="middle" fontSize="16" fill="#1E40AF" fontWeight="700">ALARA</text>
    <text x="300" y="113" textAnchor="middle" fontSize="10" fill="#3B82F6">tão baixo quanto exequível</text>
    <text x="300" y="18" textAnchor="middle" fontSize="13" fill="#374151" fontWeight="600">Tempo</text>
    <text x="120" y="167" textAnchor="middle" fontSize="13" fill="#374151" fontWeight="600">Distância</text>
    <text x="480" y="167" textAnchor="middle" fontSize="13" fill="#374151" fontWeight="600">Blindagem</text>
  </svg>
);

const Tempo: FC = () => (
  <svg width="100%" viewBox="0 0 600 150" role="img" aria-label="Mais tempo perto da fonte significa mais dose">
    <text x="40" y="45" fontSize="13" fill="#374151" fontWeight="600">Mais tempo</text>
    <rect x="180" y="32" width="320" height="22" rx="6" fill="#FCA5A5" />
    <text x="510" y="48" fontSize="12" fill="#B91C1C">+ dose</text>
    <text x="40" y="105" fontSize="13" fill="#374151" fontWeight="600">Menos tempo</text>
    <rect x="180" y="92" width="110" height="22" rx="6" fill="#86EFAC" />
    <text x="300" y="108" fontSize="12" fill="#166534">− dose</text>
  </svg>
);

const Blindagem: FC = () => (
  <svg width="100%" viewBox="0 0 600 140" role="img" aria-label="Blindagem de chumbo reduz a radiação">
    <circle cx="70" cy="70" r="16" fill="#FACC15" stroke="#CA8A04" />
    <text x="70" y="105" textAnchor="middle" fontSize="11" fill="#6B7280">fonte</text>
    <line x1="90" y1="70" x2="290" y2="70" stroke="#185FA5" strokeWidth="4" strokeLinecap="round" />
    <rect x="290" y="30" width="34" height="80" rx="3" fill="#6B7280" />
    <text x="307" y="125" textAnchor="middle" fontSize="11" fill="#6B7280">chumbo</text>
    <line x1="324" y1="70" x2="470" y2="70" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" />
    <text x="500" y="74" fontSize="12" fill="#166534">muito atenuada</text>
  </svg>
);

const Epis: FC = () => {
  const items = ['Luvas', 'Avental', 'Protetor de seringa'];
  return (
    <svg width="100%" viewBox="0 0 600 120" role="img" aria-label="Equipamentos de proteção individual">
      {items.map((t, i) => (
        <g key={i}>
          <rect x={40 + i * 185} y="30" width="160" height="48" rx="10" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
          <text x={120 + i * 185} y="59" textAnchor="middle" fontSize="13" fill="#065F46" fontWeight="600">{t}</text>
        </g>
      ))}
      <text x="300" y="102" textAnchor="middle" fontSize="12" fill="#6B7280">use sempre ao manipular e injetar</text>
    </svg>
  );
};

const Limites: FC = () => (
  <svg width="100%" viewBox="0 0 600 175" role="img" aria-label="Limites de dose para trabalhador e público">
    <text x="40" y="28" fontSize="13" fill="#374151" fontWeight="600">Dose efetiva (corpo inteiro) — anual</text>
    <text x="40" y="60" fontSize="12" fill="#1E40AF">IOE (trabalhador)</text>
    <rect x="200" y="48" width="300" height="20" rx="5" fill="#3B82F6" />
    <text x="510" y="63" fontSize="12" fill="#1E40AF" fontWeight="600">20 mSv</text>
    <text x="40" y="92" fontSize="12" fill="#166534">Público</text>
    <rect x="200" y="80" width="15" height="20" rx="5" fill="#22C55E" />
    <text x="225" y="95" fontSize="12" fill="#166534" fontWeight="600">1 mSv</text>
    <line x1="40" y1="115" x2="560" y2="115" stroke="#E5E7EB" />
    <text x="40" y="138" fontSize="12" fill="#6B7280">Extremidades / pele (IOE): <tspan fill="#374151" fontWeight="600">500 mSv/ano</tspan></text>
    <text x="40" y="158" fontSize="11" fill="#9CA3AF">Média de 20 mSv em 5 anos, máx. 50 mSv em um único ano (CNEN NN 3.01)</text>
  </svg>
);

/* ----------------------------- Módulo 5 ----------------------------- */

const Dosimetro: FC = () => (
  <svg width="100%" viewBox="0 0 600 160" role="img" aria-label="Uso correto do dosímetro">
    <circle cx="120" cy="45" r="18" fill="#9CA3AF" />
    <rect x="98" y="65" width="44" height="60" rx="12" fill="#9CA3AF" />
    <rect x="128" y="78" width="14" height="18" rx="2" fill="#2563EB" stroke="#1E40AF" />
    <text x="170" y="90" fontSize="11" fill="#1E40AF">dosímetro de tórax</text>
    <circle cx="92" cy="118" r="6" fill="#7C3AED" />
    <text x="60" y="140" fontSize="11" fill="#7C3AED" textAnchor="end">anel/pulseira</text>
    <text x="330" y="50" fontSize="13" fill="#374151" fontWeight="600">Regras de uso:</text>
    <text x="330" y="72" fontSize="12" fill="#6B7280">• uso individual e intransferível</text>
    <text x="330" y="92" fontSize="12" fill="#6B7280">• só nas dependências do setor</text>
    <text x="330" y="112" fontSize="12" fill="#6B7280">• leitura mensal, em mSv</text>
    <text x="330" y="132" fontSize="12" fill="#6B7280">• nunca expor de propósito</text>
  </svg>
);

const Niveis: FC = () => (
  <svg width="100%" viewBox="0 0 600 140" role="img" aria-label="Níveis de registro, investigação e limite anual">
    <line x1="60" y1="80" x2="560" y2="80" stroke="#9CA3AF" strokeWidth="2" />
    {[
      { x: 110, t: '0,1 mSv', s: 'registro (mês)', c: '#16A34A' },
      { x: 320, t: '6 mSv', s: 'investigação (ano)', c: '#D97706' },
      { x: 520, t: '20 mSv', s: 'limite (ano)', c: '#DC2626' },
    ].map((m, i) => (
      <g key={i}>
        <line x1={m.x} y1="68" x2={m.x} y2="92" stroke={m.c} strokeWidth="2" />
        <circle cx={m.x} cy="80" r="5" fill={m.c} />
        <text x={m.x} y="58" textAnchor="middle" fontSize="13" fill={m.c} fontWeight="600">{m.t}</text>
        <text x={m.x} y="110" textAnchor="middle" fontSize="11" fill="#6B7280">{m.s}</text>
      </g>
    ))}
    <text x="60" y="30" fontSize="12" fill="#6B7280">abaixo do registro = ANR no relatório</text>
  </svg>
);

const ExpContam: FC = () => (
  <svg width="100%" viewBox="0 0 600 165" role="img" aria-label="Diferença entre exposição e contaminação">
    <rect x="20" y="20" width="270" height="130" rx="10" fill="#EFF6FF" stroke="#93C5FD" />
    <text x="155" y="42" textAnchor="middle" fontSize="13" fill="#1E40AF" fontWeight="600">Exposição</text>
    <circle cx="70" cy="90" r="12" fill="#FACC15" stroke="#CA8A04" />
    {[80, 90, 100].map((y, i) => <line key={i} x1="84" y1={y} x2="150" y2={y} stroke="#EF9F27" strokeWidth="2" />)}
    <circle cx="180" cy="80" r="9" fill="#9CA3AF" /><rect x="171" y="90" width="18" height="24" rx="6" fill="#9CA3AF" />
    <text x="155" y="138" textAnchor="middle" fontSize="11" fill="#6B7280">externa · cessa ao se afastar</text>
    <rect x="310" y="20" width="270" height="130" rx="10" fill="#FEF2F2" stroke="#FCA5A5" />
    <text x="445" y="42" textAnchor="middle" fontSize="13" fill="#B91C1C" fontWeight="600">Contaminação</text>
    <circle cx="445" cy="80" r="9" fill="#9CA3AF" /><rect x="436" y="90" width="18" height="24" rx="6" fill="#9CA3AF" />
    {[[430, 78], [462, 84], [440, 104], [458, 100]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="3" fill="#DC2626" />)}
    <text x="445" y="138" textAnchor="middle" fontSize="11" fill="#6B7280">sobre/dentro · persiste até remover</text>
  </svg>
);

const Instrumentos: FC = () => {
  const items = [
    { t: 'Geiger-Müller', s: 'taxa de exposição' },
    { t: 'Monitor Pancake', s: 'contaminação' },
    { t: 'Curiômetro', s: 'atividade da dose' },
  ];
  return (
    <svg width="100%" viewBox="0 0 600 120" role="img" aria-label="Instrumentação do setor">
      {items.map((it, i) => (
        <g key={i}>
          <rect x={30 + i * 190} y="28" width="170" height="56" rx="10" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <text x={115 + i * 190} y="52" textAnchor="middle" fontSize="13" fill="#334155" fontWeight="600">{it.t}</text>
          <text x={115 + i * 190} y="70" textAnchor="middle" fontSize="11" fill="#64748B">{it.s}</text>
        </g>
      ))}
    </svg>
  );
};

/* ----------------------------- Módulo 6 ----------------------------- */

const Incidentes: FC = () => (
  <svg width="100%" viewBox="0 0 600 150" role="img" aria-label="Conduta em incidentes radiológicos">
    <polygon points="80,30 120,100 40,100" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    <text x="80" y="92" textAnchor="middle" fontSize="22" fill="#B45309" fontWeight="700">!</text>
    <text x="80" y="124" textAnchor="middle" fontSize="11" fill="#92400E">incidente</text>
    <text x="200" y="50" fontSize="13" fill="#374151" fontWeight="600">O que fazer:</text>
    <text x="200" y="74" fontSize="12" fill="#6B7280">1. comunicar o responsável pelo laboratório</text>
    <text x="200" y="96" fontSize="12" fill="#6B7280">2. acionar o supervisor de proteção (SPR)</text>
    <text x="200" y="118" fontSize="12" fill="#6B7280">3. registrar o ocorrido</text>
  </svg>
);

const Rastreabilidade: FC = () => (
  <svg width="100%" viewBox="0 0 600 130" role="img" aria-label="Fluxo de rastreabilidade das doses">
    <defs><marker id="rt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#6B7280" strokeWidth="1.5" /></marker></defs>
    {['Seringa', 'Frasco / blindagem', 'Administração'].map((t, i) => (
      <g key={i}>
        <rect x={20 + i * 200} y="45" width="160" height="46" rx="10" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" />
        <text x={100 + i * 200} y="73" textAnchor="middle" fontSize="13" fill="#5B21B6" fontWeight="600">{t}</text>
        {i < 2 && <line x1={180 + i * 200} y1="68" x2={216 + i * 200} y2="68" stroke="#6B7280" strokeWidth="2" markerEnd="url(#rt)" />}
      </g>
    ))}
    <text x="300" y="115" textAnchor="middle" fontSize="11" fill="#6B7280">identificação em cada etapa = menos trocas e atrasos</text>
  </svg>
);

const Rejeito: FC = () => (
  <svg width="100%" viewBox="0 0 600 150" role="img" aria-label="Rejeito radioativo em decaimento até liberação">
    <rect x="40" y="30" width="200" height="90" rx="10" fill="#F1F5F9" stroke="#94A3B8" />
    <text x="140" y="22" textAnchor="middle" fontSize="12" fill="#475569">depósito de decaimento</text>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={60 + i * 42} y={110 - (70 - i * 18)} width="26" height={70 - i * 18} rx="3" fill="#FCA5A5" />
    ))}
    <line x1="260" y1="75" x2="320" y2="75" stroke="#16A34A" strokeWidth="2" markerEnd="url(#rj)" />
    <defs><marker id="rj" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#16A34A" strokeWidth="1.5" /></marker></defs>
    <text x="420" y="62" textAnchor="middle" fontSize="13" fill="#166534" fontWeight="600">Liberação segura</text>
    <text x="420" y="82" textAnchor="middle" fontSize="11" fill="#6B7280">quando a taxa cai ao nível permitido</text>
  </svg>
);

const Encerramento: FC = () => {
  const itens = ['Usar o dosímetro sempre', 'Aplicar o princípio ALARA', 'Comunicar incidentes ao SPR', 'Manter a cultura de segurança'];
  return (
    <svg width="100%" viewBox="0 0 600 165" role="img" aria-label="Responsabilidades do IOE e reciclagem anual">
      {itens.map((t, i) => (
        <g key={i}>
          <circle cx="50" cy={32 + i * 30} r="9" fill="#DCFCE7" stroke="#16A34A" />
          <path d={`M45 ${32 + i * 30} l4 4 l7 -8`} fill="none" stroke="#16A34A" strokeWidth="2" />
          <text x="70" y={37 + i * 30} fontSize="13" fill="#374151">{t}</text>
        </g>
      ))}
      <rect x="380" y="60" width="190" height="50" rx="12" fill="#FEF9C3" stroke="#CA8A04" />
      <text x="475" y="82" textAnchor="middle" fontSize="13" fill="#854D0E" fontWeight="600">Reciclagem anual</text>
      <text x="475" y="100" textAnchor="middle" fontSize="11" fill="#A16207">re-treinamento a cada 12 meses</text>
    </svg>
  );
};

/* ----------------------------- Mapa ----------------------------- */

export const SLIDE_VISUALS: Record<string, FC> = {
  title: Title,
  radiofarmaco: Radiofarmaco,
  ionizante: Ionizante,
  penetracao: Penetracao,
  distancia: Distancia,
  decaimento: Decaimento,
  meia_vida: MeiaVida,
  meia_vida_efetiva: MeiaVidaEfetiva,
  celula: Celula,
  efeitos: Efeitos,
  fontes_naturais: FontesNaturais,
  alara: Alara,
  tempo: Tempo,
  blindagem: Blindagem,
  epis: Epis,
  limites: Limites,
  dosimetro: Dosimetro,
  niveis: Niveis,
  exp_contam: ExpContam,
  instrumentos: Instrumentos,
  incidentes: Incidentes,
  rastreabilidade: Rastreabilidade,
  rejeito: Rejeito,
  encerramento: Encerramento,
};
