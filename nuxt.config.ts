// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Otimização para Vercel
  nitro: {
    preset: 'vercel',
    vercel: {
      functions: {
        maxDuration: 30
      }
    }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],
  
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login']
    }
  },
  
  runtimeConfig: {
    // Chaves privadas (apenas no servidor)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Chaves públicas (expostas ao cliente)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
      baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
  
  app: {
    head: {
      title: 'Sistema RH Qualitec - Gestão de Colaboradores',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de RH para gestão de colaboradores, holerites e folha de pagamento da Qualitec' },
        { name: 'robots', content: 'noindex, nofollow' } // Privacidade para sistema interno
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  
  // Otimizações de build
  build: {
    transpile: ['@headlessui/vue']
  },
  
  // CSS otimizado
  css: [
    '~/assets/css/main.css'
  ]
})