# 🚨 SOLUÇÃO RÁPIDA - Erro 500 Supabase

## ❌ Erro:
```
500 Server Error
Your project's URL and Key are required to create a Supabase client!
```

## ⚡ SOLUÇÃO EM 3 PASSOS:

### 1. **Obter Chaves do Supabase** (2 minutos)
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings → API**
4. Copie:
   - **Project URL:** `https://projeto.supabase.co`
   - **anon public:** `eyJhbGciOiJIUzI1NiI...`
   - **service_role:** `eyJhbGciOiJIUzI1NiI...`

### 2. **Configurar no Vercel** (2 minutos)
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto RH
3. Vá em: **Settings → Environment Variables**
4. Adicione:

```
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_ANON_KEY = sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY = sua_chave_service_role_aqui
```

**⚠️ IMPORTANTE:** Marque todas as opções:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 3. **Redesploy** (1 minuto)
1. Vá em: **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde 2-3 minutos

## ✅ Teste:
Acesse: `https://seu-app.vercel.app/api/test-supabase`

**Deve mostrar:** Vários testes com status ✅

## 🆘 Se ainda não funcionar:
1. **Verifique as chaves:** Devem começar com `eyJhbGciOiJIUzI1NiI`
2. **Verifique a URL:** Deve ser `https://projeto.supabase.co` (sem `/` no final)
3. **Verifique os environments:** Todas as 3 opções marcadas
4. **Aguarde:** Pode levar até 5 minutos para propagar

**🎯 Sistema funcionando em 5 minutos!**