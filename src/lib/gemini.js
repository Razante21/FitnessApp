const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

export async function gerarCardapio(perfil) {
  const prompt = `
Você é um nutricionista especializado em hipertrofia e emagrecimento.
Com base no perfil abaixo, crie um cardápio diário completo e personalizado.

Perfil:
- Nome: ${perfil.nome}
- Peso: ${perfil.peso}kg
- Altura: ${perfil.altura}cm
- Objetivo: ${perfil.objetivo}
- Restrições alimentares: ${perfil.restricoes?.join(', ') || 'nenhuma'}
- Frequência de treino: ${perfil.treino}x por semana

Responda APENAS com um JSON válido neste formato exato:
{
  "calorias_meta": 2800,
  "proteina_meta": 130,
  "refeicoes": [
    {
      "id": "cafe",
      "nome": "Café da manhã",
      "horario": "7h",
      "kcal": 600,
      "itens": [
        { "nome": "3 ovos mexidos", "nota": "temperados com sal e orégano" }
      ],
      "receita": {
        "nome": "Nome da receita",
        "desc": "Descrição curta",
        "passos": ["passo 1", "passo 2", "passo 3"]
      }
    }
  ]
}

Inclua exatamente 5 refeições: café da manhã, lanche da manhã, almoço, lanche da tarde, jantar.
Adapte os alimentos às restrições informadas. Seja prático e realista para o brasileiro médio.
`

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    })
  })

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
