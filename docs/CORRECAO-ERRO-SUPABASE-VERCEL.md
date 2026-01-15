# 🚨 CORREÇÃO: Erro 500 - Supabase Client no Vercel

## ❌ Erro Encontrado:
```
500 Server Error
Your project's URL and Key are required to create a Supabase client!
Check your Supabase project's API settings to find these values
```

## 🔍 Causa:
As variáveis de ambiente do Supabase não estão configuradas no Vercel.

## ✅ SOLUÇÃO PASSO A PASSO:

### 1. **Obter as Chaves do Supabase**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings → API**
4. Copie os valores:

```
Project URL: https://seu-projeto.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. **Configurar no Vercel**

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto RH
3. Vá em: **Settings → Environment Variables**
4. Adicione estas 3 variáveis:

#### **Variável 1:**
- **Name:** `SUPABASE_URL`
- **Value:** `https://seu-projeto.supabase.co`
- **Environment:** ✅ Production ✅ Preview ✅ Development

#### **Variável 2:**
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (sua chave anon)
- **Environment:** ✅ Production ✅ Preview ✅ Development

#### **Variável 3:**
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (sua chave service_role)
- **Environment:** ✅ Production ✅ Preview ✅ Development

### 3. **Redesploy**

Após adicionar as variáveis:
1. Vá em: **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde 2-3 minutos

## 🔧 Verificação das Variáveis

### No Vercel Dashboard:
1. **Settings → Environment Variables**
2. Deve mostrar:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`

### Teste da API:
Acesse: `https://seu-app.vercel.app/api/test-supabase`

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Conexão com Supabase OK"
}
```

## 🚨 Problemas Comuns:

### 1. **Chaves Incorretas**
- ✅ Verifique se copiou as chaves completas
- ✅ Não deve ter espaços no início/fim
- ✅ Deve começar com `eyJhbGciOiJIUzI1NiI...`

### 2. **URL Incorreta**
- ✅ Deve ser: `https://projeto.supabase.co`
- ✅ Não deve ter `/` no final
- ✅ Deve incluir `https://`

### 3. **Environment não selecionado**
- ✅ Marque: Production, Preview, Development
- ✅ Clique em "Save" após cada variável

## 📊 Logs de Debug

Se ainda não funcionar:
1. **Vercel Dashboard → Functions → View Function Logs**
2. Procure por erros relacionados ao Supabase
3. Verifique se as variáveis estão sendo carregadas

## ✅ Resultado Final

Após a correção:
- ✅ Sistema carrega sem erro 500
- ✅ Login funciona
- ✅ Dashboard carrega
- ✅ APIs respondem corretamente

**🎯 Sistema funcionando no Vercel!**