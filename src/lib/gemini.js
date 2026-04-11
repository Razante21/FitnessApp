const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`

function formatarRestricoes(restricoes) {
  if (!restricoes || restricoes.length === 0) return 'nenhuma'
  return restricoes.map(r => {
    const alimento = typeof r === 'string' ? r : r.alimento
    const obs = typeof r === 'string' ? '' : r.obs
    if (obs) return `- ${alimento}: ${obs}`
    return `- ${alimento}: não usar de nenhuma forma`
  }).join('\n')
}

export async function gerarCardapio(perfil) {
  const restricoesFormatadas = formatarRestricoes(perfil.restricoes)

  const prompt = `Você é um nutricionista especializado em hipertrofia e emagrecimento.
Crie um cardápio diário personalizado com base no perfil abaixo.

PERFIL:
- Nome: ${perfil.nome}
- Peso: ${perfil.peso}kg
- Altura: ${perfil.altura}cm
- Objetivo: ${perfil.objetivo}
- Frequência de treino: ${perfil.treino} por semana

RESTRIÇÕES ALIMENTARES (LEIA COM ATENÇÃO):
${restricoesFormatadas}

REGRAS SOBRE AS RESTRIÇÕES:
- Cada restrição acima indica exatamente o que não pode usar.
- Se não tiver observação, NÃO use o alimento de nenhuma forma.
- Se tiver observação, respeite EXATAMENTE o que foi descrito.
- Exemplo: "atum: não quero de jeito nenhum" → proibido em qualquer forma (fresco, lata, temperado).
- Exemplo: "tomate: só não quero cru, molho tudo bem" → pode usar molho, mas não tomate cru ou fatiado.
- Qualquer violação torna o cardápio inválido. Substitua sempre por alternativas permitidas.

Responda APENAS com JSON válido, sem texto antes ou depois, sem markdown, sem explicações:
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
Seja prático e realista para o brasileiro médio.
Respeite o objetivo e calcule as calorias adequadas para o perfil informado.`

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4 }
    })
  })

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}