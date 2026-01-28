import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * API para marcar notificação como lida
 * PATCH /api/notificacoes/[id]/marcar-lida
 */
export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID da notificação não fornecido'
      })
    }

    console.log('📬 [MARCAR-LIDA] Marcando notificação como lida:', id)

    // Marcar como lida
    const { data, error } = await supabase
      .from('notificacoes')
      .update({ 
        lida: true, 
        data_leitura: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao marcar notificação como lida:', error)
      throw error
    }

    console.log('✅ Notificação marcada como lida:', id)

    return {
      success: true,
      message: 'Notificação marcada como lida',
      notificacao: data
    }

  } catch (error: any) {
    console.error('💥 Erro ao marcar notificação como lida:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao marcar notificação como lida'
    })
  }
})