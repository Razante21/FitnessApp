import { useState, useEffect } from 'react'

const STORAGE_KEY = 'fitness_cardapio'
const DONE_KEY = 'fitness_done'

export function useCardapio() {
  const [cardapio, setCardapio] = useState(null)
  const [done, setDone] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setCardapio(JSON.parse(saved))
    const savedDone = localStorage.getItem(DONE_KEY)
    if (savedDone) setDone(JSON.parse(savedDone))
  }, [])

  function salvarCardapio(data) {
    setCardapio(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setDone({})
    localStorage.setItem(DONE_KEY, JSON.stringify({}))
  }

  function toggleDone(id) {
    const next = { ...done, [id]: !done[id] }
    setDone(next)
    localStorage.setItem(DONE_KEY, JSON.stringify(next))
  }

  function resetDone() {
    setDone({})
    localStorage.setItem(DONE_KEY, JSON.stringify({}))
  }

  const totalFeitas = cardapio ? cardapio.refeicoes.filter(r => done[r.id]).length : 0
  const totalRefeicoes = cardapio?.refeicoes?.length || 0
  const kcalConsumidas = cardapio
    ? cardapio.refeicoes.filter(r => done[r.id]).reduce((s, r) => s + r.kcal, 0)
    : 0

  return { cardapio, done, salvarCardapio, toggleDone, resetDone, totalFeitas, totalRefeicoes, kcalConsumidas }
}
