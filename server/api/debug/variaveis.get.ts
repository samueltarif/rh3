// API para debug das variáveis de ambiente (apenas em desenvolvimento)
export default defineEventHandler(async (event) => {
  // Só funciona em desenvolvimento por segurança
  const config = useRuntimeConfig()
  
  // Verificar se estamos em produção
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
  
  if (isProduction) {
    throw createError({
      statusCode: 403,
      message: 'Debug não disponível em produção'
    })
  }
  
  try {
    const variaveis = {
      // Variáveis do runtime config
      supabaseUrl: config.public.supabaseUrl,
      supabaseKey: config.public.supabaseKey ? 'DEFINIDA' : 'NÃO DEFINIDA',
      serviceRoleKey: config.supabaseServiceRoleKey ? 'DEFINIDA' : 'NÃO DEFINIDA',
      baseUrl: config.public.baseUrl,
      
      // Variáveis de ambiente diretas
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL ? 'DEFINIDA' : 'NÃO DEFINIDA',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA',
        NUXT_PUBLIC_SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL ? 'DEFINIDA' : 'NÃO DEFINIDA',
        NUXT_PUBLIC_SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA',
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL
      }
    }
    
    return {
      success: true,
      message: 'Debug das variáveis de ambiente',
      data: variaveis,
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Erro no debug: ${error.message}`
    })
  }
})