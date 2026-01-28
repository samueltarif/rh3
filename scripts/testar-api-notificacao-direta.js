/**
 * Script para testar criação de notificação via API direta
 * Execute no console do navegador ou via curl
 */

console.log('🧪 [TESTE-API] Testando criação de notificação via API...')

async function testarCriacaoViaAPI() {
  try {
    console.log('📡 [TESTE-API] Fazendo POST para /api/notificacoes/criar...')
    
    const response = await fetch('/api/notificacoes/criar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: '🧪 Teste via API',
        mensagem: `Teste de notificação criada em ${new Date().toLocaleString('pt-BR')}`,
        tipo: 'info',
        origem: 'teste_api',
        importante: true,
        dados: {
          teste: true,
          timestamp: new Date().toISOString()
        }
      })
    })
    
    const result = await response.json()
    console.log('📊 [TESTE-API] Resposta:', result)
    
    if (result.success) {
      console.log('✅ [TESTE-API] Notificação criada com sucesso!')
      console.log('📋 ID da notificação:', result.notificacao?.id)
      
      // Verificar se aparece na lista
      setTimeout(async () => {
        console.log('🔍 [TESTE-API] Verificando se aparece na lista...')
        
        const listResponse = await fetch('/api/notificacoes?limite=5')
        const listData = await listResponse.json()
        
        if (listData.success && listData.notificacoes.length > 0) {
          console.log('📬 [TESTE-API] Últimas notificações:')
          listData.notificacoes.slice(0, 3).forEach((notif, index) => {
            console.log(`   ${index + 1}. ${notif.titulo} - ${notif.created_at}`)
          })
          
          const notifTeste = listData.notificacoes.find(n => n.origem === 'teste_api')
          if (notifTeste) {
            console.log('✅ [TESTE-API] Notificação de teste encontrada na lista!')
          } else {
            console.log('❌ [TESTE-API] Notificação de teste NÃO encontrada na lista')
          }
        }
      }, 1000)
      
    } else {
      console.error('❌ [TESTE-API] Erro na criação:', result)
    }
    
  } catch (error) {
    console.error('💥 [TESTE-API] Erro no teste:', error)
  }
}

// Executar teste
testarCriacaoViaAPI()

console.log('🔍 [TESTE-API] Para testar novamente, execute: testarCriacaoViaAPI()')