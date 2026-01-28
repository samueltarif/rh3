/**
 * Composable para integração com WebSocket de notificações
 * Preparado para implementação futura de notificações em tempo real
 */

interface WebSocketMessage {
  type: 'notification_count_update' | 'new_notification' | 'notification_read'
  data: {
    unreadCount?: number
    notification?: any
    notificationId?: string
  }
  timestamp: string
}

export const useNotificationWebSocket = () => {
  const { incrementCount, decrementCount, refresh } = useNotificationCount()
  
  let ws: WebSocket | null = null
  let reconnectTimer: NodeJS.Timeout | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000

  const isConnected = ref(false)
  const connectionError = ref<string | null>(null)

  /**
   * Conecta ao WebSocket
   */
  const connect = (): void => {
    if (process.server) return // Só no cliente

    try {
      // URL do WebSocket (ajustar conforme necessário)
      const wsUrl = process.env.NODE_ENV === 'development' 
        ? 'ws://localhost:3001/ws/notifications'
        : `wss://${window.location.host}/ws/notifications`

      console.log('🔌 [WS] Conectando ao WebSocket:', wsUrl)

      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('✅ [WS] Conectado ao WebSocket')
        isConnected.value = true
        connectionError.value = null
        reconnectAttempts = 0
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          handleWebSocketMessage(message)
        } catch (error) {
          console.error('❌ [WS] Erro ao processar mensagem:', error)
        }
      }

      ws.onclose = (event) => {
        console.log('🔌 [WS] Conexão fechada:', event.code, event.reason)
        isConnected.value = false
        
        // Tentar reconectar se não foi fechamento intencional
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect()
        }
      }

      ws.onerror = (error) => {
        console.error('❌ [WS] Erro na conexão:', error)
        connectionError.value = 'Erro na conexão WebSocket'
        isConnected.value = false
      }

    } catch (error: any) {
      console.error('❌ [WS] Erro ao conectar:', error)
      connectionError.value = error.message
    }
  }

  /**
   * Desconecta do WebSocket
   */
  const disconnect = (): void => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    if (ws) {
      console.log('🔌 [WS] Desconectando...')
      ws.close(1000, 'Desconexão intencional')
      ws = null
    }

    isConnected.value = false
  }

  /**
   * Agenda uma tentativa de reconexão
   */
  const scheduleReconnect = (): void => {
    if (reconnectTimer) return

    reconnectAttempts++
    const delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1) // Backoff exponencial

    console.log(`🔄 [WS] Tentativa de reconexão ${reconnectAttempts}/${maxReconnectAttempts} em ${delay}ms`)

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
    }, delay)
  }

  /**
   * Processa mensagens do WebSocket
   */
  const handleWebSocketMessage = (message: WebSocketMessage): void => {
    console.log('📨 [WS] Mensagem recebida:', message)

    switch (message.type) {
      case 'notification_count_update':
        // Atualizar contagem diretamente
        if (typeof message.data.unreadCount === 'number') {
          console.log(`📊 [WS] Contagem atualizada via WebSocket: ${message.data.unreadCount}`)
          // Aqui você poderia atualizar diretamente o estado global
          // Por enquanto, vamos fazer um refresh para garantir consistência
          refresh()
        }
        break

      case 'new_notification':
        // Nova notificação recebida
        console.log('🔔 [WS] Nova notificação recebida')
        incrementCount(1)
        
        // Opcional: mostrar toast/notificação visual
        // showNotificationToast(message.data.notification)
        break

      case 'notification_read':
        // Notificação marcada como lida
        console.log('✅ [WS] Notificação marcada como lida')
        decrementCount(1)
        break

      default:
        console.warn('⚠️ [WS] Tipo de mensagem desconhecido:', message.type)
    }
  }

  /**
   * Envia uma mensagem via WebSocket
   */
  const sendMessage = (message: Partial<WebSocketMessage>): void => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ [WS] WebSocket não conectado')
      return
    }

    try {
      const fullMessage: WebSocketMessage = {
        type: message.type || 'notification_count_update',
        data: message.data || {},
        timestamp: new Date().toISOString()
      }

      ws.send(JSON.stringify(fullMessage))
      console.log('📤 [WS] Mensagem enviada:', fullMessage)
    } catch (error) {
      console.error('❌ [WS] Erro ao enviar mensagem:', error)
    }
  }

  // Cleanup automático
  onUnmounted(() => {
    disconnect()
  })

  return {
    // Estados
    isConnected: readonly(isConnected),
    connectionError: readonly(connectionError),

    // Métodos
    connect,
    disconnect,
    sendMessage,

    // Informações
    reconnectAttempts: readonly(ref(reconnectAttempts)),
    maxReconnectAttempts
  }
}

/**
 * Versão simplificada para uso básico
 * Conecta automaticamente e gerencia o ciclo de vida
 */
export const useNotificationRealtime = () => {
  const { connect, disconnect, isConnected } = useNotificationWebSocket()

  // Conectar automaticamente quando o composable for usado
  onMounted(() => {
    // Só conectar se WebSocket estiver disponível
    if (typeof WebSocket !== 'undefined') {
      connect()
    }
  })

  // Desconectar automaticamente
  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected
  }
}