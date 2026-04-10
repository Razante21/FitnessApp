import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Cadastro() {
    const navigate = useNavigate()
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState(null)

    async function handleCadastro(e) {
        e.preventDefault()
        setErro(null)
        if (senha.length < 6) { setErro('senha precisa ter pelo menos 6 caracteres'); return }
        setLoading(true)

        const { data, error } = await supabase.auth.signUp({
            email,
            password: senha,
            options: { data: { full_name: nome } }
        })

        if (error) {
            setErro(error.message === 'User already registered' ? 'esse email já tem uma conta' : 'erro ao criar conta, tenta de novo')
            setLoading(false)
            return
        }

        // salva o nome no perfil
        if (data.user) {
            await supabase.from('perfis').upsert({ id: data.user.id, nome })
        }

        navigate('/')
        setLoading(false)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: '#1a3a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7ab82e" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4v6a6 6 0 0012 0V4" /><line x1="4" y1="4" x2="20" y2="4" /></svg>
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 500, color: 'white', margin: 0 }}>criar conta</h1>
                    <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>comece a montar seu cardápio com IA</p>
                </div>

                <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input
                        type="text"
                        placeholder="seu nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                        style={{ width: '100%', background: '#151515', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: 'white', outline: 'none' }}
                    />
                    <input
                        type="email"
                        placeholder="seu email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', background: '#151515', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: 'white', outline: 'none' }}
                    />
                    <input
                        type="password"
                        placeholder="senha (mín. 6 caracteres)"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                        style={{ width: '100%', background: '#151515', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: 'white', outline: 'none' }}
                    />

                    {erro && (
                        <p style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '8px 12px', margin: 0 }}>{erro}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '13px', background: '#7ab82e', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#0a1a02', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'criando conta...' : 'criar conta'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 13, color: '#71717a' }}>
                    já tem conta?{' '}
                    <Link to="/login" style={{ color: '#7ab82e', textDecoration: 'none' }}>entrar</Link>
                </p>
            </div>
        </div>
    )
}