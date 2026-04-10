import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'início', icon: HomeIcon },
  { to: '/cardapio', label: 'cardápio', icon: FoodIcon },
  { to: '/treino', label: 'treino', icon: WorkoutIcon },
  { to: '/onboarding', label: 'perfil', icon: ProfileIcon },
]

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-dark-900 relative">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-dark-900 border-t border-dark-600 safe-bottom z-50">
        <div className="flex justify-around items-center px-2 pt-2 pb-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all ${
                  isActive ? 'text-brand' : 'text-dark-400 hover:text-gray-400'
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
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function FoodIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v6a6 6 0 0012 0V4" />
      <line x1="4" y1="4" x2="20" y2="4" />
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
