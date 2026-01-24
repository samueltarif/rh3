// API para listar departamentos
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)

    // Buscar departamentos com contagem de funcionários
    const { data: departamentos, error } = await supabase
      .from('departamentos')
      .select(`
        *,
        funcionarios_count:funcionarios(count)
      `)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar departamentos:', error)
      throw error
    }

    // Transformar os dados para incluir a contagem
    const departamentosComContagem = departamentos?.map(dept => ({
      ...dept,
      funcionarios_count: dept.funcionarios_count?.[0]?.count || 0
    })) || []

    return {
      success: true,
      data: departamentosComContagem
    }
  } catch (error: any) {
    console.error('Erro ao buscar departamentos:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar departamentos'
    })
  }
})
