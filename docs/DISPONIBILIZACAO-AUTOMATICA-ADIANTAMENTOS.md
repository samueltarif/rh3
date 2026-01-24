# 🤖 Disponibilização Automática de Adiantamentos

## 🎯 Funcionalidade

Sistema que disponibiliza automaticamente os holerites de adiantamento salarial (40%) no perfil dos funcionários **todo dia 17 do mês**.

## ✨ Como Funciona

### 1. Geração de Adiantamentos (Qualquer Dia)

**Admin pode gerar a qualquer momento:**
- Clica em "💰 Gerar Adiantamento (40%)"
- Sistema gera holerites com status `"gerado"`
- Holerites ficam "invisíveis" para funcionários
- Observação inclui: "Será disponibilizado automaticamente no dia 17"

### 2. Disponibilização Automática (Dia 17)

**Todo dia 17 do mês às 00:00:**
- Sistema executa verificação automática
- Busca adiantamentos com status `"gerado"`
- Muda status para `"enviado"`
- Holerites aparecem no perfil dos funcionários
- Funcionários podem visualizar e baixar

## 🔧 Implementação Técnica

### APIs Criadas

#### 1. `/api/holerites/disponibilizar-adiantamentos` (POST)
**Função:** Disponibiliza adiantamentos do mês atual

**Parâmetros:**
```typescript
{
  forcar?: boolean // Força execução mesmo não sendo dia 17
}
```

**Lógica:**
1. Verifica se é dia 17 (ou se `forcar = true`)
2. Busca adiantamentos com status `"gerado"`
3. Filtra por período (dia 15 ao último dia do mês)
4. Filtra por observação (contém "Adiantamento salarial")
5. Atualiza status para `"enviado"`
6. Retorna relatório da operação

#### 2. `/api/cron/verificar-disponibilizacao-adiantamentos` (GET)
**Função:** Verificação diária para execução automática

**Lógica:**
1. Verifica se é dia 17
2. Se sim, chama a API de disponibilização
3. Se não, retorna sem fazer nada
4. Pode ser chamada por cron jobs externos

### Hook Criado

**Nome:** `disponibilizar-adiantamentos-dia17`
- **Tipo:** Manual (userTriggered)
- **Ação:** Chama a API de disponibilização
- **Uso:** Testes e execução manual

## 📅 Cronograma de Execução

### Fluxo Mensal Típico

```
Dia 10: Admin gera adiantamentos
        ↓
        Holerites criados (status: "gerado")
        ↓
        Funcionários NÃO veem no perfil
        ↓
Dia 17: Sistema executa disponibilização automática
        ↓
        Status muda para "enviado"
        ↓
        Funcionários VEEM no perfil
        ↓
Dia 20: Data de pagamento (conforme configurado)
```

## 🎮 Como Usar

### Para Admins

#### Geração (Qualquer Dia)
1. Acesse **Admin → Holerites**
2. Clique em **"💰 Gerar Adiantamento (40%)"**
3. Confirme a geração
4. Holerites são criados com status "gerado"
5. Aguarde até dia 17 para disponibilização automática

#### Verificação Manual
1. Acesse **Admin → Holerites**
2. Use o hook **"Disponibilizar Adiantamentos Dia 17"**
3. Ou chame a API diretamente

#### Forçar Disponibilização (Qualquer Dia)
```bash
curl -X POST /api/holerites/disponibilizar-adiantamentos \
  -H "Content-Type: application/json" \
  -d '{"forcar": true}'
```

### Para Funcionários

#### Visualização (A partir do Dia 17)
1. Acesse **Meus Holerites**
2. Veja adiantamentos disponíveis
3. Baixe PDF/HTML conforme necessário

## 📊 Monitoramento

### Logs do Sistema

**Durante a execução, você verá:**
```
🗓️ [DISPONIBILIZAR-ADIANTAMENTOS] Executando em 2026-01-17
📅 Dia atual: 17 | Mês: 1 | Ano: 2026
🔍 Buscando adiantamentos do mês 2026-01 com status 'gerado'...
📦 3 adiantamento(s) encontrado(s) para disponibilizar
🔄 Disponibilizando adiantamento para: João Silva
✅ Adiantamento disponibilizado: João Silva - R$ 2.000,00
🎉 Disponibilização automática concluída: 3 adiantamento(s) disponibilizado(s)
```

### Resposta da API

```json
{
  "success": true,
  "message": "Disponibilização automática concluída: 3 adiantamento(s) disponibilizado(s)",
  "executado": true,
  "data_execucao": "2026-01-17T00:00:00.000Z",
  "dia_execucao": 17,
  "mes_referencia": "2026-01",
  "adiantamentos_encontrados": 3,
  "adiantamentos_disponibilizados": 3,
  "erros": 0,
  "resultados": [
    {
      "funcionario": "João Silva",
      "holerite_id": "123",
      "status": "disponibilizado",
      "valor": 2000.00
    }
  ]
}
```

## 🔐 Segurança

### Validações Implementadas

1. **Data:** Só executa no dia 17 (ou com `forcar = true`)
2. **Tipo:** Só processa adiantamentos (filtro por observação)
3. **Status:** Só processa holerites com status "gerado"
4. **Período:** Só processa holerites do mês atual
5. **Funcionários:** Só funcionários ativos são considerados

### Proteções

- ✅ Não processa folhas mensais
- ✅ Não processa holerites já disponibilizados
- ✅ Não executa fora do dia 17 (sem forçar)
- ✅ Log completo de todas as operações
- ✅ Tratamento de erros individual por holerite

## 🚀 Configuração de Cron Automático

### Vercel Cron Jobs

Crie `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/verificar-disponibilizacao-adiantamentos",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### GitHub Actions

Crie `.github/workflows/disponibilizar-adiantamentos.yml`:
```yaml
name: Disponibilizar Adiantamentos
on:
  schedule:
    - cron: '0 0 * * *'  # Todo dia às 00:00
jobs:
  disponibilizar:
    runs-on: ubuntu-latest
    steps:
      - name: Chamar API
        run: |
          curl -X GET https://seu-dominio.com/api/cron/verificar-disponibilizacao-adiantamentos
```

## 🧪 Testes

### Teste Manual

1. **Gerar adiantamento:**
```bash
# Gere um adiantamento via interface admin
```

2. **Verificar status inicial:**
```sql
SELECT id, funcionario_id, status, observacoes 
FROM holerites 
WHERE observacoes LIKE '%Adiantamento salarial%'
AND status = 'gerado';
```

3. **Forçar disponibilização:**
```bash
curl -X POST /api/holerites/disponibilizar-adiantamentos \
  -H "Content-Type: application/json" \
  -d '{"forcar": true}'
```

4. **Verificar status final:**
```sql
SELECT id, funcionario_id, status, observacoes 
FROM holerites 
WHERE observacoes LIKE '%Adiantamento salarial%'
AND status = 'enviado';
```

### Teste de Data

```bash
# Simular execução em dia diferente de 17
curl -X GET /api/cron/verificar-disponibilizacao-adiantamentos
# Deve retornar: "Não é dia 17"

# Simular execução no dia 17
# (altere data do sistema ou aguarde dia 17)
curl -X GET /api/cron/verificar-disponibilizacao-adiantamentos
# Deve executar disponibilização
```

## ❓ Troubleshooting

### Problema: Adiantamentos não foram disponibilizados no dia 17

**Verificações:**
1. Cron job está configurado?
2. API está respondendo?
3. Existem adiantamentos com status "gerado"?
4. Adiantamentos são do mês atual?

**Solução:**
```bash
# Verificar API
curl -X GET /api/cron/verificar-disponibilizacao-adiantamentos

# Forçar execução
curl -X POST /api/holerites/disponibilizar-adiantamentos \
  -d '{"forcar": true}'
```

### Problema: Folhas mensais foram disponibilizadas por engano

**Causa:** Filtro de observação não funcionou

**Verificação:**
```sql
SELECT observacoes FROM holerites WHERE status = 'enviado';
```

**Prevenção:** Filtro duplo por observação e período

## 📈 Benefícios

### Para Admins
- ✅ Menos trabalho manual
- ✅ Processo padronizado
- ✅ Funcionários sempre recebem no dia 17
- ✅ Pode gerar adiantamentos a qualquer momento

### Para Funcionários
- ✅ Previsibilidade (sempre dia 17)
- ✅ Acesso automático
- ✅ Não precisa aguardar admin
- ✅ Transparência no processo

### Para a Empresa
- ✅ Processo automatizado
- ✅ Redução de erros
- ✅ Maior satisfação dos funcionários
- ✅ Compliance com prazos

---

**Implementado em:** Janeiro 2026  
**Versão:** 1.0  
**Status:** ✅ Ativo