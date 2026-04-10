import { useState, useEffect, useRef } from 'react'

const treinos = {
  'Peito + Tríceps': [
    { id: 'supino', nome: 'Supino reto', series: 4, reps: 10, descanso: 90 },
    { id: 'crucifixo', nome: 'Crucifixo inclinado', series: 3, reps: 12, descanso: 75 },
    { id: 'triceps', nome: 'Tríceps corda', series: 4, reps: 15, descanso: 60 },
    { id: 'mergulho', nome: 'Mergulho no banco', series: 3, reps: 12, descanso: 60 },
  ],
  'Costas + Bíceps': [
    { id: 'pulldown', nome: 'Pulldown na polia', series: 4, reps: 10, descanso: 90 },
    { id: 'remada', nome: 'Remada curvada', series: 4, reps: 10, descanso: 90 },
    { id: 'biceps', nome: 'Rosca direta', series: 3, reps: 12, descanso: 60 },
    { id: 'martelo', nome: 'Rosca martelo', series: 3, reps: 12, descanso: 60 },
  ],
  'Pernas': [
    { id: 'agachamento', nome: 'Agachamento livre', series: 4, reps: 8, descanso: 120 },
    { id: 'leg', nome: 'Leg press 45°', series: 4, reps: 12, descanso: 90 },
    { id: 'cadeira', nome: 'Cadeira extensora', series: 3, reps: 15, descanso: 60 },
    { id: 'stiff', nome: 'Stiff', series: 3, reps: 12, descanso: 75 },
  ],
}

export default function Treino() {
  const [grupoAtivo, setGrupoAtivo] = useState('Peito + Tríceps')
  const [seriesFeitas, setSeriesFeitas] = useState({})
  const [timer, setTimer] = useState(null)
  const [timerAtivo, setTimerAtivo] = useState(false)
  const [timerExercicio, setTimerExercicio] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (timerAtivo && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setTimerAtivo(false)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerAtivo])

  function iniciarTimer(exercicioId, segundos) {
    clearInterval(intervalRef.current)
    setTimerExercicio(exercicioId)
    setTimer(segundos)
    setTimerAtivo(true)
  }

  function pararTimer() {
    clearInterval(intervalRef.current)
    setTimerAtivo(false)
    setTimerExercicio(null)
    setTimer(null)
  }

  function marcarSerie(exercicioId, descanso) {
    setSeriesFeitas(prev => {
      const atual = prev[exercicioId] || 0
      const max = treinos[grupoAtivo].find(e => e.id === exercicioId)?.series || 0
      const novo = Math.min(atual + 1, max)
      return { ...prev, [exercicioId]: novo }
    })
    iniciarTimer(exercicioId, descanso)
  }

  function resetarTreino() {
    setSeriesFeitas({})
    pararTimer()
  }

  function formatarTempo(s) {
    const m = Math.floor(s / 60)
    const seg = s % 60
    return `${m}:${seg.toString().padStart(2, '0')}`
  }

  const exercicios = treinos[grupoAtivo]
  const totalSeries = exercicios.reduce((s, e) => s + e.series, 0)
  const seriesConcluidas = exercicios.reduce((s, e) => s + (seriesFeitas[e.id] || 0), 0)

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-2 gap-4">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">treino de hoje</p>
          <p className="text-lg font-medium text-zinc-100">{grupoAtivo}</p>
        </div>
        <button onClick={resetarTreino} className="text-xs text-zinc-600 border border-white/10 rounded-xl px-3 py-1.5 bg-transparent cursor-pointer">
          reiniciar
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {Object.keys(treinos).map(g => (
          <button
            key={g}
            onClick={() => { setGrupoAtivo(g); setSeriesFeitas({}); pararTimer() }}
            className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap cursor-pointer bg-transparent flex-shrink-0 transition-all ${grupoAtivo === g ? 'bg-green-950 text-green-400 border-green-800' : 'text-zinc-600 border-white/10'}`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="bg-[#151515] border border-white/5 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-zinc-500">{seriesConcluidas} de {totalSeries} séries</p>
          <p className="text-xs text-zinc-500">{Math.round((seriesConcluidas / totalSeries) * 100)}%</p>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${(seriesConcluidas / totalSeries) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {exercicios.map(ex => {
          const feitas = seriesFeitas[ex.id] || 0
          const completo = feitas >= ex.series
          const timerAquiAtivo = timerExercicio === ex.id && timer !== null

          return (
            <div key={ex.id} className={`bg-[#151515] border rounded-2xl p-4 transition-opacity ${completo ? 'opacity-50 border-white/5' : 'border-white/5'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-zinc-200">{ex.nome}</p>
                <span className="text-xs bg-green-950 text-green-400 px-2.5 py-1 rounded-full">
                  {ex.series} × {ex.reps}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap mb-3">
                {Array.from({ length: ex.series }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${i < feitas ? 'bg-green-950 text-green-400 border-green-800' : 'text-zinc-600 border-white/10'}`}
                  >
                    série {i + 1}{i < feitas ? ' ✓' : ''}
                  </span>
                ))}
              </div>

              {timerAquiAtivo ? (
                <div className="bg-green-950/30 border border-green-900/30 rounded-xl px-3 py-2.5 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-2xl font-medium text-green-400 tabular-nums">{formatarTempo(timer)}</p>
                    <p className="text-xs text-green-800">descanso restante</p>
                  </div>
                  <button
                    onClick={pararTimer}
                    className="w-8 h-8 rounded-full bg-green-950 border border-green-800 flex items-center justify-center cursor-pointer"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-400">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              ) : (
                !completo && (
                  <button
                    onClick={() => marcarSerie(ex.id, ex.descanso)}
                    className="w-full py-2.5 bg-transparent border border-white/10 rounded-xl text-xs text-zinc-400 cursor-pointer active:opacity-70 transition-all hover:border-green-800 hover:text-green-400"
                  >
                    marcar série {feitas + 1} → iniciar {ex.descanso}s de descanso
                  </button>
                )
              )}

              {completo && (
                <p className="text-xs text-green-400 text-center">concluído 💪</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
