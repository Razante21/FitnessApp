import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'início', icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10 2L2 8v10h5v-6h6v6h5V8L10 2z"/>
    </svg>
  )},
  { path: '/cardapio', label: 'cardápio', icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 010 2H4a1 1 0 01-1-1z"/>
    </svg>
  )},
  { path: '/treino', label: 'treino', icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M13 7H7v6h6V7z"/><path fillRule="evenodd" d="M7 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H7zm4 2H9V3h2v1z" clipRule="evenodd"/>
    </svg>
  )},
  { path: '/perfil', label: 'perfil', icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
    </svg>
  )},
]

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="flex justify-around items-center px-2 pt-3 pb-6 border-t border-white/5 bg-[#0f0f0f]">
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1 px-4 cursor-pointer bg-transparent border-none"
          >
            <span className={active ? 'text-green-400' : 'text-zinc-600'}>{tab.icon}</span>
            <span className={`text-[10px] ${active ? 'text-green-400' : 'text-zinc-600'}`}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
