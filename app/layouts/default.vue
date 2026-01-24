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
            <button 
              v-if="isAdmin"
              @click="toggleNotifications"
              class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{ 'bg-blue-50': showNotifications }"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5V11"/>
              </svg>
              <!-- Badge de notificações -->
              <span 
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
            
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

      <!-- Painel de Notificações (Mobile) -->
      <div 
        v-if="showNotifications && isAdmin"
        class="lg:hidden fixed inset-0 z-50 bg-black/50"
        @click="showNotifications = false"
      >
        <div 
          class="absolute top-16 right-4 left-4 bg-white rounded-xl shadow-xl max-h-96 overflow-hidden"
          @click.stop
        >
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900">📢 Notificações do Sistema</h3>
              <button 
                @click="showNotifications = false"
                class="p-1 rounded-lg hover:bg-gray-100"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="max-h-80 overflow-y-auto">
            <AdminNotificationPanel />
          </div>
        </div>
      </div>

      <!-- Conteúdo da Página -->
      <main class="p-4 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Sistema de Notificações Toast -->
    <UiNotificationContainer />
  </div>
</template>

<script setup lang="ts">
const { user, isAdmin } = useAuth()
const mobileMenuOpen = ref(false)
const showNotifications = ref(false)

// Simulação de contagem de notificações não lidas
const unreadCount = ref(3) // Isso viria de uma API real

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

// Fechar notificações quando clicar fora (mobile)
const closeNotificationsOnOutsideClick = (event: Event) => {
  if (showNotifications.value) {
    const target = event.target as HTMLElement
    if (!target.closest('.notification-panel')) {
      showNotifications.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', closeNotificationsOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closeNotificationsOnOutsideClick)
})
</script>
