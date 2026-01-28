/**
 * Utilitário para criar notificações automáticas do sistema
 */

interface NotificationData {
  titulo: string
  mensagem: string
  tipo?: 'info' | 'success' | 'warning' | 'error'
  origem?: string
  dados?: any
  importante?: boolean
  acao_url?: string
}

/**
 * Cria uma notificação automática para o admin
 */
export async function criarNotificacaoAdmin(
  event: any,
  notificationData: NotificationData
) {
  try {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

    const dadosNotificacao = {
      titulo: notificationData.titulo,
      mensagem: notificationData.mensagem,
      tipo: notificationData.tipo || 'info',
      origem: notificationData.origem || 'sistema',
      dados: notificationData.dados || {},
      importante: notificationData.importante || false,
      acao_url: notificationData.acao_url || null,
      data_expiracao: null
    }

    console.log('📬 [NOTIFICACAO-AUTO] Criando notificação:', dadosNotificacao.titulo)

    const response = await fetch(`${supabaseUrl}/rest/v1/notificacoes`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(dadosNotificacao)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro ao criar notificação automática:', errorText)
      return false
    }

    const notificacao = await response.json()
    console.log('✅ Notificação automática criada:', notificacao[0]?.id)
    return true

  } catch (error: any) {
    console.error('💥 Erro ao criar notificação automática:', error.message)
    return false
  }
}

/**
 * Cria notificação para login de funcionário
 */
export async function notificarLogin(event: any, funcionario: any, clientIP: string) {
  const agora = new Date().toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  await criarNotificacaoAdmin(event, {
    titulo: '🔐 Login no Sistema',
    mensagem: `${funcionario.nome} fez login no sistema em ${agora}`,
    tipo: 'info',
    origem: 'login',
    dados: {
      funcionario_id: funcionario.id,
      funcionario_nome: funcionario.nome,
      funcionario_email: funcionario.email,
      tipo_acesso: funcionario.tipo,
      ip: clientIP,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Cria notificação para alteração de dados
 */
export async function notificarAlteracaoDados(
  event: any, 
  funcionario: any, 
  camposAlterados: string[],
  tipoAlteracao: 'proprio' | 'admin' = 'proprio'
) {
  const agora = new Date().toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const camposTexto = camposAlterados.join(', ')
  const acao = tipoAlteracao === 'proprio' ? 'alterou seus próprios dados' : 'teve seus dados alterados pelo admin'
  
  await criarNotificacaoAdmin(event, {
    titulo: '✏️ Alteração de Dados',
    mensagem: `${funcionario.nome} ${acao} em ${agora}. Campos: ${camposTexto}`,
    tipo: 'warning',
    origem: 'alteracao_dados',
    importante: true,
    dados: {
      funcionario_id: funcionario.id,
      funcionario_nome: funcionario.nome,
      campos_alterados: camposAlterados,
      tipo_alteracao: tipoAlteracao,
      timestamp: new Date().toISOString()
    },
    acao_url: `/admin/funcionarios`
  })
}

/**
 * Cria notificação para criação de funcionário
 */
export async function notificarCriacaoFuncionario(event: any, funcionario: any, responsavel: any) {
  const agora = new Date().toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  await criarNotificacaoAdmin(event, {
    titulo: '👤 Novo Funcionário',
    mensagem: `Funcionário ${funcionario.nome_completo} foi cadastrado por ${responsavel.nome} em ${agora}`,
    tipo: 'success',
    origem: 'novo_funcionario',
    importante: true,
    dados: {
      funcionario_id: funcionario.id,
      funcionario_nome: funcionario.nome_completo,
      funcionario_email: funcionario.email_login,
      responsavel_id: responsavel.id,
      responsavel_nome: responsavel.nome,
      timestamp: new Date().toISOString()
    },
    acao_url: `/admin/funcionarios`
  })
}

/**
 * Cria notificação para geração de holerites
 */
export async function notificarGeracaoHolerites(
  event: any, 
  tipo: 'mensal' | 'adiantamento',
  totalGerados: number,
  responsavel?: any
) {
  const agora = new Date().toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const tipoTexto = tipo === 'mensal' ? 'Folha Mensal' : 'Adiantamento Salarial'
  const responsavelTexto = responsavel ? ` por ${responsavel.nome}` : ' automaticamente'

  await criarNotificacaoAdmin(event, {
    titulo: '💰 Holerites Gerados',
    mensagem: `${tipoTexto}: ${totalGerados} holerite(s) gerado(s)${responsavelTexto} em ${agora}`,
    tipo: 'success',
    origem: 'geracao_holerites',
    importante: true,
    dados: {
      tipo_holerite: tipo,
      total_gerados: totalGerados,
      responsavel_id: responsavel?.id,
      responsavel_nome: responsavel?.nome,
      timestamp: new Date().toISOString()
    },
    acao_url: `/admin/holerites`
  })
}

/**
 * Cria notificação para erros críticos
 */
export async function notificarErroCritico(event: any, erro: string, contexto: any = {}) {
  const agora = new Date().toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  await criarNotificacaoAdmin(event, {
    titulo: '🚨 Erro Crítico',
    mensagem: `Erro crítico detectado em ${agora}: ${erro}`,
    tipo: 'error',
    origem: 'erro_sistema',
    importante: true,
    dados: {
      erro_mensagem: erro,
      contexto: contexto,
      timestamp: new Date().toISOString()
    }
  })
}