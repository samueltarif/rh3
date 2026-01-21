#!/usr/bin/env node

/**
 * Script para verificar o schema atual da tabela funcionarios
 * Execute: node verificar-schema-funcionarios-atual.mjs
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

async function verificarSchema() {
  try {
    console.log('🔍 VERIFICANDO SCHEMA DA TABELA FUNCIONARIOS...\n')
    
    // Query para obter informações das colunas
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name: 'funcionarios'
    })
    
    if (error) {
      console.log('❌ Erro ao obter schema:', error.message)
      
      // Tentar método alternativo
      console.log('\n🔄 Tentando método alternativo...')
      
      const { data: sample, error: sampleError } = await supabase
        .from('funcionarios')
        .select('*')
        .limit(1)
      
      if (sampleError) {
        console.log('❌ Erro no método alternativo:', sampleError.message)
        return
      }
      
      if (sample && sample.length > 0) {
        console.log('✅ COLUNAS ENCONTRADAS (baseado em amostra):')
        Object.keys(sample[0]).forEach(coluna => {
          console.log(`  - ${coluna}`)
        })
      }
      
      return
    }
    
    console.log('✅ SCHEMA DA TABELA FUNCIONARIOS:')
    data.forEach(coluna => {
      console.log(`  - ${coluna.column_name} (${coluna.data_type})`)
    })
    
  } catch (error) {
    console.log('💥 Erro geral:', error.message)
    
    // Método de fallback - tentar buscar um registro
    try {
      console.log('\n🔄 Usando método de fallback...')
      
      const { data: funcionarios, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .limit(1)
      
      if (funcError) {
        console.log('❌ Tabela funcionarios não acessível:', funcError.message)
        return
      }
      
      if (funcionarios && funcionarios.length > 0) {
        console.log('✅ COLUNAS DA TABELA FUNCIONARIOS:')
        Object.keys(funcionarios[0]).forEach(coluna => {
          const valor = funcionarios[0][coluna]
          const tipo = typeof valor
          console.log(`  - ${coluna}: ${tipo} (valor: ${valor !== null ? String(valor).substring(0, 20) + '...' : 'null'})`)
        })
      } else {
        console.log('⚠️ Tabela funcionarios existe mas está vazia')
      }
      
    } catch (fallbackError) {
      console.log('💥 Erro no fallback:', fallbackError.message)
    }
  }
}

async function verificarRelacionamentos() {
  console.log('\n🔗 VERIFICANDO RELACIONAMENTOS...')
  
  try {
    // Testar join com empresas
    const { data: comEmpresa, error: empresaError } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome,
        empresas!inner (
          id,
          nome
        )
      `)
      .limit(1)
    
    if (empresaError) {
      console.log('❌ Relacionamento com empresas:', empresaError.message)
    } else {
      console.log('✅ Relacionamento com empresas: OK')
    }
    
    // Testar join com cargos
    const { data: comCargo, error: cargoError } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome,
        cargos (
          id,
          nome
        )
      `)
      .limit(1)
    
    if (cargoError) {
      console.log('❌ Relacionamento com cargos:', cargoError.message)
    } else {
      console.log('✅ Relacionamento com cargos: OK')
    }
    
  } catch (error) {
    console.log('💥 Erro ao verificar relacionamentos:', error.message)
  }
}

async function executarVerificacao() {
  await verificarSchema()
  await verificarRelacionamentos()
  
  console.log('\n✨ VERIFICAÇÃO CONCLUÍDA!')
}

executarVerificacao()