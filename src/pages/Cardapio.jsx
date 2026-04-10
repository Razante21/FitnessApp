import { useState } from 'react'
import { useCardapio } from '../hooks/useCardapio'

export default function Cardapio() {
  const { cardapio, done, toggleDone, resetDone, totalFeitas, totalRefeicoes } = useCardapio()
  const [aberto, setAberto] = useState(null)
  const [receitaAberta, setReceitaAberta] = useState(null)

  if (!cardapio) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-base font-medium text-zinc-300">nenhum cardápio gerado</p>
        <p className="text-sm text-zinc-600">vá em perfil e deixa a IA montar pra você</p>
      </div>
    )
  }

  const pct = Math.round((totalFeitas / totalRefeicoes) * 100)

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-2 gap-4">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">cardápio de hoje</p>
          <p className="text-lg font-medium text-zinc-100">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
          </p>
        </div>
        <button onClick={resetDone} className="text-xs text-zinc-600 border border-white/10 rounded-xl px-3 py-1.5 bg-transparent cursor-pointer">
          reiniciar
        </button>
      </div>

      <div className="bg-[#151515] border border-white/5 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-zinc-500">{totalFeitas} de {totalRefeicoes} refeições</p>
          <p className="text-xs text-zinc-500">{pct}%</p>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {cardapio.refeicoes.map(r => {
          const feita = done[r.id]
          const estaAberta = aberto === r.id
          const temReceita = receitaAberta === r.id

          return (
            <div key={r.id} className={`bg-[#151515] border rounded-2xl overflow-hidden transition-opacity ${feita ? 'opacity-50 border-white/5' : 'border-white/5'}`}>
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setAberto(estaAberta ? null : r.id)}
              >
                <button
                  onClick={e => { e.stopPropagation(); toggleDone(r.id) }}
                  className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center cursor-pointer bg-transparent transition-all ${feita ? 'bg-green-400 border-green-400' : 'border-zinc-600'}`}
                >
                  {feita && (
                    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#0a1a02" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200">{r.nome}</p>
                  <p className="text-xs text-zinc-600">{r.horario}</p>
                </div>
                <p className="text-xs text-zinc-600">{r.kcal} kcal</p>
                <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-zinc-700 transition-transform ${estaAberta ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>

              {estaAberta && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 flex flex-col gap-2">
                  {r.itens?.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-zinc-300">{item.nome}</p>
                        {item.nota && <p className="text-xs text-zinc-600">{item.nota}</p>}
                      </div>
                    </div>
                  ))}

                  {r.receita && (
                    <button
                      onClick={() => setReceitaAberta(temReceita ? null : r.id)}
                      className="mt-2 w-full text-left bg-amber-950/40 border border-amber-900/30 rounded-xl px-3 py-2.5 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-amber-400 font-medium">receita sugerida</p>
                        <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-amber-600 transition-transform ${temReceita ? 'rotate-180' : ''}`}>
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <p className="text-sm text-zinc-300 mt-0.5">{r.receita.nome}</p>
                      {temReceita && (
                        <div className="mt-3 flex flex-col gap-2">
                          <p className="text-xs text-zinc-500">{r.receita.desc}</p>
                          {r.receita.passos?.map((p, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="w-4 h-4 rounded-full bg-amber-800 text-amber-200 text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                              <p className="text-xs text-zinc-400">{p}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
