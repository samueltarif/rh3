import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    console.log('[FUNCIONARIOS] Iniciando busca de funcionários...')
    
    const supabase = serverSupabaseServiceRole(event)
    const query = getQuery(event)
    const empresaId = query.empresa
    const departamentoId = query.departamento
    const cargoId = query.cargo
    
    console.log('[FUNCIONARIOS] Cliente Supabase criado')
    console.log('[FUNCIONARIOS] Filtros:', { empresaId, departamentoId, cargoId })
    
    let queryBuilder = supabase
      .from('funcionarios')
      .select(`
        *,
        empresas!inner (
          id,
          nome,
          nome_fantasia
        ),
        cargos (
          id,
          nome
        ),
        departamentos (
          id,
          nome
        )
      `)
      .eq('status', 'ativo')
    
    // Aplicar filtros se fornecidos
    if (empresaId) {
      queryBuilder = queryBuilder.eq('empresa_id', empresaId)
    }
    
    if (departamentoId) {
      queryBuilder = queryBuilder.eq('departamento_id', departamentoId)
    }
    
    if (cargoId) {
      queryBuilder = queryBuilder.eq('cargo_id', cargoId)
    }
    
    const { data: funcionarios, error } = await queryBuilder.order('nome_completo')
    
    if (error) {
      console.error('[FUNCIONARIOS] Erro na query:', error)
      throw error
    }
    
    console.log('[FUNCIONARIOS] Funcionários encontrados:', funcionarios?.length || 0)
    
    return funcionarios || []
    
  } catch (error: any) {
    console.error('[FUNCIONARIOS] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar funcionários: ${error.message}`
    })
  }
})
