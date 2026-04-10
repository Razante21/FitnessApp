import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { gerarCardapio } from '../lib/gemini'

const objetivos = ['ganhar massa', 'perder gordura', 'manter peso']
const restricoes = ['aveia pura', 'iogurte natural', 'frango', 'carne vermelha', 'peixe', 'glúten', 'lactose', 'ovos']
const frequencias = ['não treino', '1–2x', '3–4x', '5+ dias']

export default function Perfil() {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState({ nome: '', peso: '', altura: '', objetivo: 'ganhar massa', restricoes: [], treino: '3–4x' })
  const [loading, setLoading] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    async function carregarPerfil() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single()
      if (data) {
        setPerfil({
          nome: data.nome || '',
          peso: data.peso || '',
          altura: data.altura || '',
          objetivo: data.objetivo || 'ganhar massa',
          restricoes: data.restricoes || [],
          treino: data.treino || '3–4x',
        })
      }
      setLoading(false)
    }
    carregarPerfil()
  }, [])

  function toggleRestricao(r) {
    setPerfil(p => ({
      ...p,
      restricoes: p.restricoes.includes(r) ? p.restricoes.filter(x => x !== r) : [...p.restricoes, r]
    }))
  }

  async function salvarPerfil() {
    setSalvando(true)
    setErro(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('perfis').upsert({
      id: user.id,
      nome: perfil.nome,
      peso: parseFloat(perfil.peso),
      altura: parseInt(perfil.altura),
      objetivo: perfil.objetivo,
      restricoes: perfil.restricoes,
      treino: perfil.treino,
      atualizado_em: new Date().toISOString(),
    })
    if (error) setErro('erro ao salvar perfil')
    else { setSucesso(true); setTimeout(() => setSucesso(false), 2000) }
    setSalvando(false)
  }

  async function gerarCardapioIA() {
    if (!perfil.nome || !perfil.peso || !perfil.altura) { setErro('preenche nome, peso e altura antes'); return }
    setErro(null)
    setSalvando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('perfis').upsert({ id: user.id, nome: perfil.nome, peso: parseFloat(perfil.peso), altura: parseInt(perfil.altura), objetivo: perfil.objetivo, restricoes: perfil.restricoes, treino: perfil.treino, atualizado_em: new Date().toISOString() })
      const cardapio = await gerarCardapio(perfil)
      await supabase.from('cardapios').delete().eq('user_id', user.id)
      await supabase.from('cardapios').insert({ user_id: user.id, calorias_meta: cardapio.calorias_meta, proteina_meta: cardapio.proteina_meta, dados: cardapio })
      localStorage.setItem('fitness_cardapio', JSON.stringify(cardapio))
      navigate('/')
    } catch (e) {
      setErro('erro ao gerar cardápio — verifique a chave do Gemini no Vercel')
    }
    setSalvando(false)
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ width: 24, height: 24, border: '2px solid #7ab82e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  const inp = { width: '100%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: 'white', outline: 'none', boxSizing: 'border-box' }
  const card = { background: '#151515', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px' }
  const chip = (ativo) => ({ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: `1px solid ${ativo ? '#3b6d11' : 'rgba(255,255,255,0.08)'}`, background: ativo ? '#1a3a0a' : 'transparent', color: ativo ? '#7ab82e' : '#71717a', cursor: 'pointer' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>meu perfil</p>
          <p style={{ fontSize: 20, fontWeight: 500, color: 'white', margin: '2px 0 0' }}>{perfil.nome || 'você'}</p>
        </div>
        <button onClick={sair} style={{ fontSize: 12, color: '#71717a', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer' }}>
          sair
        </button>
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
          {objetivos.map(o => <button key={o} onClick={() => setPerfil(p => ({ ...p, objetivo: o }))} style={chip(perfil.objetivo === o)}>{o}</button>)}
        </div>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d4d4', marginBottom: 4 }}>o que você não come?</p>
        <p style={{ fontSize: 11, color: '#71717a', marginBottom: 12 }}>restrições, alergias ou simplesmente não curte</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {restricoes.map(r => <button key={r} onClick={() => toggleRestricao(r)} style={{ ...chip(perfil.restricoes.includes(r)), background: perfil.restricoes.includes(r) ? 'rgba(239,68,68,0.1)' : 'transparent', color: perfil.restricoes.includes(r) ? '#f87171' : '#71717a', borderColor: perfil.restricoes.includes(r) ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)' }}>{r}</button>)}
        </div>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#d4d4d4', marginBottom: 12 }}>frequência de treino</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {frequencias.map(f => <button key={f} onClick={() => setPerfil(p => ({ ...p, treino: f }))} style={chip(perfil.treino === f)}>{f}</button>)}
        </div>
      </div>

      {erro && <p style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '8px 12px' }}>{erro}</p>}
      {sucesso && <p style={{ fontSize: 12, color: '#7ab82e', background: 'rgba(122,184,46,0.1)', border: '1px solid rgba(122,184,46,0.2)', borderRadius: 10, padding: '8px 12px' }}>perfil salvo!</p>}

      <button onClick={salvarPerfil} disabled={salvando} style={{ width: '100%', padding: 13, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, color: '#d4d4d4', cursor: 'pointer' }}>
        {salvando ? 'salvando...' : 'salvar perfil'}
      </button>

      <button onClick={gerarCardapioIA} disabled={salvando} style={{ width: '100%', padding: 13, background: '#7ab82e', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#0a1a02', cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1 }}>
        {salvando ? 'gerando cardápio...' : 'gerar meu cardápio com IA'}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}