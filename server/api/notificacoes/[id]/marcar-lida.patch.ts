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

    console.log(`📬 [MARCAR-LIDA] Marcando notificação ${id} como lida...`)

    // Marcar como lida usando a função do banco
    const { data, error } = await supabase
      .rpc('marcar_notificacao_lida', { notificacao_uuid: id })

    if (error) {
      console.error('❌ Erro ao marcar notificação como lida:', error)
      throw error
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        message: 'Notificação não encontrada'
      })
    }

    console.log(`✅ Notificação ${id} marcada como lida`)

    return {
      success: true,
      message: 'Notificação marcada como lida',
      id: id
    }

  } catch (error: any) {
    console.error('💥 Erro ao marcar notificação como lida:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao marcar notificação como lida'
    })
  }
})