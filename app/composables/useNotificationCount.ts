/**
 * Composable para gerenciar contagem de notificações não lidas
 * Inclui polling automático, cache e reatividade
 */

interface NotificationCountResponse {
  success: boolean
  unreadCount: number
  timestamp: string
  error?: string
}

// Estado global reativo
const globalUnreadCount = ref(0)
const globalLastUpdate = ref<Date | null>(null)
const globalIsLoading = ref(false)
const globalError = ref<string | null>(null)

// Configurações
const POLLING_INTERVAL = 30000 // 30 segundos
const CACHE_DURATION = 15000 // 15 segundos de cache

let pollingTimer: NodeJS.Timeout | null = null
let lastFetchTime = 0

export const useNotificationCount = () => {
  // Estados locais reativos
  const unreadCount = readonly(globalUnreadCount)
  const lastUpdate = readonly(globalLastUpdate)
  const isLoading = readonly(globalIsLoading)
  const error = readonly(globalError)

  /**
   * Busca a contagem de notificações não lidas
   */
  const fetchUnreadCount = async (force = false): Promise<void> => {
    const now = Date.now()
    
    // Verificar cache se não for forçado
    if (!force && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('📊 [NOTIFICATION-COUNT] Usando cache')
      return
    }

    try {
      globalIsLoading.value = true
      globalError.value = null

      console.log('📊 [NOTIFICATION-COUNT] Buscando contagem...')

      const response: NotificationCountResponse = await $fetch('/api/notifications/unread-count', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (response.success) {
        const newCount = response.unreadCount || 0
        
        // Só atualizar se mudou para evitar re-renders desnecessários
        if (globalUnreadCount.value !== newCount) {
          console.log(`📊 [NOTIFICATION-COUNT] Contagem atualizada: ${globalUnreadCount.value} → ${newCount}`)
          globalUnreadCount.value = newCount
        }
        
        globalLastUpdate.value = new Date(response.timestamp)
        lastFetchTime = now
      } else {
        throw new Error(response.error || 'Erro desconhecido')
      }

    } catch (err: any) {
      console.error('❌ [NOTIFICATION-COUNT] Erro ao buscar contagem:', err)
      globalError.value = err.message || 'Erro ao carregar notificações'
      
      // Em caso de erro, manter o último valor conhecido
      // Não zerar para evitar "flicker" na UI
    } finally {
      globalIsLoading.value = false
    }
  }

  /**
   * Inicia o polling automático
   */
  const startPolling = (): void => {
    if (pollingTimer) return // Já está rodando

    console.log('🔄 [NOTIFICATION-COUNT] Iniciando polling automático')
    
    // Buscar imediatamente
    fetchUnreadCount()
    
    // Configurar polling
    pollingTimer = setInterval(() => {
      fetchUnreadCount()
    }, POLLING_INTERVAL)
  }

  /**
   * Para o polling automático
   */
  const stopPolling = (): void => {
    if (pollingTimer) {
      console.log('⏹️ [NOTIFICATION-COUNT] Parando polling automático')
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  /**
   * Força uma atualização imediata
   */
  const refresh = async (): Promise<void> => {
    await fetchUnreadCount(true)
  }

  /**
   * Incrementa a contagem localmente (para feedback imediato)
   */
  const incrementCount = (amount = 1): void => {
    globalUnreadCount.value += amount
    console.log(`📈 [NOTIFICATION-COUNT] Incrementado: +${amount} (total: ${globalUnreadCount.value})`)
  }

  /**
   * Decrementa a contagem localmente (para feedback imediato)
   */
  const decrementCount = (amount = 1): void => {
    globalUnreadCount.value = Math.max(0, globalUnreadCount.value - amount)
    console.log(`📉 [NOTIFICATION-COUNT] Decrementado: -${amount} (total: ${globalUnreadCount.value})`)
  }

  /**
   * Zera a contagem localmente
   */
  const resetCount = (): void => {
    globalUnreadCount.value = 0
    console.log('🔄 [NOTIFICATION-COUNT] Contagem zerada')
  }

  /**
   * Computed para verificar se há notificações
   */
  const hasUnreadNotifications = computed(() => unreadCount.value > 0)

  /**
   * Computed para texto de acessibilidade
   */
  const ariaLabel = computed(() => {
    const count = unreadCount.value
    if (count === 0) return 'Notificações, nenhuma não lida'
    if (count === 1) return 'Notificações, 1 não lida'
    return `Notificações, ${count} não lidas`
  })

  // Cleanup automático quando o componente for desmontado
  onUnmounted(() => {
    stopPolling()
  })

  return {
    // Estados
    unreadCount,
    lastUpdate,
    isLoading,
    error,
    hasUnreadNotifications,
    ariaLabel,

    // Métodos
    fetchUnreadCount,
    startPolling,
    stopPolling,
    refresh,
    incrementCount,
    decrementCount,
    resetCount
  }
}