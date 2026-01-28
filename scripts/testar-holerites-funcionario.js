/**
 * Script para testar se os holerites estão aparecendo para funcionários
 * Execute no console do navegador
 */

console.log('🧪 [TESTE-HOLERITES] Testando holerites para funcionário...')

async function testarHoleritesFuncionario() {
  try {
    // Primeiro, vamos verificar se há holerites no banco
    console.log('📊 [TESTE-HOLERITES] 1. Verificando holerites no banco...')
    
    const todosHolerites = await fetch('/api/holerites?limite=10')
    const todosData = await todosHolerites.json()
    
    console.log('📋 [TESTE-HOLERITES] Total de holerites no sistema:', todosData.total || 0)
    if (todosData.holerites && todosData.holerites.length > 0) {
      console.log('📋 [TESTE-HOLERITES] Primeiros holerites:')
      todosData.holerites.slice(0, 3).forEach((h, i) => {
        console.log(`   ${i+1}. ID: ${h.id}, Funcionário: ${h.funcionario_id}, Status: ${h.status}`)
      })
    }
    
    // Agora vamos testar a API específica do funcionário
    console.log('👤 [TESTE-HOLERITES] 2. Testando API meus-holerites...')
    
    // Testar com ID 1 (admin/funcionário comum)
    const funcionarioId = 1
    const meusHolerites = await fetch(`/api/holerites/meus-holerites?funcionarioId=${funcionarioId}`)
    const meusData = await meusHolerites.json()
    
    console.log('📊 [TESTE-HOLERITES] Status da resposta:', meusHolerites.status)
    console.log('📊 [TESTE-HOLERITES] Dados retornados:', meusData)
    
    if (Array.isArray(meusData)) {
      console.log(`✅ [TESTE-HOLERITES] ${meusData.length} holerite(s) encontrado(s) para funcionário ${funcionarioId}`)
      meusData.forEach((h, i) => {
        console.log(`   ${i+1}. ID: ${h.id}, Status: ${h.status}, Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
      })
    } else {
      console.log('❌ [TESTE-HOLERITES] Resposta não é um array:', typeof meusData)
    }
    
    // Testar com outros IDs de funcionários
    console.log('👥 [TESTE-HOLERITES] 3. Testando outros funcionários...')
    
    for (let id = 2; id <= 5; id++) {
      try {
        const response = await fetch(`/api/holerites/meus-holerites?funcionarioId=${id}`)
        const data = await response.json()
        
        if (Array.isArray(data)) {
          console.log(`👤 [TESTE-HOLERITES] Funcionário ${id}: ${data.length} holerite(s)`)
        } else {
          console.log(`👤 [TESTE-HOLERITES] Funcionário ${id}: Erro ou sem dados`)
        }
      } catch (error) {
        console.log(`👤 [TESTE-HOLERITES] Funcionário ${id}: Erro na requisição`)
      }
    }
    
  } catch (error) {
    console.error('💥 [TESTE-HOLERITES] Erro no teste:', error)
  }
}

// Executar teste
testarHoleritesFuncionario()

console.log('🔍 [TESTE-HOLERITES] Para testar novamente, execute: testarHoleritesFuncionario()')