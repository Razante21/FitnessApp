import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { gerarCardapio } from '../lib/gemini'

const objetivos = ['ganhar massa', 'perder gordura', 'manter peso']
const frequencias = ['não treino', '1–2x', '3–4x', '5+ dias']

// banco de sugestões com variações
const bancoDeSugestoes = [
  // proteínas
  { alimento: 'atum em lata', grupo: 'atum' },
  { alimento: 'atum fresco', grupo: 'atum' },
  { alimento: 'atum de qualquer forma', grupo: 'atum' },
  { alimento: 'frango', grupo: 'frango' },
  { alimento: 'peito de frango', grupo: 'frango' },
  { alimento: 'frango desfiado', grupo: 'frango' },
  { alimento: 'carne vermelha', grupo: 'carne' },
  { alimento: 'carne moída', grupo: 'carne' },
  { alimento: 'bife', grupo: 'carne' },
  { alimento: 'carne de porco', grupo: 'carne' },
  { alimento: 'peixe', grupo: 'peixe' },
  { alimento: 'salmão', grupo: 'peixe' },
  { alimento: 'tilápia', grupo: 'peixe' },
  { alimento: 'sardinha', grupo: 'peixe' },
  { alimento: 'ovos', grupo: 'ovos' },
  { alimento: 'ovo cozido', grupo: 'ovos' },
  { alimento: 'ovo mexido', grupo: 'ovos' },
  // carboidratos
  { alimento: 'arroz', grupo: 'arroz' },
  { alimento: 'arroz branco', grupo: 'arroz' },
  { alimento: 'arroz integral', grupo: 'arroz' },
  { alimento: 'feijão', grupo: 'feijão' },
  { alimento: 'feijão preto', grupo: 'feijão' },
  { alimento: 'feijão carioca', grupo: 'feijão' },
  { alimento: 'macarrão', grupo: 'macarrão' },
  { alimento: 'pão', grupo: 'pão' },
  { alimento: 'pão de forma', grupo: 'pão' },
  { alimento: 'pão integral', grupo: 'pão' },
  { alimento: 'batata', grupo: 'batata' },
  { alimento: 'batata cozida', grupo: 'batata' },
  { alimento: 'batata frita', grupo: 'batata' },
  { alimento: 'batata doce', grupo: 'batata doce' },
  { alimento: 'aveia', grupo: 'aveia' },
  { alimento: 'aveia pura', grupo: 'aveia' },
  // laticínios
  { alimento: 'leite', grupo: 'leite' },
  { alimento: 'leite integral', grupo: 'leite' },
  { alimento: 'queijo', grupo: 'queijo' },
  { alimento: 'iogurte', grupo: 'iogurte' },
  { alimento: 'iogurte natural', grupo: 'iogurte' },
  { alimento: 'requeijão', grupo: 'requeijão' },
  // vegetais
  { alimento: 'tomate', grupo: 'tomate' },
  { alimento: 'tomate cru', grupo: 'tomate' },
  { alimento: 'tomate cereja', grupo: 'tomate' },
  { alimento: 'molho de tomate', grupo: 'tomate' },
  { alimento: 'tomate de qualquer forma', grupo: 'tomate' },
  { alimento: 'brócolis', grupo: 'brócolis' },
  { alimento: 'alface', grupo: 'alface' },
  { alimento: 'cebola', grupo: 'cebola' },
  { alimento: 'cebola crua', grupo: 'cebola' },
  { alimento: 'cebola refogada', grupo: 'cebola' },
  { alimento: 'alho', grupo: 'alho' },
  { alimento: 'pepino', grupo: 'pepino' },
  { alimento: 'cenoura', grupo: 'cenoura' },
  // frutas
  { alimento: 'banana', grupo: 'banana' },
  { alimento: 'maçã', grupo: 'maçã' },
  { alimento: 'laranja', grupo: 'laranja' },
  { alimento: 'mamão', grupo: 'mamão' },
  { alimento: 'abacate', grupo: 'abacate' },
  // outros
  { alimento: 'glúten', grupo: 'glúten' },
  { alimento: 'lactose', grupo: 'lactose' },
  { alimento: 'amendoim', grupo: 'amendoim' },
  { alimento: 'castanhas', grupo: 'castanhas' },
  { alimento: 'castanha de caju', grupo: 'castanhas' },
  { alimento: 'amendoim de qualquer forma', grupo: 'amendoim' },
  { alimento: 'açúcar', grupo: 'açúcar' },
  { alimento: 'fritura', grupo: 'fritura' },
  { alimento: 'comida apimentada', grupo: 'apimentado' },
]

function normalizar(r) {
  if (typeof r === "string") {
    try { const p = JSON.parse(r); if (p.alimento) return p } catch { }
  }
  if (typeof r === 'string') return { alimento: r, obs: '' }
  return r
}

export default function Perfil() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState({ nome: '', peso: '', altura: '', objetivo: 'ganhar massa', restricoes: [], treino: '3–4x' })
  const [query, setQuery] = useState('')
  const [sugestoesFiltradas, setSugestoesFiltradas] = useState([])
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function carregarPerfil() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single()
      if (data) setPerfil({ nome: data.nome || '', peso: data.peso || '', altura: data.altura || '', objetivo: data.objetivo || 'ganhar massa', restricoes: (data.restricoes || []).map(r => typeof r === "string" ? JSON.parse(r) : r), treino: data.treino || '3–4x' })
      setLoading(false)
    }
    carregarPerfil()
  }, [])

  useEffect(() => {
    if (!query.trim()) { setSugestoesFiltradas([]); return }
    const q = query.toLowerCase()
    const jaAdicionados = perfil.restricoes.map(r => normalizar(r).alimento)
    const filtradas = bancoDeSugestoes
      .filter(s => s.alimento.includes(q) && !jaAdicionados.includes(s.alimento))
      .slice(0, 6)
    // adiciona opção de digitar livremente se não tiver match exato
    const temExato = filtradas.some(s => s.alimento === q)
    if (!temExato && !jaAdicionados.includes(q)) {
      filtradas.push({ alimento: query.trim(), grupo: 'custom' })
    }
    setSugestoesFiltradas(filtradas)
    setMostrarDropdown(true)
  }, [query, perfil.restricoes])

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && e.target !== inputRef.current) {
        setMostrarDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function adicionar(alimento) {
    const val = alimento.trim().toLowerCase()
    if (!val) return
    const jaExiste = perfil.restricoes.some(r => normalizar(r).alimento === val)
    if (jaExiste) return
    setPerfil(p => ({ ...p, restricoes: [...p.restricoes, { alimento: val, obs: '' }] }))
    setQuery('')
    setSugestoesFiltradas([])
    setMostrarDropdown(false)
    inputRef.current?.focus()
  }

  function remover(alimento) {
    setPerfil(p => ({ ...p, restricoes: p.restricoes.filter(r => normalizar(r).alimento !== alimento) }))
  }

  async function salvarPerfil() {
    setSalvando(true); setErro(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('perfis').upsert({ id: user.id, nome: perfil.nome, peso: parseFloat(perfil.peso), altura: parseInt(perfil.altura), objetivo: perfil.objetivo, restricoes: perfil.restricoes, treino: perfil.treino, atualizado_em: new Date().toISOString() })
    if (error) setErro('erro ao salvar perfil')
    else { setSucesso(true); setTimeout(() => setSucesso(false), 2000) }
    setSalvando(false)
  }

  async function gerarCardapioIA() {
    if (!perfil.nome || !perfil.peso || !perfil.altura) { setErro('preenche nome, peso e altura antes'); return }
    setErro(null); setSalvando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('perfis').upsert({ id: user.id, nome: perfil.nome, peso: parseFloat(perfil.peso), altura: parseInt(perfil.altura), objetivo: perfil.objetivo, restricoes: perfil.restricoes, treino: perfil.treino, atualizado_em: new Date().toISOString() })
      const cardapio = await gerarCardapio(perfil)
      await supabase.from('cardapios').delete().eq('user_id', user.id)
      await supabase.from('cardapios').insert({ user_id: user.id, calorias_meta: cardapio.calorias_meta, proteina_meta: cardapio.proteina_meta, dados: cardapio })
      localStorage.setItem('fitness_cardapio', JSON.stringify(cardapio))
      navigate('/')
    } catch (e) { setErro('erro ao gerar cardápio — verifique a chave do Gemini no Vercel') }
    setSalvando(false)
  }

  async function sair() { await supabase.auth.signOut() }

  const inp = { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', width: '100%' }
  const card = { background: '#151515', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16 }
  const chipObj = (ativo) => ({ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: `1px solid ${ativo ? '#3b6d11' : 'rgba(255,255,255,0.08)'}`, background: ativo ? '#1a3a0a' : 'transparent', color: ativo ? '#7ab82e' : '#71717a', cursor: 'pointer', fontFamily: 'inherit' })

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}><div style={{ width: 24, height: 24, border: '2px solid #7ab82e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>meu perfil</p>
          <p style={{ fontSize: 20, fontWeight: 500, color: 'white', margin: '2px 0 0' }}>{perfil.nome || 'você'}</p>
        </div>
        <button onClick={sair} style={{ fontSize: 12, color: '#71717a', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>sair</button>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d4d4', marginBottom: 12 }}>dados básicos</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input style={inp} type="text" placeholder="seu nome" value={perfil.nome} onChange={e => setPerfil(p => ({ ...p, nome: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input style={inp} type="number" placeholder="peso (kg)" value={perfil.peso} onChange={e => setPerfil(p => ({ ...p, peso: e.target.value }))} />
            <input style={inp} type="number" placeholder="altura (cm)" value={perfil.altura} onChange={e => setPerfil(p => ({ ...p, altura: e.target.value }))} />
          </div>
        </div>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d4d4', marginBottom: 12 }}>objetivo</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {objetivos.map(o => <button key={o} onClick={() => setPerfil(p => ({ ...p, objetivo: o }))} style={chipObj(perfil.objetivo === o)}>{o}</button>)}
        </div>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d4d4', marginBottom: 4 }}>o que você não come?</p>
        <p style={{ fontSize: 11, color: '#71717a', marginBottom: 12 }}>digita e seleciona nas sugestões — quanto mais específico melhor</p>

        {/* tags adicionadas */}
        {perfil.restricoes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {perfil.restricoes.map(r => {
              const { alimento } = normalizar(r)
              return (
                <span key={alimento} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '5px 10px 5px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  {alimento}
                  <button onClick={() => remover(alimento)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0 2px', fontSize: 15, lineHeight: 1, opacity: 0.7 }}>×</button>
                </span>
              )
            })}
          </div>
        )}

        {/* input com autocomplete */}
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            style={inp}
            type="text"
            placeholder="ex: atum, tomate cru, feijão..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query && setMostrarDropdown(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) { adicionar(query); e.preventDefault() }
              if (e.key === 'Escape') setMostrarDropdown(false)
            }}
          />
          {mostrarDropdown && sugestoesFiltradas.length > 0 && (
            <div ref={dropdownRef} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, marginTop: 4, overflow: 'hidden', zIndex: 100 }}>
              {sugestoesFiltradas.map((s, i) => (
                <button
                  key={i}
                  onClick={() => adicionar(s.alimento)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', color: s.grupo === 'custom' ? '#a3a3a3' : '#e5e5e5', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', borderBottom: i < sugestoesFiltradas.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  {s.grupo === 'custom' ? `+ adicionar "${s.alimento}"` : s.alimento}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d4d4', marginBottom: 12 }}>frequência de treino</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {frequencias.map(f => <button key={f} onClick={() => setPerfil(p => ({ ...p, treino: f }))} style={chipObj(perfil.treino === f)}>{f}</button>)}
        </div>
      </div>

      {erro && <p style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '8px 12px', margin: 0 }}>{erro}</p>}
      {sucesso && <p style={{ fontSize: 12, color: '#7ab82e', background: 'rgba(122,184,46,0.1)', border: '1px solid rgba(122,184,46,0.2)', borderRadius: 10, padding: '8px 12px', margin: 0 }}>perfil salvo!</p>}

      <button onClick={salvarPerfil} disabled={salvando} style={{ width: '100%', padding: 13, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: '#d4d4d4', cursor: 'pointer', fontFamily: 'inherit' }}>
        {salvando ? 'salvando...' : 'salvar perfil'}
      </button>

      <button onClick={gerarCardapioIA} disabled={salvando} style={{ width: '100%', padding: 13, background: '#7ab82e', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#0a1a02', cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1, fontFamily: 'inherit' }}>
        {salvando ? 'gerando cardápio...' : '✦ gerar meu cardápio com IA'}
      </button>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}