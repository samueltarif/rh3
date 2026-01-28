import { notificarVisualizacaoHolerite } from '../../utils/notifications'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  // Pegar ID do funcionário do query parameter (enviado pelo frontend)
  const query = getQuery(event)
  const funcionarioId = query.funcionarioId

  console.log('🔍 [MEUS-HOLERITES] === INÍCIO DA REQUISIÇÃO ===')
  console.log('🔍 [MEUS-HOLERITES] Timestamp:', new Date().toISOString())
  console.log('🔍 [MEUS-HOLERITES] Query params:', query)
  console.log('🔍 [MEUS-HOLERITES] Funcionário ID:', funcionarioId)
  console.log('🔍 [MEUS-HOLERITES] Headers da requisição:', getHeaders(event))
  console.log('🔍 [MEUS-HOLERITES] URL Supabase:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING')
  console.log('🔍 [MEUS-HOLERITES] Service Role Key:', serviceRoleKey ? 'PRESENTE' : 'MISSING')

  if (!funcionarioId) {
    console.error('❌ [MEUS-HOLERITES] Funcionário não identificado')
    throw createError({
      statusCode: 401,
      message: 'Funcionário não identificado'
    })
  }

  console.log('🔍 [MEUS-HOLERITES] Buscando holerites para funcionário ID:', funcionarioId)

  try {
    // Buscar holerites usando SERVICE ROLE KEY para bypassar RLS
    // IMPORTANTE: Apenas holerites com status "enviado" ou "visualizado" são retornados
    // Holerites com status "gerado" NÃO aparecem no perfil do funcionário
    const url = `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&status=neq.gerado&select=*&order=periodo_inicio.desc`
    console.log('🌐 [MEUS-HOLERITES] URL da requisição:', url)
    
    const headers = {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    }
    console.log('📋 [MEUS-HOLERITES] Headers:', {
      'apikey': serviceRoleKey ? 'PRESENTE' : 'MISSING',
      'Authorization': serviceRoleKey ? 'PRESENTE' : 'MISSING',
      'Content-Type': 'application/json'
    })
    
    console.log('📡 [MEUS-HOLERITES] Fazendo requisição para Supabase...')
    const response = await fetch(url, { headers })

    console.log('📊 [MEUS-HOLERITES] Status da resposta Supabase:', response.status)
    console.log('📊 [MEUS-HOLERITES] Headers da resposta Supabase:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [MEUS-HOLERITES] Erro ao buscar holerites:', errorText)
      throw new Error('Erro ao buscar holerites')
    }

    const holerites = await response.json()
    console.log('📦 [MEUS-HOLERITES] Holerites encontrados:', holerites?.length || 0)
    console.log('📦 [MEUS-HOLERITES] Primeira resposta (sample):', holerites?.[0] ? JSON.stringify(holerites[0], null, 2) : 'NENHUM')
    console.log('📦 [MEUS-HOLERITES] Status dos holerites:', holerites?.map(h => ({ id: h.id, status: h.status })) || [])
    console.log('   ℹ️ [MEUS-HOLERITES] (Holerites com status "gerado" não são exibidos)')

    // Verificar se há holerites com status "gerado" que não aparecem
    try {
      const todosHolerites = await fetch(
        `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&select=id,status&order=periodo_inicio.desc`,
        { headers }
      )
      if (todosHolerites.ok) {
        const todos = await todosHolerites.json()
        const gerados = todos.filter(h => h.status === 'gerado')
        if (gerados.length > 0) {
          console.log(`⚠️ [MEUS-HOLERITES] ${gerados.length} holerite(s) com status "gerado" não exibidos:`, gerados.map(h => h.id))
        }
        console.log(`📊 [MEUS-HOLERITES] Total no banco: ${todos.length}, Exibidos: ${holerites?.length || 0}`)
      }
    } catch (debugError) {
      console.error('⚠️ [MEUS-HOLERITES] Erro no debug de status:', debugError)
    }

    // Se há holerites, buscar dados do funcionário para notificação
    if (holerites && holerites.length > 0) {
      try {
        const funcionarioResponse = await fetch(
          `${supabaseUrl}/rest/v1/funcionarios?id=eq.${funcionarioId}&select=id,nome_completo,email_login,email_pessoal`,
          {
            headers: {
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (funcionarioResponse.ok) {
          const funcionarios = await funcionarioResponse.json()
          if (funcionarios && funcionarios.length > 0) {
            const funcionario = funcionarios[0]
            
            // Criar notificação apenas se há holerites para visualizar
            await notificarVisualizacaoHolerite(event, {
              id: funcionario.id,
              nome: funcionario.nome_completo,
              email: funcionario.email_login || funcionario.email_pessoal
            }, { 
              id: 'lista',
              periodo_inicio: new Date().toISOString(),
              periodo_fim: new Date().toISOString(),
              total_holerites: holerites.length
            })
          }
        }
      } catch (notificationError) {
        console.error('⚠️ [MEUS-HOLERITES] Erro ao criar notificação:', notificationError)
        // Não falhar a requisição por causa da notificação
      }
    }

    console.log('✅ [MEUS-HOLERITES] Retornando holerites:', holerites?.length || 0)
    console.log('🔍 [MEUS-HOLERITES] === FIM DA REQUISIÇÃO ===')
    return holerites || []
  } catch (error: any) {
    console.error('💥 [MEUS-HOLERITES] === ERRO NA REQUISIÇÃO ===')
    console.error('💥 [MEUS-HOLERITES] Mensagem:', error.message)
    console.error('💥 [MEUS-HOLERITES] Stack trace:', error.stack)
    console.error('💥 [MEUS-HOLERITES] Erro completo:', JSON.stringify(error, null, 2))
    console.error('💥 [MEUS-HOLERITES] Timestamp:', new Date().toISOString())
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao buscar holerites'
    })
  }
})
