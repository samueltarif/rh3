#!/usr/bin/env node

/**
 * Script para testar as APIs no Vercel após deploy
 * Execute: node testar-apis-vercel.mjs
 */

const BASE_URL = 'https://seu-dominio-vercel.vercel.app' // ALTERE PARA SUA URL DO VERCEL

const apis = [
  '/api/health',
  '/api/dashboard/stats',
  '/api/dashboard/aniversariantes',
  '/api/funcionarios',
  '/api/holerites'
]

async function testarAPI(endpoint) {
  try {
    console.log(`\n🔍 Testando: ${endpoint}`)
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`📊 Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Sucesso:`, JSON.stringify(data, null, 2).substring(0, 200) + '...')
    } else {
      const error = await response.text()
      console.log(`❌ Erro:`, error.substring(0, 300) + '...')
    }
    
  } catch (error) {
    console.log(`💥 Erro de rede:`, error.message)
  }
}

async function executarTestes() {
  console.log('🚀 Iniciando testes das APIs...')
  console.log(`🌐 Base URL: ${BASE_URL}`)
  
  for (const api of apis) {
    await testarAPI(api)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Aguarda 1s entre requests
  }
  
  console.log('\n✨ Testes concluídos!')
  console.log('\n📋 PRÓXIMOS PASSOS:')
  console.log('1. Se alguma API retornou erro 500, verifique os Runtime Logs no Vercel')
  console.log('2. Vá para: Vercel Dashboard → Seu Projeto → Functions → Runtime Logs')
  console.log('3. Procure por mensagens como [STATS], [FUNCIONARIOS], etc.')
}

executarTestes()