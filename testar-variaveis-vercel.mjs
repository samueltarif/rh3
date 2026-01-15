// ========================================
// TESTE DE VARIÁVEIS DE AMBIENTE - VERCEL
// ========================================

console.log('🔍 TESTANDO VARIÁVEIS DE AMBIENTE DO SUPABASE\n')

// Verificar se as variáveis estão definidas
const variaveis = {
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'NUXT_PUBLIC_SUPABASE_URL': process.env.NUXT_PUBLIC_SUPABASE_URL,
  'NUXT_PUBLIC_SUPABASE_KEY': process.env.NUXT_PUBLIC_SUPABASE_KEY
}

console.log('📋 VERIFICAÇÃO DAS VARIÁVEIS:')
console.log('─'.repeat(60))

let todasDefinidas = true

Object.entries(variaveis).forEach(([nome, valor]) => {
  if (valor) {
    const valorMostrar = valor.length > 50 ? valor.substring(0, 50) + '...' : valor
    console.log(`✅ ${nome}: ${valorMostrar}`)
  } else {
    console.log(`❌ ${nome}: NÃO DEFINIDA`)
    todasDefinidas = false
  }
})

console.log('\n' + '='.repeat(60))

if (todasDefinidas) {
  console.log('✅ TODAS AS VARIÁVEIS ESTÃO DEFINIDAS!')
  console.log('\n🧪 Testando conexão com Supabase...')
  
  // Tentar criar cliente Supabase
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY
    
    if (supabaseUrl && supabaseKey) {
      console.log('✅ URL e Key disponíveis para criar cliente')
      console.log(`   URL: ${supabaseUrl}`)
      console.log(`   Key: ${supabaseKey.substring(0, 20)}...`)
    } else {
      console.log('❌ URL ou Key não disponíveis')
    }
    
  } catch (error) {
    console.log('❌ Erro ao testar:', error.message)
  }
  
} else {
  console.log('❌ ALGUMAS VARIÁVEIS ESTÃO FALTANDO!')
  console.log('\n📋 INSTRUÇÕES PARA CORRIGIR:')
  console.log('1. Acesse: https://vercel.com/dashboard')
  console.log('2. Selecione seu projeto')
  console.log('3. Vá em: Settings → Environment Variables')
  console.log('4. Adicione as variáveis faltantes')
  console.log('5. Faça redeploy do projeto')
}

console.log('\n📖 Documentação: docs/CORRECAO-ERRO-SUPABASE-VERCEL.md')
console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard')
console.log('🔗 Vercel Dashboard: https://vercel.com/dashboard')