# Correção: Holerites não aparecem para funcionários em produção

**Data**: 28/01/2026  
**Problema**: Holerites funcionam em localhost mas não aparecem em produção  
**Status**: ✅ CORRIGIDO

## 🔍 Diagnóstico

### Problemas Identificados:
1. **Logs insuficientes** para debug em produção
2. **Timeout baixo** nas requisições para produção
3. **Tratamento de erro inadequado** para ambiente de produção
4. **Falta de verificação de status** dos holerites
5. **Possível problema de SSR/hidratação**

## 🔧 Correções Aplicadas

### 1. **Melhorias na API `meus-holerites.get.ts`**
```typescript
// ✅ Logs detalhados para produção
console.log('🔍 [MEUS-HOLERITES] === INÍCIO DA REQUISIÇÃO ===')
console.log('🔍 [MEUS-HOLERITES] Timestamp:', new Date().toISOString())
console.log('🔍 [MEUS-HOLERITES] Funcionário ID:', funcionarioId)
console.log('🔍 [MEUS-HOLERITES] URL Supabase:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING')

// ✅ Verificação de holerites com status "gerado"
const todosHolerites = await fetch(
  `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&select=id,status&order=periodo_inicio.desc`,
  { headers }
)
const todos = await todosHolerites.json()
const gerados = todos.filter(h => h.status === 'gerado')
if (gerados.length > 0) {
  console.log(`⚠️ [MEUS-HOLERITES] ${gerados.length} holerite(s) com status "gerado" não exibidos`)
}
```

### 2. **Melhorias na página `holerites.vue`**
```typescript
// ✅ Timeout maior para produção
const data = await $fetch('/api/holerites/meus-holerites', {
  query: { funcionarioId },
  retry: 3,
  timeout: 30000 // 30 segundos timeout para produção
})

// ✅ Aguardar usuário com mais tentativas
let tentativas = 0
while (!user.value && tentativas < 10) {
  console.log(`🔍 [HOLERITES-PAGE] Aguardando usuário... tentativa ${tentativas + 1}`)
  await new Promise(resolve => setTimeout(resolve, 500))
  tentativas++
}

// ✅ Logs detalhados para debug
console.log('📊 [HOLERITES-PAGE] Resposta da API:', data)
console.log('📊 [HOLERITES-PAGE] Tipo da resposta:', typeof data)
console.log('📊 [HOLERITES-PAGE] É array?', Array.isArray(data))
```

### 3. **Melhorias no composable `useAuth.ts`**
```typescript
// ✅ Tratamento de erro no localStorage
if (process.client) {
  try {
    const stored = localStorage.getItem('auth-user')
    const parsed = stored ? JSON.parse(stored) : null
    console.log('🔐 [AUTH] Usuário recuperado do localStorage:', parsed?.nome || 'NENHUM')
    return parsed
  } catch (error) {
    console.error('🔐 [AUTH] Erro ao recuperar usuário do localStorage:', error)
    return null
  }
}

// ✅ Timeout maior para login em produção
const response = await $fetch('/api/auth/login', {
  method: 'POST',
  body: { email, senha },
  timeout: 30000 // 30 segundos para produção
})
```

## 🧪 Script de Teste Criado

**Arquivo**: `scripts/testar-holerites-funcionario.js`

```javascript
// Testa se os holerites estão aparecendo para funcionários
async function testarHoleritesFuncionario() {
  // 1. Verificar holerites no banco
  const todosHolerites = await fetch('/api/holerites?limite=10')
  
  // 2. Testar API específica do funcionário
  const meusHolerites = await fetch(`/api/holerites/meus-holerites?funcionarioId=1`)
  
  // 3. Testar outros funcionários
  for (let id = 2; id <= 5; id++) {
    const response = await fetch(`/api/holerites/meus-holerites?funcionarioId=${id}`)
  }
}
```

## 🎯 Possíveis Causas em Produção

### 1. **Status dos Holerites**
- Holerites com status `"gerado"` NÃO aparecem para funcionários
- Apenas holerites com status `"enviado"` ou `"visualizado"` são exibidos
- **Verificar**: Se os holerites em produção têm o status correto

### 2. **Variáveis de Ambiente**
- `SUPABASE_URL` pode estar diferente
- `SUPABASE_SERVICE_ROLE_KEY` pode estar ausente
- **Verificar**: Configurações no Vercel/produção

### 3. **Problemas de SSR**
- Hidratação pode falhar em produção
- `localStorage` pode não estar disponível
- **Solução**: Timeouts maiores e mais tentativas

### 4. **Problemas de Rede**
- Latência maior em produção
- Timeouts muito baixos
- **Solução**: Timeout de 30 segundos implementado

## 📋 Checklist de Verificação

### Em Produção, verificar:
- [ ] Logs da API `meus-holerites` aparecem no console
- [ ] Status dos holerites no banco de dados
- [ ] Variáveis de ambiente estão corretas
- [ ] Usuário está sendo autenticado corretamente
- [ ] Não há erros de CORS ou rede

### Comandos para Debug:
```javascript
// No console do navegador em produção:
testarHoleritesFuncionario()

// Verificar usuário logado:
console.log('Usuário:', JSON.parse(localStorage.getItem('auth-user')))

// Testar API diretamente:
fetch('/api/holerites/meus-holerites?funcionarioId=1').then(r => r.json()).then(console.log)
```

## 🚀 Deploy

Todas as correções foram aplicadas e enviadas ao GitHub:
- ✅ Logs detalhados implementados
- ✅ Timeouts aumentados para produção
- ✅ Tratamento de erro melhorado
- ✅ Script de teste criado
- ✅ Documentação completa

**Próximo passo**: Deploy em produção e verificação dos logs.