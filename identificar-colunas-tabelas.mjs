#!/usr/bin/env node

/**
 * Script para identificar as colunas exatas de cada tabela
 * Execute: node identificar-colunas-tabelas.mjs
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

async function identificarColunas(tabela) {
  try {
    console.log(`\n📊 TABELA: ${tabela.toUpperCase()}`)
    console.log('=' .repeat(50))
    
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .limit(1)
    
    if (error) {
      console.log(`❌ Erro: ${error.message}`)
      return
    }
    
    if (data && data.length > 0) {
      const registro = data[0]
      console.log('✅ COLUNAS DISPONÍVEIS:')
      
      Object.keys(registro).forEach((coluna, index) => {
        const valor = registro[coluna]
        const tipo = valor === null ? 'null' : typeof valor
        const valorExemplo = valor === null ? 'NULL' : 
                           typeof valor === 'string' ? `"${valor.substring(0, 20)}..."` :
                           String(valor)
        
        console.log(`  ${(index + 1).toString().padStart(2, '0')}. ${coluna.padEnd(25)} | ${tipo.padEnd(8)} | ${valorExemplo}`)
      })
      
      console.log(`\n📈 Total de colunas: ${Object.keys(registro).length}`)
      
    } else {
      console.log('⚠️ Tabela vazia - verificando estrutura...')
      
      // Tentar inserir um registro temporário para ver a estrutura
      const { error: insertError } = await supabase
        .from(tabela)
        .insert({})
        .select()
      
      if (insertError) {
        console.log('📋 Estrutura baseada no erro:')
        console.log(insertError.message)
      }
    }
    
  } catch (error) {
    console.log(`💥 Erro geral: ${error.message}`)
  }
}

async function testarQueries() {
  console.log('\n🧪 TESTANDO QUERIES DAS APIS...')
  console.log('=' .repeat(50))
  
  // Testar query de funcionários
  try {
    console.log('\n1️⃣ TESTANDO: API Funcionários')
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        ativo,
        empresas!inner (
          id,
          nome
        )
      `)
      .eq('ativo', true)
      .limit(1)
    
    if (error) {
      console.log('❌ Erro na query funcionários:', error.message)
    } else {
      console.log('✅ Query funcionários: OK')
    }
  } catch (error) {
    console.log('💥 Erro funcionários:', error.message)
  }
  
  // Testar query de holerites
  try {
    console.log('\n2️⃣ TESTANDO: API Holerites')
    const { data, error } = await supabase
      .from('holerites')
      .select(`
        id,
        created_at,
        funcionarios!inner (
          id,
          nome_completo
        )
      `)
      .limit(1)
    
    if (error) {
      console.log('❌ Erro na query holerites:', error.message)
    } else {
      console.log('✅ Query holerites: OK')
    }
  } catch (error) {
    console.log('💥 Erro holerites:', error.message)
  }
  
  // Testar query de aniversariantes
  try {
    console.log('\n3️⃣ TESTANDO: API Aniversariantes')
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        data_nascimento
      `)
      .eq('ativo', true)
      .not('data_nascimento', 'is', null)
      .limit(1)
    
    if (error) {
      console.log('❌ Erro na query aniversariantes:', error.message)
    } else {
      console.log('✅ Query aniversariantes: OK')
    }
  } catch (error) {
    console.log('💥 Erro aniversariantes:', error.message)
  }
}

async function executar() {
  console.log('🔍 IDENTIFICANDO COLUNAS DAS TABELAS...')
  
  const tabelas = ['funcionarios', 'empresas', 'holerites', 'cargos', 'departamentos']
  
  for (const tabela of tabelas) {
    await identificarColunas(tabela)
  }
  
  await testarQueries()
  
  console.log('\n✨ VERIFICAÇÃO CONCLUÍDA!')
  console.log('\n📋 PRÓXIMOS PASSOS:')
  console.log('1. Se todas as queries passaram, as APIs devem funcionar')
  console.log('2. Teste localmente: npm run dev')
  console.log('3. Configure as variáveis no Vercel')
  console.log('4. Faça redeploy')
}

executar()