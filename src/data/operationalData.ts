export interface Step1FlowStage {
  stepNumber: string;
  title: string;
  owner: 'Marketing' | 'Vendas & Parcerias' | 'Conjunto (Mkt + Vendas)';
  objective: string;
  action: string;
  advanceCondition: string;
  warningNote?: string;
}

export const STEP1_FLOW_STAGES: Step1FlowStage[] = [
  {
    stepNumber: '01',
    title: 'Mapeamento de influenciadores e comunidades',
    owner: 'Marketing',
    objective: 'Identificar criadores de conteúdo no Instagram e grupos de Facebook que dialogam diretamente com motoristas de aplicativos.',
    action: 'Utilizar a listagem inicial já separada pela empresa e expandir a pesquisa manual de perfis do nicho de mobilidade.',
    advanceCondition: 'Perfil localizado com link ativo e temática compatível com motoristas de app.',
  },
  {
    stepNumber: '02',
    title: 'Priorização dos contatos',
    owner: 'Marketing',
    objective: 'Classificar e ordenar os perfis mapeados pelos 7 critérios manuais de qualificação sem uso de ferramentas pagas.',
    action: 'Avaliar engajamento real, adequação à imagem da marca, coerência do conteúdo e disponibilidade de canal de contato.',
    advanceCondition: 'Ficha do influenciador preenchida com status "Selecionado" e justificativa clara para abordagem.',
  },
  {
    stepNumber: '03',
    title: 'Primeiro contato pelo Direct',
    owner: 'Conjunto (Mkt + Vendas)',
    objective: 'Iniciar conversa de forma humana, curta e respeitosa, apresentando brevemente o Xaigoo sem parecer spam.',
    action: 'Enviar a mensagem inicial personalizada no Direct do Instagram (ou canal principal), perguntando apenas se aceita receber a proposta.',
    advanceCondition: 'Mensagem enviada e data do primeiro contato devidamente registrada na ficha de controle.',
    warningNote: 'Jamais enviar links longos, regras de comissão ou vídeos no primeiro contato sem permissão.',
  },
  {
    stepNumber: '04',
    title: 'Permissão para enviar a proposta',
    owner: 'Vendas & Parcerias',
    objective: 'Obter o consentimento explícito do influenciador antes de encaminhar qualquer material comercial.',
    action: 'Monitorar a caixa de entrada. Se não houver resposta, realizar acompanhamento respeitoso e limitado. Se recusar, agradecer e encerrar.',
    advanceCondition: 'Influenciador respondeu positivamente autorizando o envio do material (Status: "Autorizou o envio").',
    warningNote: 'Nunca trate o silêncio como autorização para enviar materiais repetidamente.',
  },
  {
    stepNumber: '05',
    title: 'Envio do material aprovado',
    owner: 'Vendas & Parcerias',
    objective: 'Apresentar a visão geral da parceria com clareza executiva por meio do documento oficial aprovado pela empresa.',
    action: 'Encaminhar o material de proposta oficial e perguntar se o formato faz sentido para o perfil dele.',
    advanceCondition: 'Material entregue, registrado na ficha ("Proposta enviada: Sim") e leitura/interesse sinalizado pelo parceiro.',
  },
  {
    stepNumber: '06',
    title: 'Envio dos dois vídeos explicativos (~1 minuto)',
    owner: 'Vendas & Parcerias',
    objective: 'Explicar de forma visual e separada os dois modelos de ganho disponíveis, somente após o influenciador demonstrar interesse na proposta.',
    action: 'Enviar o Vídeo 1 (Bônus de Indicação Direta do PRO - 20% único) e o Vídeo 2 (Programa de Afiliados PRO X-AI).',
    advanceCondition: 'Interesse prévio confirmado pelo influenciador e ambos os vídeos encaminhados na conversa.',
    warningNote: 'Os dois vídeos nunca devem misturar as regras da indicação direta com o programa PRO X-AI.',
  },
  {
    stepNumber: '07',
    title: 'Esclarecimento de dúvidas',
    owner: 'Vendas & Parcerias',
    objective: 'Responder com precisão técnica e transparência a todas as perguntas sobre o Xaigoo Copilot e os modelos de parceria.',
    action: 'Consultar as regras oficiais confirmadas. Caso surja dúvida sobre item não documentado, alinhar com a gestão antes de responder.',
    advanceCondition: 'Dúvidas sanadas sem promessas de renda garantida ou percentuais não verificados.',
  },
  {
    stepNumber: '08',
    title: 'Avaliação da parceria',
    owner: 'Conjunto (Mkt + Vendas)',
    objective: 'Permitir que tanto o influenciador quanto a equipe Xaigoo avaliem se há aderência para avançar à execução.',
    action: 'Analisar o interesse do parceiro, o formato de divulgação proposto (Stories, Reels, menção em grupo) e as condições autorizadas.',
    advanceCondition: 'Ambas as partes de acordo com o modelo de atuação (Status: "Parceria aprovada").',
  },
  {
    stepNumber: '09',
    title: 'Formalização e alinhamento da divulgação',
    owner: 'Vendas & Parcerias',
    objective: 'Deixar claro o escopo da divulgação, links/códigos de atribuição, regras de bonificação e cronograma de postagem.',
    action: 'Confirmar por escrito o que será divulgado, fornecer o código/link correto e alinhar diretrizes de comunicação da marca.',
    advanceCondition: 'Escopo formalizado, código de rastreamento entregue e data prevista de publicação alinhada.',
  },
  {
    stepNumber: '10',
    title: 'Publicação ou ação acordada',
    owner: 'Marketing',
    objective: 'Garantir que a divulgação do Xaigoo Copilot ocorra conforme o alinhamento e respeitando a linguagem oficial.',
    action: 'Acompanhar a postagem em tempo real, verificar se o código/link está funcional e interagir institucionalmente se aplicável.',
    advanceCondition: 'Conteúdo publicado e ativo para a audiência de motoristas (Status: "Em execução").',
  },
  {
    stepNumber: '11',
    title: 'Acompanhamento de resultados',
    owner: 'Conjunto (Mkt + Vendas)',
    objective: 'Mensurar o impacto real da ação separando métricas de vaidade (visualizações) de resultados concretos (downloads e ativações).',
    action: 'Rastrear cliques, acessos, downloads atribuíveis, cadastros no Xaigoo Copilot e eventuais conversões para planos pagos.',
    advanceCondition: 'Dados da campanha consolidados no painel de indicadores do STEP 1.',
  },
  {
    stepNumber: '12',
    title: 'Registro de aprendizados',
    owner: 'Conjunto (Mkt + Vendas)',
    objective: 'Transformar cada abordagem e campanha em inteligência prática para otimizar os próximos contatos.',
    action: 'Documentar objeções, perguntas frequentes dos motoristas, melhores formatos de mensagem e qualidade do público atraído.',
    advanceCondition: 'Feedback compartilhado entre Marketing e Vendas para ajuste contínuo do processo.',
  },
];

export interface InfluencerRecord {
  id: string;
  nameOrHandle: string;
  platform: 'Instagram' | 'Grupo de Facebook' | 'YouTube' | 'TikTok';
  link: string;
  audienceType: string;
  justification: string;
  firstContactDate: string;
  status:
    | 'A pesquisar'
    | 'Selecionado'
    | 'Primeiro contato enviado'
    | 'Aguardando resposta'
    | 'Aguardando sistema IOS'
    | 'Autorizou o envio'
    | 'Material enviado'
    | 'Em avaliação'
    | 'Parceria aprovada'
    | 'Em execução'
    | 'Encerrado'
    | 'Não interessado'
    | 'Sem resposta após acompanhamento';
  responseReceived: 'Pendente' | 'Positiva (Autorizou)' | 'Com dúvidas' | 'Recusou' | 'Sem resposta';
  proposalSent: boolean;
  videosSent: boolean;
  nextAction: string;
  notes: string;
}

export const INITIAL_INFLUENCER_RECORDS: InfluencerRecord[] = [
  {
    id: 'inf-1',
    nameOrHandle: '@exemplo_motoristasp (Modelo de Preenchimento)',
    platform: 'Instagram',
    link: 'https://instagram.com/exemplo_motoristasp',
    audienceType: 'Motoristas de aplicativo em capitais (foco em ganhos por km e segurança)',
    justification: 'Mostra rotina real de corridas, calcula custos de combustível e tem alta interação nos comentários de outros motoristas.',
    firstContactDate: '2026-10-10',
    status: 'Autorizou o envio',
    responseReceived: 'Positiva (Autorizou)',
    proposalSent: true,
    videosSent: false,
    nextAction: 'Aguardar leitura da proposta inicial para enviar os 2 vídeos de 1 minuto',
    notes: 'Respondeu rápido no Direct demonstrando curiosidade sobre a calculadora de lucro real por km do Xaigoo Copilot.',
  },
  {
    id: 'inf-2',
    nameOrHandle: 'Comunidade Motoristas de App Brasil (Exemplo)',
    platform: 'Grupo de Facebook',
    link: 'https://facebook.com/groups/exemplo-motoristas',
    audienceType: 'Motoristas iniciantes e veteranos debatendo taxas e ferramentas de apoio',
    justification: 'Grupo separado pela empresa no mapeamento inicial; moderadores ativos e pauta focada em rentabilidade.',
    firstContactDate: '2026-10-09',
    status: 'Aguardando resposta',
    responseReceived: 'Pendente',
    proposalSent: false,
    videosSent: false,
    nextAction: 'Aguardar 48h; se não responder, realizar 1 acompanhamento cordial',
    notes: 'Primeiro contato enviado ao administrador principal utilizando a mensagem curta de permissão.',
  },
  {
    id: 'inf-3',
    nameOrHandle: '@exemplo_diariodouber (Modelo de Preenchimento)',
    platform: 'Instagram',
    link: 'https://instagram.com/exemplo_diariodouber',
    audienceType: 'Motoristas profissionais full-time interessados em tecnologia e dashcam',
    justification: 'Conteúdo alinhado com os recursos de câmera em segundo plano e alerta de áreas de risco do Copilot.',
    firstContactDate: '2026-10-08',
    status: 'Em avaliação',
    responseReceived: 'Com dúvidas',
    proposalSent: true,
    videosSent: true,
    nextAction: 'Esclarecer diferença entre os 20% únicos do PRO e o programa PRO X-AI',
    notes: 'Assistiu aos dois vídeos de 1 minuto e pediu detalhes sobre como funciona o código de indicação.',
  },
];

export interface KpiMetricItem {
  id: string;
  stage: 'Volume de Atividade (Esforço)' | 'Conversão do Funil de Parcerias' | 'Resultado Real de Negócio (Atribuição)';
  name: string;
  description: string;
  currentValue: string;
  targetGoal: string;
  measurementNote: string;
}

export const INITIAL_KPI_METRICS: KpiMetricItem[] = [
  {
    id: 'kpi-1',
    stage: 'Volume de Atividade (Esforço)',
    name: '1. Influenciadores e comunidades pesquisados',
    description: 'Total de perfis no Instagram e grupos de Facebook identificados na triagem inicial.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Métrica de atividade de Marketing. Não representa parceria fechada.',
  },
  {
    id: 'kpi-2',
    stage: 'Volume de Atividade (Esforço)',
    name: '2. Perfis qualificados (Selecionados)',
    description: 'Perfis que passaram pelos 7 critérios manuais de aderência e segurança de marca.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Garante que o tempo de abordagem seja investido apenas em quem fala com motoristas.',
  },
  {
    id: 'kpi-3',
    stage: 'Volume de Atividade (Esforço)',
    name: '3. Primeiros contatos enviados',
    description: 'Mensagens iniciais enviadas no Direct solicitando permissão para apresentar a proposta.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Volume de prospecção ativa respeitando o protocolo sem spam.',
  },
  {
    id: 'kpi-4',
    stage: 'Conversão do Funil de Parcerias',
    name: '4. Respostas recebidas',
    description: 'Total de influenciadores que responderam ao contato inicial (positiva, dúvida ou recusa).',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Termômetro da qualidade da abordagem inicial no Direct.',
  },
  {
    id: 'kpi-5',
    stage: 'Conversão do Funil de Parcerias',
    name: '5. Autorizações para envio de proposta',
    description: 'Contatos que deram permissão explícita para conhecer o material comercial do Xaigoo.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Condição obrigatória para destravar o envio do documento de proposta.',
  },
  {
    id: 'kpi-6',
    stage: 'Conversão do Funil de Parcerias',
    name: '6. Propostas enviadas',
    description: 'Materiais oficiais aprovados encaminhados aos influenciadores que autorizaram.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Deve corresponder a 100% dos perfis que concederam autorização.',
  },
  {
    id: 'kpi-7',
    stage: 'Conversão do Funil de Parcerias',
    name: '7. Vídeos explicativos enviados (Vídeo 1 e Vídeo 2)',
    description: 'Perfis que demonstraram interesse após a proposta e receberam os 2 vídeos de ~1 minuto.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Indica interesse concreto em entender os modelos de bonificação.',
  },
  {
    id: 'kpi-8',
    stage: 'Conversão do Funil de Parcerias',
    name: '8. Parcerias aprovadas',
    description: 'Influenciadores alinhados e formalizados com escopo e código/link de divulgação definidos.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Marco de fechamento do trabalho de Vendas & Parcerias.',
  },
  {
    id: 'kpi-9',
    stage: 'Conversão do Funil de Parcerias',
    name: '9. Divulgações realizadas',
    description: 'Publicações, Stories, Reels ou ações em grupos efetivamente colocadas no ar.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Pontapé para geração de tráfego e testes de mensagem com o público.',
  },
  {
    id: 'kpi-10',
    stage: 'Resultado Real de Negócio (Atribuição)',
    name: '10. Cliques ou acessos rastreáveis',
    description: 'Visitas às páginas ou lojas de aplicativo originadas por links parametrizados dos parceiros.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Depende de link rastreável (UTM / link de afiliado) validado tecnicamente.',
  },
  {
    id: 'kpi-11',
    stage: 'Resultado Real de Negócio (Atribuição)',
    name: '11. Downloads atribuíveis às ações',
    description: 'Instalações do aplicativo Xaigoo Copilot originadas pelas campanhas do STEP 1.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Lembrete: visualizações ou número de seguidores não geram downloads automaticamente.',
  },
  {
    id: 'kpi-12',
    stage: 'Resultado Real de Negócio (Atribuição)',
    name: '12. Usuários cadastrados ou ativados (quando mensuráveis)',
    description: 'Motoristas que criaram conta ou utilizaram o código de indicação dentro do Xaigoo Copilot.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Mede a qualidade real da audiência trazida por cada influenciador.',
  },
  {
    id: 'kpi-13',
    stage: 'Resultado Real de Negócio (Atribuição)',
    name: '13. Conversões para planos pagos (PRO / PRO X-AI)',
    description: 'Aquisições elegíveis de planos pagos originadas pelos códigos ou links dos parceiros.',
    currentValue: '0',
    targetGoal: 'A definir pela gestão',
    measurementNote: 'Fato gerador das bonificações conforme as regras oficiais de cada programa.',
  },
];

export interface PendingGovernanceItem {
  id: string;
  topic: string;
  category: 'Estratégia & Produto' | 'Regras Comerciais & Afiliados' | 'Operação & Responsabilidades' | 'Tecnologia & Metas';
  confirmedInBriefingOrSite: string;
  pendingDecision: string;
  impactOnTeam: string;
  validationStatus: 'Pendente de validação' | 'Em revisão pela gestão' | 'Validado internamente';
}

export const INITIAL_PENDING_ITEMS: PendingGovernanceItem[] = [
  {
    id: 'pend-1',
    topic: '1. Nomes e funções oficiais dos quatro Steps (Steps 2, 3 e 4)',
    category: 'Estratégia & Produto',
    confirmedInBriefingOrSite: 'O ecossistema possui 4 Steps. O STEP 1 é oficialmente focado no Xaigoo Copilot, captação de parceiros de divulgação e aquisição de usuários.',
    pendingDecision: 'Confirmar a nomenclatura definitiva, a ordem exata e os marcos de ativação dos Steps 2, 3 e 4.',
    impactOnTeam: 'Até a confirmação, a equipe deve apresentá-los apenas como pilares de expansão do ecossistema, sem prometer datas.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-2',
    topic: '2. Status operacional detalhado de cada produto e recurso',
    category: 'Estratégia & Produto',
    confirmedInBriefingOrSite: 'O Xaigoo Copilot já é apresentado publicamente no site e Google Play com recursos para motoristas. Existe página para PRO X-AI e Insiders.',
    pendingDecision: 'Distinguir internamente quais recursos de cada plano (Gratuito, PRO, PRO X-AI) e do Xaigoo Ads/Play já estão 100% operacionais em produção hoje.',
    impactOnTeam: 'Evita confundir a existência de uma página comercial com a disponibilidade imediata de todos os recursos.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-3',
    topic: '3. Regras completas do Programa de Afiliados PRO X-AI',
    category: 'Regras Comerciais & Afiliados',
    confirmedInBriefingOrSite: 'Trata-se de um programa distinto da indicação direta do PRO, vinculado ao plano PRO X-AI (/plano-pro-xai), com oportunidades de bonificações recorrentes e rede.',
    pendingDecision: 'Documentar percentuais exatos, níveis de rede (se aplicável), requisitos de elegibilidade, prazos de saque e políticas de cancelamento.',
    impactOnTeam: 'Vendas não deve inventar percentuais ou exemplos financeiros antes de receber a tabela validada.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-4',
    topic: '4. Regras e funcionamento do Xaigoo Insiders',
    category: 'Regras Comerciais & Afiliados',
    confirmedInBriefingOrSite: 'A página oficial https://www.xaigoo.app/insiders existe e faz parte da Categoria A do portfólio.',
    pendingDecision: 'Confirmar o escopo oficial do programa Insiders, quem pode ingressar, como difere do PRO X-AI e quais são os benefícios vigentes.',
    impactOnTeam: 'Manter como "Sujeito à confirmação" durante as abordagens iniciais do STEP 1.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-5',
    topic: '5. Modelo oficial de proposta e aprovação dos 2 vídeos de 1 minuto',
    category: 'Operação & Responsabilidades',
    confirmedInBriefingOrSite: 'O fluxo exige enviar primeiro uma proposta aprovada (após permissão) e, havendo interesse, 2 vídeos de ~1 min (Vídeo 1: Indicação PRO 20%; Vídeo 2: Afiliados PRO X-AI).',
    pendingDecision: 'Disponibilizar o arquivo final da proposta (PDF/link) e os arquivos finais dos Vídeos 1 e 2 revisados pela diretoria.',
    impactOnTeam: 'Bloqueio operacional direto: os contatos no Direct só devem avançar à etapa de envio com os arquivos oficiais em mãos.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-6',
    topic: '6. Condições comerciais das parcerias com influenciadores',
    category: 'Regras Comerciais & Afiliados',
    confirmedInBriefingOrSite: 'A parceria baseia-se nos mecanismos de bonificação (Indicação Direta PRO 20% único e/ou Programa de Afiliados PRO X-AI).',
    pendingDecision: 'Definir se os influenciadores parceiros receberão acesso cortesia ao plano PRO / PRO X-AI para testar e demonstrar o app aos seguidores, e se há teto ou condição especial.',
    impactOnTeam: 'Fundamental para responder à pergunta mais comum de criadores de conteúdo durante a negociação.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-7',
    topic: '7. Divisão exata de responsáveis por cada etapa do contato',
    category: 'Operação & Responsabilidades',
    confirmedInBriefingOrSite: 'Marketing mapeia, prepara materiais e analisa canais; Vendas qualifica, conduz negociação, apresenta proposta e formaliza.',
    pendingDecision: 'Decidir nominalmente na liderança quem envia o primeiro Direct e em que momento exato o bastão passa de Marketing para Vendas.',
    impactOnTeam: 'Evita duplicidade de mensagens para o mesmo influenciador ou contatos esquecidos no Direct.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-8',
    topic: '8. Ferramentas de registro, CRM e acompanhamento',
    category: 'Tecnologia & Metas',
    confirmedInBriefingOrSite: 'O processo do STEP 1 foi desenhado para ser executado manualmente e sem depender de ferramentas pagas.',
    pendingDecision: 'Definir onde a ficha oficial de influenciadores será mantida no dia a dia pela equipe (planilha compartilhada, CRM gratuito ou exportação CSV deste portal).',
    impactOnTeam: 'Garante fonte única de verdade para o status de cada influenciador.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-9',
    topic: '9. Metas numéricas de divulgação e aquisição do STEP 1',
    category: 'Tecnologia & Metas',
    confirmedInBriefingOrSite: 'Os 13 indicadores operacionais já estão estruturados (de influenciadores pesquisados até conversões em planos pagos).',
    pendingDecision: 'Estabelecer as metas semanais/mensais de prospecção, parcerias aprovadas e downloads esperados.',
    impactOnTeam: 'Permite calibrar o ritmo diário de envios de Direct e acompanhamento.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-10',
    topic: '10. Mecanismos técnicos de rastreamento e atribuição de usuários',
    category: 'Tecnologia & Metas',
    confirmedInBriefingOrSite: 'A atribuição deve ocorrer por meio de códigos de indicação, links parametrizados ou mecanismos disponíveis no app.',
    pendingDecision: 'Validar com a equipe técnica como o código de cada influenciador será gerado e como os relatórios de downloads/ativações serão extraídos.',
    impactOnTeam: 'Indispensável para apurar resultados reais e calcular bonificações com exatidão.',
    validationStatus: 'Pendente de validação',
  },
  {
    id: 'pend-11',
    topic: '11. Regras para pagamentos, bonificações, revenue share e formalização',
    category: 'Regras Comerciais & Afiliados',
    confirmedInBriefingOrSite: 'Bônus de Indicação Direta do PRO é de 20% único na 1ª aquisição (mensal, trimestral ou anual). Estabelecimentos e parceiros URBAN/VENUE possuem modelos próprios.',
    pendingDecision: 'Confirmar prazo de liberação do crédito, forma de resgate/pagamento, retenções fiscais e termo de adesão/formalização do parceiro.',
    impactOnTeam: 'Garante segurança jurídica e transparência total no fechamento da parceria.',
    validationStatus: 'Pendente de validação',
  },
];
