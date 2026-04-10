import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'início', icon: HomeIcon },
  { to: '/cardapio', label: 'cardápio', icon: FoodIcon },
  { to: '/treino', label: 'treino', icon: WorkoutIcon },
  { to: '/perfil', label: 'perfil', icon: ProfileIcon },
]

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex' }}>

      {/* sidebar desktop */}
      <aside style={{
        width: '220px', flexShrink: 0,
        backgroundColor: '#111', borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '4px',
        position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 40
      }} className="desktop-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', marginBottom: '2rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1a3a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ab82e" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4v6a6 6 0 0012 0V4" /><line x1="4" y1="4" x2="20" y2="4" /></svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>FitApp</span>
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 12, fontSize: 14,
              textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? '#1a3a0a' : 'transparent',
              color: isActive ? '#7ab82e' : '#71717a',
            })}
          >
            {({ isActive }) => <><Icon active={isActive} /><span>{label}</span></>}
          </NavLink>
        ))}
      </aside>

      {/* main content */}
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '1.5rem 1rem 6rem' }}>
          <Outlet />
        </main>

        {/* bottom nav mobile */}
        <nav className="mobile-nav" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          padding: '8px 8px 16px', zIndex: 50
        }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 3, textDecoration: 'none',
                color: isActive ? '#7ab82e' : '#52525b'
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span style={{ fontSize: 10 }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar { display: flex !important; }
          .main-content { margin-left: 220px; }
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-sidebar { display: none !important; }
          .main-content { margin-left: 0; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

function HomeIcon({ active }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function FoodIcon({ active }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
}
function WorkoutIcon({ active }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0012 0V4" /><line x1="4" y1="4" x2="20" y2="4" /></svg>
}
function ProfileIcon({ active }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}