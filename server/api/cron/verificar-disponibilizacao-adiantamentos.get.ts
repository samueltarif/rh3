/**
 * API de verificação diária para disponibilização automática de adiantamentos
 * Esta API pode ser chamada por um serviço de cron externo (como Vercel Cron Jobs)
 * ou executada manualmente para verificar se é dia 17 e disponibilizar adiantamentos
 */
export default defineEventHandler(async (event) => {
  try {
    const hoje = new Date()
    const diaAtual = hoje.getDate()
    
    console.log(`🕐 [CRON-ADIANTAMENTOS] Verificação diária executada em ${hoje.toISOString()}`)
    console.log(`📅 Dia atual: ${diaAtual}`)

    // Se não é dia 17, não faz nada
    if (diaAtual !== 17) {
      console.log(`⏰ Não é dia 17 (hoje é dia ${diaAtual}). Nenhuma ação necessária.`)
      return {
        success: true,
        message: `Verificação executada. Não é dia 17 (hoje é dia ${diaAtual}).`,
        dia_atual: diaAtual,
        acao_executada: false
      }
    }

    console.log(`🎯 É dia 17! Executando disponibilização automática de adiantamentos...`)

    // Chamar a API de disponibilização
    const resultado = await $fetch('/api/holerites/disponibilizar-adiantamentos', {
      method: 'POST',
      body: { forcar: true }
    })

    console.log(`✅ Disponibilização automática executada com sucesso`)
    console.log(`📊 Resultado:`, resultado)

    return {
      success: true,
      message: 'Verificação e disponibilização automática executada com sucesso',
      dia_atual: diaAtual,
      acao_executada: true,
      resultado_disponibilizacao: resultado
    }

  } catch (error: any) {
    console.error('💥 Erro na verificação diária de adiantamentos:', error)
    
    return {
      success: false,
      message: error.message || 'Erro na verificação diária de adiantamentos',
      dia_atual: new Date().getDate(),
      acao_executada: false,
      erro: error.message
    }
  }
})