#!/usr/bin/env node

/**
 * Script para verificar o status atual das APIs localmente
 * Execute: node verificar-status-apis.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis do .env
dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 VERIFICANDO CONFIGURAÇÕES...\n')

// Verificar variáveis essenciais
console.log('📋 VARIÁVEIS DE AMBIENTE:')
console.log(`✅ SUPABASE_URL: ${supabaseUrl ? 'DEFINIDA' : '❌ NÃO DEFINIDA'}`)
console.log(`✅ SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'DEFINIDA' : '❌ NÃO DEFINIDA'}`)

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('\n❌ ERRO: Variáveis essenciais não definidas!')
  process.exit(1)
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verificarConexaoSupabase() {
  try {
    console.log('\n🔗 TESTANDO CONEXÃO COM SUPABASE...')
    
    // Teste simples de conexão
    const { data, error } = await supabase
      .from('funcionarios')
      .select('id')
      .limit(1)
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message)
      return false
    }
    
    console.log('✅ Conexão com Supabase OK')
    return true
    
  } catch (error) {
    console.log('💥 Erro de rede:', error.message)
    return false
  }
}

async function verificarTabelas() {
  console.log('\n📊 VERIFICANDO TABELAS...')
  
  const tabelas = [
    'funcionarios',
    'empresas', 
    'holerites',
    'cargos',
    'departamentos'
  ]
  
  for (const tabela of tabelas) {
    try {
      const { data, error } = await supabase
        .from(tabela)
        .select('id')
        .limit(1)
      
      if (error) {
        console.log(`❌ ${tabela}: ${error.message}`)
      } else {
        console.log(`✅ ${tabela}: OK`)
      }
      
    } catch (error) {
      console.log(`💥 ${tabela}: ${error.message}`)
    }
  }
}

async function verificarDados() {
  console.log('\n📈 VERIFICANDO DADOS...')
  
  try {
    // Contar funcionários
    const { count: funcionarios } = await supabase
      .from('funcionarios')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true)
    
    console.log(`👥 Funcionários ativos: ${funcionarios || 0}`)
    
    // Contar empresas
    const { count: empresas } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true })
      .eq('ativa', true)
    
    console.log(`🏢 Empresas ativas: ${empresas || 0}`)
    
    // Contar holerites
    const { count: holerites } = await supabase
      .from('holerites')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📄 Holerites: ${holerites || 0}`)
    
  } catch (error) {
    console.log('❌ Erro ao verificar dados:', error.message)
  }
}

async function executarVerificacao() {
  console.log('🚀 INICIANDO VERIFICAÇÃO DO SISTEMA...\n')
  
  const conexaoOK = await verificarConexaoSupabase()
  
  if (conexaoOK) {
    await verificarTabelas()
    await verificarDados()
  }
  
  console.log('\n✨ VERIFICAÇÃO CONCLUÍDA!')
  
  if (conexaoOK) {
    console.log('\n🎯 PRÓXIMOS PASSOS:')
    console.log('1. Se tudo está OK localmente, o problema é nas variáveis do Vercel')
    console.log('2. Configure TODAS as variáveis no Vercel Dashboard')
    console.log('3. Faça redeploy')
    console.log('4. Verifique os Runtime Logs')
  } else {
    console.log('\n⚠️ PROBLEMAS ENCONTRADOS:')
    console.log('1. Verifique se o Supabase está funcionando')
    console.log('2. Confirme as variáveis no .env')
    console.log('3. Teste a conexão manualmente')
  }
}

executarVerificacao()