# FitApp — Cardápio + Treino com IA

Web app PWA de saúde e treino personalizado. Dark mode, visual de app mobile, IA via Gemini Flash.

## Stack
- React + Vite
- Tailwind CSS
- Supabase (auth + db)
- Gemini Flash (geração de cardápio)
- PWA (installable no celular)

## Setup

```bash
# 1. clone e instale
npm install

# 2. configure o .env
cp .env.example .env
# preencha VITE_GEMINI_API_KEY e VITE_SUPABASE_*

# 3. rode local
npm run dev

# 4. build
npm run build
```

## Gemini API Key
Acesse: https://aistudio.google.com/app/apikey

## Supabase
Acesse: https://supabase.com → crie um projeto → copie URL e anon key

## Deploy Vercel
```bash
vercel --prod
# adicione as env vars no painel da Vercel
```

## Telas
- **Dashboard** — calorias do dia, progresso, próximas refeições
- **Cardápio** — checklist de refeições + receitas geradas pela IA
- **Treino** — séries, reps, temporizador de descanso por exercício
- **Perfil** — onboarding: nome, peso, altura, objetivo, restrições → gera cardápio com IA
