import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'início', icon: HomeIcon },
  { to: '/cardapio', label: 'cardápio', icon: FoodIcon },
  { to: '/treino', label: 'treino', icon: WorkoutIcon },
  { to: '/perfil', label: 'perfil', icon: ProfileIcon },
]

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      {/* sidebar — só aparece em telas grandes */}
      <aside className="hidden lg:flex flex-col w-56 fixed top-0 left-0 h-full bg-[#111] border-r border-white/5 px-4 py-8 gap-2 z-40">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-7 h-7 rounded-lg bg-green-950 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ab82e" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 4v6a6 6 0 0012 0V4" /><line x1="4" y1="4" x2="20" y2="4" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white">FitApp</span>
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                ? 'bg-green-950 text-green-400'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </aside>

      {/* conteúdo principal */}
      <div className="flex-1 flex flex-col lg:ml-56">

        {/* área de conteúdo */}
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-6 pb-24 lg:pb-10">
          {children}
        </main>

        {/* bottom nav — só no mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/5 z-50">
          <div className="flex justify-around items-center px-2 pt-2 pb-4">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-4 py-1 transition-all ${isActive ? 'text-green-400' : 'text-zinc-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon active={isActive} />
                    <span className="text-[10px]">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

      </div>
    </div>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function FoodIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  )
}

function WorkoutIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v6a6 6 0 0012 0V4" />
      <line x1="4" y1="4" x2="20" y2="4" />
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}