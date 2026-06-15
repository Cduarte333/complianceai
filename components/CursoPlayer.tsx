'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { SLIDE_VISUALS } from '@/components/slideVisuals';

type Emp = { id: string; full_name: string };
type Course = { id: string; control_id: string | null; title: string; quiz_max_seconds: number; pass_score: number };
type Slide = { id: string; position: number; title: string | null; body: string | null; min_seconds: number; visual_key: string | null };
type Opt = { id: string; label: string; is_correct: boolean };
type Question = { id: string; position: number; statement: string; options: Opt[] };
type Phase = 'select' | 'aula' | 'quiz' | 'result';

type Props = {
  onCompleted?: () => void;
  lockedEmployeeId?: string;
  lockedEmployeeName?: string;
  allowReview?: boolean;
};

export default function CursoPlayer({ onCompleted, lockedEmployeeId, allowReview = true }: Props) {
  const locked = !!lockedEmployeeId;
  const [emps, setEmps] = useState<Emp[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [empId, setEmpId] = useState(lockedEmployeeId ?? '');
  const [course, setCourse] = useState<Course | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [phase, setPhase] = useState<Phase>('select');
  const [reviewMode, setReviewMode] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [secOnSlide, setSecOnSlide] = useState(0);
  const [readingSec, setReadingSec] = useState(0);
  const [quizLeft, setQuizLeft] = useState(0);
  const [quizSec, setQuizSec] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const answersRef = useRef<Record<string, string>>({});
  const submittedRef = useRef(false);
  const readingSecRef = useRef(0);
  const quizSecRef = useRef(0);

  useEffect(() => { load(); }, []);
  async function load() {
    if (!locked) {
      const { data: e } = await supabase.from('employees').select('id, full_name').order('full_name');
      setEmps((e as Emp[]) || []);
    }
    const { data: c } = await supabase.from('courses').select('id, control_id, title, quiz_max_seconds, pass_score').eq('is_active', true);
    const list = (c as Course[]) || [];
    setCourses(list);
    if (locked && list.length === 1) selectCourse(list[0].id, list);
  }

  async function selectCourse(id: string, list?: Course[]) {
    const pool = list ?? courses;
    const c = pool.find((x) => x.id === id) || null;
    setCourse(c);
    if (!c) { setSlides([]); setQuestions([]); return; }
    const { data: sl } = await supabase.from('course_slides').select('*').eq('course_id', id).order('position');
    const { data: qs } = await supabase
      .from('course_questions')
      .select('id, position, statement, course_options(id, label, is_correct)')
      .eq('course_id', id).order('position');
    setSlides((sl as Slide[]) || []);
    setQuestions(((qs as any[]) || []).map((q) => ({
      id: q.id, position: q.position, statement: q.statement, options: q.course_options || [],
    })));
  }

  useEffect(() => {
    if (phase !== 'aula') return;
    const t = setInterval(() => {
      readingSecRef.current += 1;
      setReadingSec(readingSecRef.current);
      setSecOnSlide((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => { setSecOnSlide(0); }, [slideIdx]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    const t = setInterval(() => {
      quizSecRef.current += 1;
      setQuizSec(quizSecRef.current);
      setQuizLeft((l) => { if (l <= 1) { clearInterval(t); submitQuiz(); return 0; } return l - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  function startCourse() {
    if (!empId) { alert('Identificação não encontrada.'); return; }
    if (!course) { alert('Selecione o curso.'); return; }
    if (slides.length === 0) { alert('Este curso ainda não tem slides.'); return; }
    submittedRef.current = false;
    answersRef.current = {};
    readingSecRef.current = 0;
    quizSecRef.current = 0;
    setAnswers({});
    setSlideIdx(0); setSecOnSlide(0); setReadingSec(0);
    setQuizSec(0); setQuizLeft(course.quiz_max_seconds);
    setScore(0); setPassed(false);
    setPhase('aula');
  }

  function nextSlide() {
    if (slideIdx < slides.length - 1) setSlideIdx((i) => i + 1);
    else setPhase('quiz');
  }

  function choose(qid: string, oid: string) {
    answersRef.current[qid] = oid;
    setAnswers({ ...answersRef.current });
  }

  async function submitQuiz() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setPhase('result');
    let correct = 0;
    questions.forEach((q) => {
      const chosen = answersRef.current[q.id];
      const right = q.options.find((o) => o.is_correct);
      if (chosen && right && chosen === right.id) correct++;
    });
    const sc = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const ok = sc >= (course?.pass_score ?? 70);
    setScore(sc); setPassed(ok);

    await supabase.from('course_attempts').insert([{
      course_id: course!.id, employee_id: empId,
      reading_seconds: readingSecRef.current, quiz_seconds: quizSecRef.current,
      score: sc, passed: ok, finished_at: new Date().toISOString(),
    }]);

    if (ok && course?.control_id) {
      await supabase.from('employee_trainings').upsert(
        [{ employee_id: empId, control_id: course.control_id, status: 'concluido', score: sc, completed_at: new Date().toISOString() }],
        { onConflict: 'employee_id,control_id' }
      );
    }
    onCompleted?.();
  }

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (phase === 'select') {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="font-semibold mb-4 text-gray-700">Iniciar Treinamento</h2>
        <div className="flex flex-col gap-4 max-w-md">
          {!locked && (
            <select className="border p-2 rounded" value={empId} onChange={(e) => setEmpId(e.target.value)}>
              <option value="">Selecione o colaborador...</option>
              {emps.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
            </select>
          )}
          <select className="border p-2 rounded" value={course?.id || ''} onChange={(e) => selectCourse(e.target.value)}>
            <option value="">Selecione o curso...</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          {course && (
            <p className="text-sm text-gray-500">
              {slides.length} slide(s) · {questions.length} pergunta(s) · aprovação ≥ {course.pass_score}% · tempo máx. {mmss(course.quiz_max_seconds)}
            </p>
          )}
          {!locked && allowReview && (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={reviewMode} onChange={(e) => setReviewMode(e.target.checked)} />
              Modo revisão (avançar sem esperar o tempo mínimo)
            </label>
          )}
          <button onClick={startCourse} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 self-start">
            Começar aula
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'aula') {
    const s = slides[slideIdx];
    const left = Math.max(0, s.min_seconds - secOnSlide);
    const canNext = reviewMode || secOnSlide >= s.min_seconds;
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Slide {slideIdx + 1} de {slides.length}</span>
          <span>Tempo na aula: {mmss(readingSec)}</span>
        </div>
        <div className="min-h-48 mb-6">
          <h3 className="text-xl font-bold mb-3">{s.title}</h3>
          {s.visual_key && SLIDE_VISUALS[s.visual_key]
            ? (() => { const V = SLIDE_VISUALS[s.visual_key as string]; return <div className="mb-4"><V /></div>; })()
            : null}
          <p className="text-gray-700 whitespace-pre-wrap">{s.body}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {canNext ? 'Você já pode avançar.' : `Aguarde ${left}s para liberar o "Próximo".`}
          </span>
          <button onClick={nextSlide} disabled={!canNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
            {slideIdx < slides.length - 1 ? 'Próximo' : 'Ir para a prova'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'quiz') {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-gray-700">Avaliação</h2>
          <span className={`font-mono text-lg ${quizLeft <= 30 ? 'text-red-600' : 'text-gray-700'}`}>⏱ {mmss(quizLeft)}</span>
        </div>
        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div key={q.id}>
              <p className="font-medium mb-2">{i + 1}. {q.statement}</p>
              <div className="flex flex-col gap-2">
                {q.options.map((o) => (
                  <label key={o.id} className={`flex items-center gap-2 border rounded p-2 cursor-pointer ${answers[q.id] === o.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <input type="radio" name={q.id} checked={answers[q.id] === o.id} onChange={() => choose(q.id, o.id)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submitQuiz} className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
          Enviar avaliação
        </button>
      </div>
    );
  }

  // ----- RESULTADO -----
  // Colaborador (locked): NÃO vê nota nem aprovado/reprovado.
  if (locked) {
    return (
      <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
        <div className="text-5xl mb-3" aria-hidden>✓</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Treinamento finalizado</h2>
        <p className="text-sm text-gray-500">
          Sua avaliação foi enviada e registrada junto ao setor responsável.
        </p>
        <p className="mt-6 text-sm text-gray-400">Você já pode fechar esta página.</p>
      </div>
    );
  }

  // Admin: vê o resultado completo.
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
      <h2 className="font-semibold text-gray-700 mb-2">Resultado</h2>
      <p className="text-5xl font-bold mb-2">{score}%</p>
      <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {passed ? 'Aprovado' : 'Reprovado'}
      </span>
      <p className="text-sm text-gray-500 mt-4">Tempo de aula: {mmss(readingSec)} · Tempo de prova: {mmss(quizSec)}</p>
      <button onClick={() => { setPhase('select'); setEmpId(''); setCourse(null); }} className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
        Concluir
      </button>
    </div>
  );
}
