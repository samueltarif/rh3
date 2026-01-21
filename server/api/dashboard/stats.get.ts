import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    console.log('[STATS] Iniciando busca de estatísticas...')
    
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('[STATS] Cliente Supabase criado')
    
    // Buscar total de funcionários
    const { data: funcionarios, error: errorFuncionarios } = await supabase
      .from('funcionarios')
      .select('id', { count: 'exact' })
      .eq('status', 'ativo')
    
    if (errorFuncionarios) {
      console.error('[STATS] Erro ao buscar funcionários:', errorFuncionarios)
      throw errorFuncionarios
    }
    
    console.log('[STATS] Funcionários encontrados:', funcionarios?.length || 0)
    
    // Buscar total de holerites do mês atual
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
    
    const { data: holerites, error: errorHolerites } = await supabase
      .from('holerites')
      .select('id', { count: 'exact' })
      .gte('data_geracao', inicioMes.toISOString())
      .lte('data_geracao', fimMes.toISOString())
    
    if (errorHolerites) {
      console.error('[STATS] Erro ao buscar holerites:', errorHolerites)
      throw errorHolerites
    }
    
    console.log('[STATS] Holerites encontrados:', holerites?.length || 0)
    
    // Buscar total de empresas
    const { data: empresas, error: errorEmpresas } = await supabase
      .from('empresas')
      .select('id', { count: 'exact' })
      .eq('ativa', true)
    
    if (errorEmpresas) {
      console.error('[STATS] Erro ao buscar empresas:', errorEmpresas)
      throw errorEmpresas
    }
    
    console.log('[STATS] Empresas encontradas:', empresas?.length || 0)
    
    const stats = {
      totalFuncionarios: funcionarios?.length || 0,
      holeritesMes: holerites?.length || 0,
      totalEmpresas: empresas?.length || 0,
      mesAtual: hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    }
    
    console.log('[STATS] Estatísticas finais:', stats)
    
    return stats
    
  } catch (error: any) {
    console.error('[STATS] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar estatísticas: ${error.message}`
    })
  }
})
