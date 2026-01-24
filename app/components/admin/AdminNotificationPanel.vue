<template>
  <div class="space-y-1">
    <!-- Notificação de Adiantamentos -->
    <div class="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-green-600 text-sm">💰</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">Adiantamentos Disponibilizados</p>
          <p class="text-xs text-gray-600 mt-1">
            3 adiantamentos foram disponibilizados automaticamente no dia 17
          </p>
          <p class="text-xs text-gray-400 mt-1">Há 2 horas</p>
        </div>
        <div class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
      </div>
    </div>

    <!-- Notificação de Holerites Gerados -->
    <div class="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-blue-600 text-sm">📄</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">Folhas Mensais Geradas</p>
          <p class="text-xs text-gray-600 mt-1">
            15 folhas mensais foram geradas e estão aguardando disponibilização
          </p>
          <p class="text-xs text-gray-400 mt-1">Há 4 horas</p>
        </div>
        <div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
      </div>
    </div>

    <!-- Notificação de Sistema -->
    <div class="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-yellow-600 text-sm">⚠️</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">Lembrete: Próxima Disponibilização</p>
          <p class="text-xs text-gray-600 mt-1">
            Próximos adiantamentos serão disponibilizados automaticamente no dia 17/02
          </p>
          <p class="text-xs text-gray-400 mt-1">Sistema</p>
        </div>
        <div class="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
      </div>
    </div>

    <!-- Botão Ver Todas -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <button class="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
        Ver todas as notificações
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Este componente pode ser expandido para buscar notificações reais de uma API
</script>