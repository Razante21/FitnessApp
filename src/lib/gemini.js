const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${GEMINI_API_KEY}`

export async function gerarCardapio(perfil) {
  const restricoesStr = perfil.restricoes?.length > 0
    ? perfil.restricoes.join(', ')
    : 'nenhuma'

  const prompt = `Você é um nutricionista especializado em hipertrofia e emagrecimento.
Crie um cardápio diário personalizado com base no perfil abaixo.

PERFIL:
- Nome: ${perfil.nome}
- Peso: ${perfil.peso}kg
- Altura: ${perfil.altura}cm
- Objetivo: ${perfil.objetivo}
- Frequência de treino: ${perfil.treino} por semana

RESTRIÇÕES ALIMENTARES (REGRA ABSOLUTA):
${restricoesStr}

ATENÇÃO CRÍTICA SOBRE AS RESTRIÇÕES:
- As restrições acima são PROIBIÇÕES ABSOLUTAS. Não inclua esses alimentos em NENHUMA refeição, de NENHUMA forma.
- Isso inclui versões derivadas, processadas, enlatadas, caseiras ou qualquer variação do alimento restrito.
- Exemplo: se "tomate" está na lista, NÃO use tomate fresco, tomate cereja, tomate seco, molho de tomate, extrato de tomate ou qualquer produto que contenha tomate.
- Exemplo: se "atum" está na lista, NÃO use atum fresco, atum em lata, atum temperado ou qualquer forma de atum.
- Se violar qualquer restrição, o cardápio é INVÁLIDO.
- Substitua sempre por alternativas que a pessoa pode comer.

Responda APENAS com JSON válido, sem texto antes ou depois, sem markdown:
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