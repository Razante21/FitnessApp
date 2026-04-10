import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const defaultMeals = [
  { id: 0, name: 'Café da manhã', time: '7h', kcal: 600, done: false, icon: '🌅',
    foods: [
      { name: '3 ovos', note: 'Mexidos, estrelados ou omelete' },
      { name: '2–3 fatias de pão de forma', note: 'Com manteiga ou requeijão' },
      { name: 'Suco de laranja ou uva integral', note: 'Garrafa de vidro — mais calórico' },
    ]
  },
  { id: 1, name: 'Lanche da manhã', time: '10h', kcal: 200, done: false, icon: '🍎',
    foods: [
      { name: '1 fruta', note: 'Banana ou maçã' },
      { name: '1 barrinha de cereais', note: 'Castanhas ou frutas — evita as de chocolate' },
    ]
  },
  { id: 2, name: 'Almoço', time: '12h', kcal: 850, done: false, icon: '🍲',
    foods: [
      { name: 'Arroz', note: '4–5 colheres de sopa cheias' },
      { name: '2 batatas médias', note: 'Cozidas ou purê com manteiga' },
      { name: 'Frango ou carne 150g', note: 'Pedaço generoso — proteína principal' },
      { name: 'Brócolis + pepino', note: 'Brócolis no vapor ou refogado com alho' },
    ]
  },
  { id: 3, name: 'Lanche da tarde', time: '16h', kcal: 400, done: false, icon: '🥪',
    foods: [
      { name: 'Sanduíche caprichado', note: '2 fatias de pão com frango desfiado ou carne moída' },
      { name: 'Na rua: iogurte proteico + fruta', note: 'Tipo Danone com 15g de proteína' },
    ]
  },
  { id: 4, name: 'Jantar', time: '19h', kcal: 750, done: false, icon: '🌙',
    foods: [
      { name: 'Arroz + muita batata', note: 'Se o peso não subir em 1 semana, dobra a batata' },
      { name: 'Proteína', note: 'Frango, carne ou ovo' },
      { name: 'Suco de fruta', note: 'Ajuda a empurrar a comida quando estiver sem fome' },
    ]
  },
]

const defaultWorkouts = [
  {
    id: 0, name: 'Peito + Tríceps', duration: '45 min',
    exercises: [
      { name: 'Supino reto', sets: 4, reps: 10, rest: 90 },
      { name: 'Crucifixo inclinado', sets: 3, reps: 12, rest: 60 },
      { name: 'Tríceps corda', sets: 4, reps: 15, rest: 60 },
      { name: 'Mergulho', sets: 3, reps: 10, rest: 90 },
    ]
  },
  {
    id: 1, name: 'Costas + Bíceps', duration: '45 min',
    exercises: [
      { name: 'Puxada frente', sets: 4, reps: 10, rest: 90 },
      { name: 'Remada curvada', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca direta', sets: 3, reps: 12, rest: 60 },
      { name: 'Rosca martelo', sets: 3, reps: 12, rest: 60 },
    ]
  },
  {
    id: 2, name: 'Pernas', duration: '50 min',
    exercises: [
      { name: 'Agachamento', sets: 4, reps: 10, rest: 120 },
      { name: 'Leg press', sets: 3, reps: 12, rest: 90 },
      { name: 'Cadeira extensora', sets: 3, reps: 15, rest: 60 },
      { name: 'Panturrilha em pé', sets: 4, reps: 20, rest: 45 },
    ]
  },
  {
    id: 3, name: 'Ombro + Abdômen', duration: '40 min',
    exercises: [
      { name: 'Desenvolvimento halter', sets: 4, reps: 10, rest: 90 },
      { name: 'Elevação lateral', sets: 3, reps: 15, rest: 60 },
      { name: 'Prancha', sets: 3, reps: 45, rest: 60 },
      { name: 'Abdominal supra', sets: 3, reps: 20, rest: 45 },
    ]
  },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fitapp_user')) } catch { return null }
  })

  const [meals, setMeals] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fitapp_meals'))
      const savedDate = localStorage.getItem('fitapp_date')
      const today = new Date().toDateString()
      if (saved && savedDate === today) return saved
      return defaultMeals
    } catch { return defaultMeals }
  })

  const [workoutSets, setWorkoutSets] = useState({})
  const [todayWorkoutIdx, setTodayWorkoutIdx] = useState(0)

  useEffect(() => {
    if (user) localStorage.setItem('fitapp_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('fitapp_meals', JSON.stringify(meals))
    localStorage.setItem('fitapp_date', new Date().toDateString())
  }, [meals])

  const toggleMeal = (id) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m))
  }

  const resetDay = () => setMeals(defaultMeals.map(m => ({ ...m, done: false })))

  const toggleSet = (exerciseIdx, setIdx) => {
    const key = `${todayWorkoutIdx}-${exerciseIdx}-${setIdx}`
    setWorkoutSets(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isSetDone = (exerciseIdx, setIdx) => {
    return !!workoutSets[`${todayWorkoutIdx}-${exerciseIdx}-${setIdx}`]
  }

  const totalKcal = meals.reduce((a, m) => a + m.kcal, 0)
  const doneKcal = meals.filter(m => m.done).reduce((a, m) => a + m.kcal, 0)
  const doneMeals = meals.filter(m => m.done).length

  return (
    <AppContext.Provider value={{
      user, setUser,
      meals, toggleMeal, resetDay,
      workouts: defaultWorkouts,
      todayWorkoutIdx, setTodayWorkoutIdx,
      toggleSet, isSetDone,
      totalKcal, doneKcal, doneMeals,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
