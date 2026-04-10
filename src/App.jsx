import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Cardapio from './pages/Cardapio'
import Treino from './pages/Treino'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-full max-w-md mx-auto">
        <div className="flex-1 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/treino" element={<Treino />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </div>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}
