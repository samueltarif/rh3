/**
 * API de verificação diária para criar notificações de aniversariantes
 * Esta API pode ser chamada por um serviço de cron externo (como Vercel Cron Jobs)
 * ou executada manualmente para verificar aniversariantes do dia
 */
export default defineEventHandler(async (event) => {
  try {
    const hoje = new Date()
    const diaAtual = hoje.getDate()
    const mesAtual = hoje.getMonth() + 1
    
    console.log(`🎂 [CRON-ANIVERSARIANTES] Verificação diária executada em ${hoje.toISOString()}`)
    console.log(`📅 Verificando aniversariantes para ${diaAtual}/${mesAtual}`)

    // Chamar a API de verificação de aniversariantes
    const resultado = await $fetch('/api/notificacoes/verificar-aniversariantes', {
      method: 'POST'
    })

    console.log(`✅ Verificação de aniversariantes executada`)
    console.log(`📊 Resultado:`, resultado)

    return {
      success: true,
      message: 'Verificação diária de aniversariantes executada com sucesso',
      data_verificacao: hoje.toISOString(),
      dia_atual: diaAtual,
      mes_atual: mesAtual,
      resultado_verificacao: resultado
    }

  } catch (error: any) {
    console.error('💥 Erro na verificação diária de aniversariantes:', error)
    
    return {
      success: false,
      message: error.message || 'Erro na verificação diária de aniversariantes',
      data_verificacao: new Date().toISOString(),
      erro: error.message
    }
  }
})