# Checklist: Variáveis de Ambiente no Vercel

## ✅ Variáveis Obrigatórias no Vercel

### 1. Supabase - URLs
- [ ] `NUXT_PUBLIC_SUPABASE_URL` = `https://rqryspxfvfzfghrfqtbm.supabase.co`
- [ ] `SUPABASE_URL` = `https://rqryspxfvfzfghrfqtbm.supabase.co`

### 2. Supabase - Chaves de API
- [ ] `NUXT_PUBLIC_SUPABASE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Anon Key)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Service Role Key)
- [ ] `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Anon Key)

### 3. Email
- [ ] `GMAIL_EMAIL` = `qualitecinstrumentosdemedicao@gmail.com`
- [ ] `GMAIL_APP_PASSWORD` = `byeqpdyllakkwxkk`

### 4. Segurança
- [ ] `NUXT_SECRET_KEY` = `qualitec-rh-system-2025-super-secret-key-production-ready`
- [ ] `CRON_SECRET` = `qualitec-cron-contador-diario-2026-secure-token-xyz789`

### 5. Ambiente
- [ ] `ENVIRONMENT` = `Production`
- [ ] `NODE_ENV` = `production` (automático no Vercel)

## 🚨 Variável CRÍTICA para Holerites

A variável mais importante para o funcionamento dos holerites é:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4
```

**SEM ESTA VARIÁVEL, OS HOLERITES NÃO APARECEM EM PRODUÇÃO!**

## 📝 Como Configurar no Vercel

1. Acesse o painel do Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione cada variável acima
4. Marque para todos os ambientes: **Production**, **Preview**, **Development**
5. Clique em **Save**
6. Faça um novo deploy

## 🧪 Como Testar

Após configurar as variáveis:

1. Faça um novo deploy no Vercel
2. Acesse o link de produção
3. Faça login como funcionário
4. Vá para "Meus Holerites"
5. Abra o console (F12) e verifique os logs

## ⚠️ Problemas Comuns

- **Variável não configurada**: Holerites não aparecem
- **Chave errada**: Erro 401/403 do Supabase
- **Cache do Vercel**: Limpar cache e fazer novo deploy
- **Timeout**: Aumentar timeout das funções no Vercel