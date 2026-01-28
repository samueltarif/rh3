<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar Desktop -->
    <LayoutSidebar :user="user" :is-admin="isAdmin" />

    <!-- Conteúdo Principal -->
    <div class="lg:pl-72">
      <!-- Header Mobile -->
      <header class="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">RH</span>
            </div>
            <span class="font-bold text-gray-800">Sistema RH</span>
          </div>
          
          <!-- Botões do Header Mobile -->
          <div class="flex items-center gap-2">
            <!-- Botão de Notificações (Mobile) -->
            <UiNotificationBadge 
              v-if="isAdmin"
              :count="unreadCount" 
              size="sm"
              color="red"
            >
              <button 
                @click.stop="toggleNotifications"
                class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                :class="{ 'bg-blue-50': showNotifications }"
                :aria-label="notificationAriaLabel"
              >
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5V11"/>
                </svg>
              </button>
            </UiNotificationBadge>
            
            <!-- Botão do Menu Mobile -->
            <button 
              @click="mobileMenuOpen = true"
              class="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Menu Mobile -->
      <LayoutMobileMenu 
        :open="mobileMenuOpen" 
        :user="user" 
        :is-admin="isAdmin"
        @close="mobileMenuOpen = false"
      />

      <!-- Conteúdo da Página -->
      <main class="p-4 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Sistema de Notificações Toast -->
    <UiNotificationContainer />
    
    <!-- Drawer de Notificações -->
    <div v-if="showNotifications && isAdmin" class="fixed inset-0 z-[9999]">
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50" 
        @click="closeNotifications"
      ></div>
      
      <!-- Drawer Panel -->
      <div class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 bg-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 text-lg">🔔</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Notificações</h3>
                <p class="text-sm text-gray-500">
                  {{ notificacoes.length }} notificação{{ notificacoes.length !== 1 ? 'ões' : '' }}
                  {{ totalNaoLidas > 0 ? `(${totalNaoLidas} não lida${totalNaoLidas !== 1 ? 's' : ''})` : '' }}
                </p>
              </div>
            </div>
            <button 
              @click="closeNotifications"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Filtros e Ações -->
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <select 
              v-model="filtroTipo" 
              @change="aplicarFiltros"
              class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Todos os tipos</option>
              <option value="info">Informações</option>
              <option value="success">Sucessos</option>
              <option value="warning">Avisos</option>
              <option value="error">Erros</option>
            </select>
            
            <button 
              v-if="totalNaoLidas > 0"
              @click="marcarTodasComoLidas"
              :disabled="isMarkingAllRead"
              class="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ isMarkingAllRead ? 'Marcando...' : 'Marcar todas como lidas' }}
            </button>
          </div>
        </div>
        
        <!-- Conteúdo -->
        <div class="flex-1 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="loadingNotifications" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-sm text-gray-500 mt-3">Carregando notificações...</p>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!notificacoesFiltradas || notificacoesFiltradas.length === 0" class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-gray-400 text-2xl">🔔</span>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ filtroTipo ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação' }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ filtroTipo ? 'Tente ajustar os filtros acima' : 'Não há notificações no momento' }}
            </p>
          </div>
          
          <!-- Notificações -->
          <div v-else class="divide-y divide-gray-100">
            <div 
              v-for="notificacao in notificacoesFiltradas" 
              :key="notificacao.id"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              :class="{ 'bg-blue-50': !notificacao.lida }"
              @click="marcarComoLida(notificacao)"
            >
              <div class="flex items-start gap-3">
                <!-- Ícone -->
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getNotificationStyle(notificacao.tipo).bg"
                >
                  <span :class="getNotificationStyle(notificacao.tipo).text" class="text-base">
                    {{ getNotificationIcon(notificacao.tipo) }}
                  </span>
                </div>
                
                <!-- Conteúdo -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {{ notificacao.titulo }}
                      </h4>
                      <p class="text-xs text-gray-700 mb-2 leading-relaxed">
                        {{ notificacao.mensagem }}
                      </p>
                      
                      <!-- Detalhes das alterações -->
                      <div v-if="notificacao.dados?.alteracoes_detalhadas && notificacao.dados.alteracoes_detalhadas.length > 0" class="mt-2 p-2 bg-gray-50 rounded-lg">
                        <h5 class="text-xs font-semibold text-gray-700 mb-1">Alterações:</h5>
                        <ul class="text-xs text-gray-600 space-y-0.5">
                          <li v-for="(alteracao, index) in notificacao.dados.alteracoes_detalhadas.slice(0, 3)" :key="index" class="flex items-start gap-1">
                            <span class="text-blue-500 mt-0.5 text-xs">•</span>
                            <span>{{ alteracao }}</span>
                          </li>
                          <li v-if="notificacao.dados.alteracoes_detalhadas.length > 3" class="text-xs text-gray-500 italic">
                            +{{ notificacao.dados.alteracoes_detalhadas.length - 3 }} mais...
                          </li>
                        </ul>
                      </div>
                      
                      <!-- Metadados -->
                      <div class="flex items-center gap-3 text-xs text-gray-500 mt-2">
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {{ formatarData(notificacao.created_at) }}
                        </span>
                        
                        <span v-if="notificacao.origem" class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                          </svg>
                          {{ formatarOrigem(notificacao.origem) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Status -->
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <div v-if="!notificacao.lida" 
                           class="w-2 h-2 rounded-full"
                           :class="getNotificationStyle(notificacao.tipo).dot">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>
              Exibindo {{ notificacoes.length }} notificação{{ notificacoes.length !== 1 ? 'ões' : '' }}
              {{ totalNaoLidas > 0 ? `(${totalNaoLidas} não lida${totalNaoLidas !== 1 ? 's' : ''})` : '' }}
            </span>
            <button 
              @click="carregarNotificacoes"
              :disabled="loadingNotifications"
              class="text-blue-600 hover:text-blue-700 disabled:opacity-50 focus:outline-none focus:underline"
            >
              {{ loadingNotifications ? 'Carregando...' : 'Atualizar' }}
            </button>
          </div>
          
          <div class="text-xs text-gray-400 text-center">
            Últimas 50 notificações dos últimos 30 dias
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isAdmin } = useAuth()
const mobileMenuOpen = ref(false)

// Sistema de notificações integrado
const {
  unreadCount,
  hasUnreadNotifications,
  ariaLabel: notificationAriaLabel,
  refresh: refreshNotifications
} = useNotificationCount()

// Estado global das notificações (compartilhado com LayoutSidebar)
const showNotifications = useState('notifications-open', () => false)

// Estados para notificações
const notificacoes = ref<any[]>([])
const loadingNotifications = ref(false)
const filtroTipo = ref('')
const isMarkingAllRead = ref(false)

// Computeds
const totalNaoLidas = computed(() => notificacoes.value.filter((n: any) => !n.lida).length)
const notificacoesFiltradas = computed(() => {
  let filtradas = [...notificacoes.value]
  if (filtroTipo.value) {
    filtradas = filtradas.filter((n: any) => n.tipo === filtroTipo.value)
  }
  return filtradas
})

// Buscar notificações
const carregarNotificacoes = async () => {
  try {
    loadingNotifications.value = true
    console.log('🔔 [LAYOUT] Carregando últimas 50 notificações...')
    
    const response: any = await $fetch('/api/notificacoes', {
      query: { limite: 50 }
    })
    
    if (response.success) {
      notificacoes.value = response.notificacoes || []
      console.log('🔔 [LAYOUT] Notificações carregadas:', notificacoes.value.length)
      console.log('🔔 [LAYOUT] Primeira notificação:', notificacoes.value[0]?.titulo)
      console.log('🔔 [LAYOUT] Última notificação:', notificacoes.value[notificacoes.value.length - 1]?.titulo)
    } else {
      console.error('🔔 [LAYOUT] Erro ao carregar notificações:', response.error)
    }
  } catch (error) {
    console.error('🔔 [LAYOUT] Erro ao carregar notificações:', error)
  } finally {
    loadingNotifications.value = false
  }
}

const toggleNotifications = async () => {
  console.log('🔔 [LAYOUT-MOBILE] === INÍCIO DO TOGGLE MOBILE ===')
  console.log('🔔 [LAYOUT-MOBILE] Estado ANTES:', showNotifications.value)
  console.log('🔔 [LAYOUT-MOBILE] isAdmin:', isAdmin.value)
  
  const oldValue = showNotifications.value
  showNotifications.value = !showNotifications.value
  
  console.log('🔔 [LAYOUT-MOBILE] Estado DEPOIS:', showNotifications.value)
  console.log('🔔 [LAYOUT-MOBILE] Mudança:', oldValue, '->', showNotifications.value)
  console.log('🔔 [LAYOUT-MOBILE] Condição drawer:', showNotifications.value && isAdmin.value)
  
  // SEMPRE carregar notificações quando abrir (corrigir bug)
  if (showNotifications.value) {
    console.log('🔄 [LAYOUT-MOBILE] Carregando notificações automaticamente...')
    await carregarNotificacoes()
    await refreshNotifications()
  }
  
  console.log('🔔 [LAYOUT-MOBILE] === FIM DO TOGGLE MOBILE ===')
}

const closeNotifications = () => {
  console.log('🔔 [LAYOUT] Fechando notificações')
  showNotifications.value = false
}

// Marcar notificação como lida
const marcarComoLida = async (notificacao: any) => {
  if (notificacao.lida) return
  
  try {
    await $fetch(`/api/notificacoes/${notificacao.id}/marcar-lida`, {
      method: 'PATCH'
    })
    
    // Atualizar localmente
    notificacao.lida = true
    notificacao.data_leitura = new Date().toISOString()
    
    console.log('🔔 [LAYOUT] Notificação marcada como lida:', notificacao.id)
  } catch (error) {
    console.error('🔔 [LAYOUT] Erro ao marcar notificação como lida:', error)
  }
}

// Marcar todas como lidas
const marcarTodasComoLidas = async () => {
  const naoLidas = notificacoesFiltradas.value.filter((n: any) => !n.lida)
  
  if (naoLidas.length === 0) return
  
  try {
    isMarkingAllRead.value = true
    
    await Promise.all(
      naoLidas.map((notificacao: any) => 
        $fetch(`/api/notificacoes/${notificacao.id}/marcar-lida`, {
          method: 'PATCH'
        })
      )
    )
    
    // Atualizar localmente
    naoLidas.forEach((notificacao: any) => {
      notificacao.lida = true
      notificacao.data_leitura = new Date().toISOString()
    })
    
    console.log('🔔 [LAYOUT] Todas as notificações marcadas como lidas')
  } catch (error) {
    console.error('🔔 [LAYOUT] Erro ao marcar todas como lidas:', error)
  } finally {
    isMarkingAllRead.value = false
  }
}

// Aplicar filtros
const aplicarFiltros = () => {
  console.log('🔔 [LAYOUT] Aplicando filtro:', filtroTipo.value)
}

// Funções auxiliares
const getNotificationIcon = (tipo: string) => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '🚨',
    sistema: '⚙️',
    login: '🔐',
    alteracao_dados: '✏️',
    novo_funcionario: '👤',
    geracao_holerites: '💰',
    envio_email: '📧',
    login_falhado: '🚨',
    erro_sistema: '💥',
    visualizacao_holerite: '👁️',
    download_holerite: '📥'
  }
  return icons[tipo as keyof typeof icons] || 'ℹ️'
}

const getNotificationStyle = (tipo: string) => {
  const styles = {
    info: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    success: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
    error: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    sistema: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500' },
    login: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    alteracao_dados: { bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
    novo_funcionario: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
    geracao_holerites: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
    envio_email: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    login_falhado: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    erro_sistema: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    visualizacao_holerite: { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' },
    download_holerite: { bg: 'bg-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500' }
  }
  return styles[tipo as keyof typeof styles] || styles.info
}

const formatarData = (data: string) => {
  const dataObj = new Date(data)
  return dataObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatarOrigem = (origem: string) => {
  const origens = {
    login: 'Login',
    alteracao_dados: 'Alteração de Dados',
    novo_funcionario: 'Novo Funcionário',
    geracao_holerites: 'Geração de Holerites',
    envio_email: 'Envio de Email',
    login_falhado: 'Login Falhado',
    erro_sistema: 'Erro do Sistema',
    sistema: 'Sistema',
    visualizacao_holerite: 'Visualização de Holerite',
    download_holerite: 'Download de Holerite'
  }
  return origens[origem as keyof typeof origens] || origem
}

// Carregar notificações ao montar o componente (se for admin)
onMounted(async () => {
  if (isAdmin.value) {
    console.log('🔄 [LAYOUT] Carregando notificações iniciais para admin...')
    await carregarNotificacoes()
    await refreshNotifications()
  }
})
watch(() => showNotifications.value, async (newValue, oldValue) => {
  console.log('🔔 [LAYOUT-MOBILE] WATCHER: showNotifications mudou:', oldValue, '->', newValue)
  console.log('🔔 [LAYOUT-MOBILE] WATCHER: isAdmin:', isAdmin.value)
  console.log('🔔 [LAYOUT-MOBILE] WATCHER: Drawer será exibido?', newValue && isAdmin.value)
  
  if (newValue && isAdmin.value) {
    console.log('✅ [LAYOUT-MOBILE] DRAWER DEVE APARECER AGORA!')
    console.log('🔄 [LAYOUT-MOBILE] WATCHER: Carregando notificações automaticamente...')
    
    // Carregar notificações automaticamente quando abrir
    await carregarNotificacoes()
    await refreshNotifications()
  } else {
    console.log('❌ [LAYOUT-MOBILE] Drawer não deve aparecer')
  }
})
</script>