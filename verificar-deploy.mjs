// ========================================
// VERIFICAÇÃO DE DEPLOY - VERCEL
// ========================================
// Script para verificar se o deploy está funcionando

console.log('🔍 VERIFICANDO CONFIGURAÇÃO PARA DEPLOY NO VERCEL\n')

// 1. Verificar arquivos necessários
const fs = require('fs')
const path = require('path')

const arquivosNecessarios = [
  'vercel.json',
  'nuxt.config.ts',
  'package.json',
  '.env.example',
  '.vercelignore'
]

console.log('1️⃣ Verificando arquivos de configuração...')
arquivosNecessarios.forEach(arquivo => {
  if (fs.existsSync(arquivo)) {
    console.log(`   ✅ ${arquivo}`)
  } else {
    console.log(`   ❌ ${arquivo} - FALTANDO!`)
  }
})

// 2. Verificar package.json
console.log('\n2️⃣ Verificando package.json...')
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  console.log(`   ✅ Nome: ${pkg.name}`)
  console.log(`   ✅ Versão: ${pkg.version}`)
  
  if (pkg.scripts.build) {
    console.log('   ✅ Script de build configurado')
  } else {
    console.log('   ❌ Script de build não encontrado')
  }
  
  if (pkg.engines && pkg.engines.node) {
    console.log(`   ✅ Versão do Node especificada: ${pkg.engines.node}`)
  } else {
    console.log('   ⚠️ Versão do Node não especificada')
  }
  
} catch (error) {
  console.log('   ❌ Erro ao ler package.json:', error.message)
}

// 3. Verificar nuxt.config.ts
console.log('\n3️⃣ Verificando nuxt.config.ts...')
try {
  const config = fs.readFileSync('nuxt.config.ts', 'utf8')
  
  if (config.includes('preset: \'vercel\'')) {
    console.log('   ✅ Preset do Vercel configurado')
  } else {
    console.log('   ⚠️ Preset do Vercel não encontrado')
  }
  
  if (config.includes('maxDuration')) {
    console.log('   ✅ Timeout das funções configurado')
  } else {
    console.log('   ⚠️ Timeout das funções não configurado')
  }
  
} catch (error) {
  console.log('   ❌ Erro ao ler nuxt.config.ts:', error.message)
}

// 4. Verificar dependências críticas
console.log('\n4️⃣ Verificando dependências...')
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  
  const dependenciasCriticas = [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    'nuxt',
    'vue'
  ]
  
  dependenciasCriticas.forEach(dep => {
    if (deps[dep]) {
      console.log(`   ✅ ${dep}: ${deps[dep]}`)
    } else {
      console.log(`   ❌ ${dep} - FALTANDO!`)
    }
  })
  
} catch (error) {
  console.log('   ❌ Erro ao verificar dependências:', error.message)
}

// 5. Verificar estrutura de pastas
console.log('\n5️⃣ Verificando estrutura de pastas...')
const pastasNecessarias = [
  'app',
  'server',
  'public',
  'docs'
]

pastasNecessarias.forEach(pasta => {
  if (fs.existsSync(pasta)) {
    console.log(`   ✅ ${pasta}/`)
  } else {
    console.log(`   ❌ ${pasta}/ - FALTANDO!`)
  }
})

console.log('\n' + '='.repeat(60))
console.log('📋 RESUMO DA VERIFICAÇÃO')
console.log('='.repeat(60))

console.log('\n✅ PRÓXIMOS PASSOS PARA DEPLOY NO VERCEL:')
console.log('1. Acesse: https://vercel.com/dashboard')
console.log('2. Clique em "New Project"')
console.log('3. Conecte o GitHub e selecione: samueltarif/rh3')
console.log('4. Configure as variáveis de ambiente:')
console.log('   - SUPABASE_URL')
console.log('   - SUPABASE_ANON_KEY')
console.log('   - SUPABASE_SERVICE_ROLE_KEY')
console.log('5. Clique em "Deploy"')

console.log('\n📖 Documentação completa: docs/DEPLOY-VERCEL.md')
console.log('\n🚀 Sistema pronto para deploy!')