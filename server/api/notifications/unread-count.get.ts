import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * API para obter contagem de notificações não lidas
 * GET /api/notifications/unread-count
 * 
 * Retorna: { unreadCount: number, success: boolean }
 * 
 * Nota: Por enquanto, todas as notificações são para admin.
 * No futuro, pode ser expandido para notificações por usuário.
 */
export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)

    console.log('📊 [UNREAD-COUNT] Buscando contagem de notificações não lidas...')

    // Buscar contagem de notificações não lidas e não expiradas
    // Por enquanto, todas as notificações são para admin
    const { count, error } = await supabase
      .from('notificacoes')
      .select('*', { count: 'exact', head: true })
      .eq('lida', false)
      .or('data_expiracao.is.null,data_expiracao.gt.' + new Date().toISOString())

    if (error) {
      console.error('❌ [UNREAD-COUNT] Erro ao buscar contagem:', error)
      throw error
    }

    const unreadCount = count || 0
    console.log(`✅ [UNREAD-COUNT] Notificações não lidas: ${unreadCount}`)

    // Definir cache headers para otimizar performance
    setHeader(event, 'Cache-Control', 'no-cache, must-revalidate')
    setHeader(event, 'X-Unread-Count', unreadCount.toString())

    return {
      success: true,
      unreadCount,
      timestamp: new Date().toISOString(),
      metadata: {
        total_checked: count,
        cache_duration: '15s',
        polling_interval: '30s'
      }
    }

  } catch (error: any) {
    console.error('💥 [UNREAD-COUNT] Erro na API:', error)
    
    // Em caso de erro, retornar 0 para não quebrar a UI
    return {
      success: false,
      unreadCount: 0,
      error: error.message || 'Erro ao buscar contagem de notificações',
      timestamp: new Date().toISOString()
    }
  }
})