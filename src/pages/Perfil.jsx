import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gerarCardapio } from '../lib/gemini'
import { useCardapio } from '../hooks/useCardapio'

const objetivos = ['ganhar massa', 'perder gordura', 'manter peso']
const restricoes = ['aveia pura', 'iogurte natural', 'frango', 'carne vermelha', 'peixe', 'glúten', 'lactose', 'ovos']
const frequencias = ['não treino', '1–2x', '3–4x', '5+ dias']

export default function Perfil() {
  const navigate = useNavigate()
  const { salvarCardapio } = useCardapio()
  const perfilSalvo = JSON.parse(localStorage.getItem('fitness_perfil') || '{}')

  const [perfil, setPerfil] = useState({
    nome: perfilSalvo.nome || '',
    peso: perfilSalvo.peso || '',
    altura: perfilSalvo.altura || '',
    objetivo: perfilSalvo.objetivo || 'ganhar massa',
    restricoes: perfilSalvo.restricoes || [],
    treino: perfilSalvo.treino || '3–4x',
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  function toggleRestricao(r) {
    setPerfil(p => ({
      ...p,
      restricoes: p.restricoes.includes(r)
        ? p.restricoes.filter(x => x !== r)
        : [...p.restricoes, r]
    }))
  }

  async function gerarCardapioIA() {
    if (!perfil.nome || !perfil.peso || !perfil.altura) {
      setErro('preenche nome, peso e altura antes de continuar')
      return
    }
    setErro(null)
    setLoading(true)
    try {
      localStorage.setItem('fitness_perfil', JSON.stringify(perfil))
      const cardapio = await gerarCardapio(perfil)
      salvarCardapio(cardapio)
      navigate('/')
    } catch (e) {
      setErro('erro ao gerar cardápio. verifique sua chave do Gemini no .env')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-2 gap-4">

      <div>
        <p className="text-xs text-zinc-500">meu perfil</p>
        <p className="text-lg font-medium text-zinc-100">me conta sobre você</p>
      </div>

      <div className="bg-[#151515] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-300 mb-1">dados básicos</p>
        <input
          type="text"
          placeholder="seu nome"
          value={perfil.nome}
          onChange={e => setPerfil(p => ({ ...p, nome: e.target.value }))}
          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-green-800"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="peso (kg)"
            value={perfil.peso}
            onChange={e => setPerfil(p => ({ ...p, peso: e.target.value }))}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-green-800"
          />
          <input
            type="number"
            placeholder="altura (cm)"
            value={perfil.altura}
            onChange={e => setPerfil(p => ({ ...p, altura: e.target.value }))}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-green-800"
          />
        </div>
      </div>

      <div className="bg-[#151515] border border-white/5 rounded-2xl p-4">
        <p className="text-sm font-medium text-zinc-300 mb-3">qual é seu objetivo?</p>
        <div className="flex flex-wrap gap-2">
          {objetivos.map(o => (
            <button
              key={o}
              onClick={() => setPerfil(p => ({ ...p, objetivo: o }))}
              className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer bg-transparent transition-all ${perfil.objetivo === o ? 'bg-green-950 text-green-400 border-green-800' : 'text-zinc-600 border-white/10'}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#151515] border border-white/5 rounded-2xl p-4">
        <p className="text-sm font-medium text-zinc-300 mb-1">o que você não come?</p>
        <p className="text-xs text-zinc-600 mb-3">restrições, alergias ou simplesmente não curte</p>
        <div className="flex flex-wrap gap-2">
          {restricoes.map(r => (
            <button
              key={r}
              onClick={() => toggleRestricao(r)}
              className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer bg-transparent transition-all ${perfil.restricoes.includes(r) ? 'bg-red-950 text-red-400 border-red-900' : 'text-zinc-600 border-white/10'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#151515] border border-white/5 rounded-2xl p-4">
        <p className="text-sm font-medium text-zinc-300 mb-3">quanto você treina por semana?</p>
        <div className="flex flex-wrap gap-2">
          {frequencias.map(f => (
            <button
              key={f}
              onClick={() => setPerfil(p => ({ ...p, treino: f }))}
              className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer bg-transparent transition-all ${perfil.treino === f ? 'bg-green-950 text-green-400 border-green-800' : 'text-zinc-600 border-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {erro && (
        <p className="text-xs text-red-400 text-center bg-red-950/30 border border-red-900/30 rounded-xl px-3 py-2">{erro}</p>
      )}

      <button
        onClick={gerarCardapioIA}
        disabled={loading}
        className="w-full py-3.5 bg-green-400 text-[#0a1a02] rounded-2xl text-sm font-medium cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? 'gerando seu cardápio...' : 'gerar meu cardápio com IA'}
      </button>

      {loading && (
        <p className="text-xs text-zinc-600 text-center -mt-2">
          isso pode levar alguns segundos...
        </p>
      )}
    </div>
  )
}
