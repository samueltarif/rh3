import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    console.log('[HOLERITES] Iniciando busca de holerites...')
    
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('[HOLERITES] Cliente Supabase criado')
    
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select(`
        *,
        funcionarios!inner (
          id,
          nome,
          cpf
        )
      `)
      .order('data_geracao', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('[HOLERITES] Erro na query:', error)
      throw error
    }
    
    console.log('[HOLERITES] Holerites encontrados:', holerites?.length || 0)
    
    return holerites || []
    
  } catch (error: any) {
    console.error('[HOLERITES] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar holerites: ${error.message}`
    })
  }
})
