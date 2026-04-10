import { useNavigate } from 'react-router-dom'
import { useCardapio } from '../hooks/useCardapio'

export default function Dashboard() {
  const navigate = useNavigate()
  const { cardapio, done, kcalConsumidas, totalFeitas, totalRefeicoes } = useCardapio()
  const perfil = JSON.parse(localStorage.getItem('fitness_perfil') || '{}')
  const pct = cardapio ? Math.round((kcalConsumidas / cardapio.calorias_meta) * 100) : 0

  const proximasRefeicoes = cardapio?.refeicoes?.filter(r => !done[r.id]).slice(0, 3) || []

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-2 gap-4">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">bom dia,</p>
          <p className="text-lg font-medium text-zinc-100">{perfil.nome || 'você'}</p>
        </div>
        <div
          className="w-9 h-9 rounded-full bg-green-950 flex items-center justify-center text-green-400 text-sm font-medium cursor-pointer"
          onClick={() => navigate('/perfil')}
        >
          {(perfil.nome || 'U')[0].toUpperCase()}
        </div>
      </div>

      {cardapio ? (
        <>
          <div className="bg-[#151515] border border-white/5 rounded-2xl p-4">
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2">calorias hoje</p>
            <p className="text-4xl font-medium text-zinc-100 leading-none">
              {kcalConsumidas.toLocaleString('pt-BR')}
              <span className="text-sm text-zinc-500 font-normal"> / {cardapio.calorias_meta.toLocaleString('pt-BR')} kcal</span>
            </p>
            <p className="text-xs text-zinc-600 mt-1">{pct}% da meta diária</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <p className="text-[11px] text-zinc-600 whitespace-nowrap">
                faltam {(cardapio.calorias_meta - kcalConsumidas).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#151515] border border-white/5 rounded-2xl p-3">
              <p className="text-base mb-1">🥩</p>
              <p className="text-[11px] text-zinc-500 mb-1">proteína meta</p>
              <p className="text-base font-medium text-zinc-100">{cardapio.proteina_meta}g</p>
            </div>
            <div className="bg-[#151515] border border-white/5 rounded-2xl p-3">
              <p className="text-base mb-1">✅</p>
              <p className="text-[11px] text-zinc-500 mb-1">refeições feitas</p>
              <p className="text-base font-medium text-zinc-100">{totalFeitas} <span className="text-zinc-500 font-normal text-sm">/ {totalRefeicoes}</span></p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">próximas refeições</p>
              <button onClick={() => navigate('/cardapio')} className="text-xs text-green-400 bg-transparent border-none cursor-pointer">ver todas</button>
            </div>
            <div className="flex flex-col gap-2">
              {proximasRefeicoes.length === 0 ? (
                <div className="bg-[#151515] border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-sm text-green-400 font-medium">todas as refeições concluídas!</p>
                  <p className="text-xs text-zinc-600 mt-1">ótimo dia 💪</p>
                </div>
              ) : proximasRefeicoes.map(r => (
                <div key={r.id} onClick={() => navigate('/cardapio')} className="bg-[#151515] border border-white/5 rounded-2xl p-3 flex items-center gap-3 cursor-pointer active:opacity-70">
                  <div className="w-2 h-2 rounded-full bg-zinc-700 border border-zinc-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200">{r.nome}</p>
                    <p className="text-xs text-zinc-600 truncate">{r.itens?.slice(0,2).map(i => i.nome).join(' · ')}</p>
                  </div>
                  <p className="text-xs text-zinc-600 whitespace-nowrap">{r.kcal} kcal</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-950 flex items-center justify-center text-3xl">🥗</div>
          <div>
            <p className="text-base font-medium text-zinc-200 mb-1">nenhum cardápio ainda</p>
            <p className="text-sm text-zinc-600">responda algumas perguntas e a IA monta tudo pra você</p>
          </div>
          <button
            onClick={() => navigate('/perfil')}
            className="px-6 py-3 bg-green-400 text-[#0a1a02] rounded-2xl text-sm font-medium cursor-pointer border-none"
          >
            criar meu cardápio com IA
          </button>
        </div>
      )}
    </div>
  )
}
