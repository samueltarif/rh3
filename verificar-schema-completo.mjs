#!/usr/bin/env node

/**
 * Script para verificar o schema completo das tabelas
 * Execute: node verificar-schema-completo.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis de ambiente não definidas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verificarTabela(nomeTabela) {
  try {
    console.log(`\n🔍 VERIFICANDO TABELA: ${nomeTabela.toUpperCase()}`)
    
    const { data, error } = await supabase
      .from(nomeTabela)
      .select('*')
      .limit(1)
    
    if (error) {
      console.log(`❌ Erro ao acessar ${nomeTabela}:`, error.message)
      return
    }
    
    if (data && data.length > 0) {
      console.log(`✅ COLUNAS ENCONTRADAS:`)
      Object.keys(data[0]).forEach(coluna => {
        const valor = data[0][coluna]
        const tipo = typeof valor
        const valorExibir = valor !== null ? String(valor).substring(0, 30) + '...' : 'null'
        console.log(`  - ${coluna}: ${tipo} (${valorExibir})`)
      })
    } else {
      console.log(`⚠️ Tabela ${nomeTabela} existe mas está vazia`)
    }
    
  } catch (error) {
    console.log(`💥 Erro ao verificar ${nomeTabela}:`, error.message)
  }
}

async function verificarRelacionamentos() {
  console.log('\n🔗 TESTANDO RELACIONAMENTOS...')
  
  // Testar funcionarios com empresas
  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        empresas!inner (
          id,
          nome
        )
      `)
      .limit(1)
    
    if (error) {
      console.log('❌ Relacionamento funcionarios → empresas:', error.message)
    } else {
      console.log('✅ Relacionamento funcionarios → empresas: OK')
    }
  } catch (error) {
    console.log('💥 Erro no relacionamento funcionarios → empresas:', error.message)
  }
  
  // Testar holerites com funcionarios
  try {
    const { data, error } = await supabase
      .from('holerites')
      .select(`
        id,
        funcionarios!inner (
          id,
          nome_completo
        )
      `)
      .limit(1)
    
    if (error) {
      console.log('❌ Relacionamento holerites → funcionarios:', error.message)
    } else {
      console.log('✅ Relacionamento holerites → funcionarios: OK')
    }
  } catch (error) {
    console.log('💥 Erro no relacionamento holerites → funcionarios:', error.message)
  }
}

async function executarVerificacao() {
  console.log('🚀 VERIFICANDO SCHEMA COMPLETO DAS TABELAS...\n')
  
  const tabelas = ['funcionarios', 'empresas', 'holerites', 'cargos', 'departamentos']
  
  for (const tabela of tabelas) {
    await verificarTabela(tabela)
  }
  
  await verificarRelacionamentos()
  
  console.log('\n✨ VERIFICAÇÃO CONCLUÍDA!')
  console.log('\n📋 PRÓXIMOS PASSOS:')
  console.log('1. Se as colunas estão corretas, as APIs devem funcionar')
  console.log('2. Configure as variáveis no Vercel')
  console.log('3. Faça redeploy')
  console.log('4. Teste as APIs')
}

executarVerificacao()