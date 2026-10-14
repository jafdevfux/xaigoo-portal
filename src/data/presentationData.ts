export interface ChapterMeta {
  id: number;
  slug: string;
  numberLabel: string;
  title: string;
  shortTitle: string;
  category: 'Fundamentos & Ecossistema' | 'Portfólio & Produtos' | 'Execução Prioritária (STEP 1)' | 'Governança & Controle';
  summary: string;
  priorityBadge?: boolean;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    slug: 'abertura',
    numberLabel: '01',
    title: 'Abertura & Diretriz Estratégica',
    shortTitle: '01. Abertura',
    category: 'Fundamentos & Ecossistema',
    summary: 'Visão do ecossistema, estratégia de crescimento e plano operacional de Marketing e Vendas.',
  },
  {
    id: 2,
    slug: 'ecossistema',
    numberLabel: '02',
    title: 'O Ecossistema Xaigoo & Os 4 Pilares',
    shortTitle: '02. O Ecossistema',
    category: 'Fundamentos & Ecossistema',
    summary: 'Arquitetura integrada SaaS e AdTech sustentada por quatro pilares de evolução e mapa de relações.',
  },
  {
    id: 3,
    slug: 'portfolio',
    numberLabel: '03',
    title: 'Mapa do Portfólio de Produtos',
    shortTitle: '03. Mapa do Portfólio',
    category: 'Portfólio & Produtos',
    summary: 'Visão estruturada entre Produtos para Motoristas (Categoria A) e Plataforma de Publicidade (Categoria B).',
  },
  {
    id: 4,
    slug: 'copilot',
    numberLabel: '04',
    title: 'Xaigoo Copilot: O Produto Âncora',
    shortTitle: '04. Xaigoo Copilot',
    category: 'Portfólio & Produtos',
    summary: 'Copiloto inteligente para motoristas de aplicativos, comparativo de planos e foco comercial do STEP 1.',
  },
  {
    id: 5,
    slug: 'bonificacoes',
    numberLabel: '05',
    title: 'PRO, Indicação Direta e Afiliados PRO X-AI',
    shortTitle: '05. Indicação vs. PRO X-AI',
    category: 'Portfólio & Produtos',
    summary: 'Separação rigorosa entre o Bônus de Indicação Direta do PRO (20% único) e o Programa de Afiliados PRO X-AI.',
  },
  {
    id: 6,
    slug: 'ads',
    numberLabel: '06',
    title: 'Xaigoo Ads & Xaigoo Play (URBAN e VENUE)',
    shortTitle: '06. Xaigoo Ads',
    category: 'Portfólio & Produtos',
    summary: 'Plataforma de publicidade DOOH em veículos (URBAN), pontos fixos (VENUE) e gestão de telas internas.',
  },
  {
    id: 7,
    slug: 'futuro',
    numberLabel: '07',
    title: 'O Futuro do Ecossistema (Roadmap Planejado)',
    shortTitle: '07. Futuro do Ecossistema',
    category: 'Portfólio & Produtos',
    summary: 'Oportunidades futuras planejadas ou sujeitas à confirmação para expansão de utilidade e parcerias.',
  },
  {
    id: 8,
    slug: 'step1-prioridade',
    numberLabel: '08',
    title: 'Por Que o STEP 1 é a Prioridade Agora?',
    shortTitle: '08. Prioridade STEP 1',
    category: 'Execução Prioritária (STEP 1)',
    summary: 'Construção da base, aquisição de usuários no Xaigoo Copilot e fluxograma operacional de 12 etapas.',
    priorityBadge: true,
  },
  {
    id: 9,
    slug: 'influenciadores',
    numberLabel: '09',
    title: 'Perfil, Qualificação e CRM de Influenciadores',
    shortTitle: '09. Perfil & Qualificação',
    category: 'Execução Prioritária (STEP 1)',
    summary: 'Critérios manuais de seleção, funil de status e ficha interativa de registro de contatos.',
    priorityBadge: true,
  },
  {
    id: 10,
    slug: 'abordagem-direct',
    numberLabel: '10',
    title: 'Abordagem pelo Direct (Scripts e Cadência)',
    shortTitle: '10. Abordagem no Direct',
    category: 'Execução Prioritária (STEP 1)',
    summary: 'Scripts aprovados, cadência ética baseada em permissão e protocolo de acompanhamento.',
    priorityBadge: true,
  },
  {
    id: 11,
    slug: 'proposta-videos',
    numberLabel: '11',
    title: 'A Proposta Comercial e os Dois Vídeos',
    shortTitle: '11. Proposta & 2 Vídeos',
    category: 'Execução Prioritária (STEP 1)',
    summary: 'Estrutura dos vídeos de 1 minuto (Indicação PRO vs. Afiliados PRO X-AI) e checklist de conformidade.',
    priorityBadge: true,
  },
  {
    id: 12,
    slug: 'fluxo-mkt-vendas',
    numberLabel: '12',
    title: 'Fluxo Integrado: Marketing e Vendas',
    shortTitle: '12. Marketing & Vendas',
    category: 'Governança & Controle',
    summary: 'Divisão clara de responsabilidades entre Marketing, Vendas & Parcerias e Trabalho Conjunto.',
  },
  {
    id: 13,
    slug: 'indicadores',
    numberLabel: '13',
    title: 'Painel de Indicadores e Aprendizado (STEP 1)',
    shortTitle: '13. Indicadores & Metas',
    category: 'Governança & Controle',
    summary: 'Diferenciação entre métricas de atividade e resultado, com campos de metas editáveis pela gestão.',
  },
  {
    id: 14,
    slug: 'checklist',
    numberLabel: '14',
    title: 'Checklist Operacional de Consulta Rápida',
    shortTitle: '14. Checklist Operacional',
    category: 'Governança & Controle',
    summary: 'Verificação passo a passo antes do contato, após resposta, antes da bonificação e pós-divulgação.',
  },
  {
    id: 15,
    slug: 'pendencias',
    numberLabel: '15',
    title: 'Pendências para Validação da Gestão',
    shortTitle: '15. Pendências & Validação',
    category: 'Governança & Controle',
    summary: 'Matriz de governança separando fatos confirmados, dados do briefing e decisões pendentes.',
  },
];

export interface GlossaryItem {
  term: string;
  category: string;
  definition: string;
  xaigooContext: string;
}

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'SaaS (Software as a Service)',
    category: 'Modelo de Negócio',
    definition: 'Software disponibilizado como serviço via assinatura recorrente (mensal, trimestral ou anual), sem necessidade de aquisição de licença perpétua.',
    xaigooContext: 'O Xaigoo Copilot (planos PRO e PRO X-AI) e a plataforma de gerenciamento de telas internas para estabelecimentos operam no modelo SaaS.',
  },
  {
    term: 'AdTech (Advertising Technology)',
    category: 'Posicionamento',
    definition: 'Conjunto de tecnologias e plataformas digitais voltadas para planejar, gerenciar, exibir e mensurar campanhas publicitárias.',
    xaigooContext: 'Posicionamento estratégico do ecossistema Xaigoo, conectando anunciantes a telas móveis (URBAN) e fixas (VENUE) através do Xaigoo Ads e Xaigoo Play.',
  },
  {
    term: 'Revenue Share',
    category: 'Monetização',
    definition: 'Modelo comercial de compartilhamento de receita gerada por uma operação entre a plataforma e os parceiros que viabilizam a entrega.',
    xaigooContext: 'Aplicável a pontos parceiros (estabelecimentos) ou motoristas que habilitam suas telas para exibir campanhas de anunciantes externos, conforme regras oficiais.',
  },
  {
    term: 'URBAN (Publicidade em Veículos)',
    category: 'Xaigoo Ads',
    definition: 'Categoria de mídia Digital Out-of-Home (DOOH) exibida em movimento no interior de veículos de transporte por aplicativo.',
    xaigooContext: 'Anúncios exibidos em tablets com Xaigoo Play instalados nos veículos de motoristas parceiros de aplicativos de mobilidade.',
  },
  {
    term: 'VENUE (Publicidade em Pontos Fixos)',
    category: 'Xaigoo Ads',
    definition: 'Categoria de mídia exibida em telas instaladas dentro de estabelecimentos comerciais, condomínios e locais de circulação física.',
    xaigooContext: 'Telas em supermercados, atacadistas, academias, postos de combustível, pequenos comércios e elevadores residenciais habilitados na rede.',
  },
  {
    term: 'Indicação Direta (Bônus Único)',
    category: 'Aquisição',
    definition: 'Recompensa pontual concedida quando um usuário indica um novo cliente que efetua sua primeira compra elegível.',
    xaigooContext: 'No Plano PRO, gera bônus único de 20% sobre o valor da primeira aquisição elegível (mensal, trimestral ou anual) realizada pelo indicado. Não é recorrente.',
  },
  {
    term: 'Programa de Afiliados',
    category: 'Parcerias',
    definition: 'Estrutura comercial voltada a divulgadores e parceiros, com regras próprias de comissionamento e potencial recorrência.',
    xaigooContext: 'Vinculado ao plano PRO X-AI, com regras específicas na página oficial (/plano-pro-xai), distinto do bônus de indicação direta do PRO.',
  },
  {
    term: 'Aquisição de Usuários',
    category: 'Growth Marketing',
    definition: 'Processo estruturado de atrair, converter e ativar novos usuários qualificados dentro de um aplicativo ou plataforma.',
    xaigooContext: 'Foco central do STEP 1: atrair motoristas de aplicativos para baixarem e utilizarem o Xaigoo Copilot por meio de influenciadores do nicho.',
  },
];

export interface EssentialQuestion {
  id: number;
  question: string;
  shortAnswer: string;
  targetChapterId: number;
}

export const FOURTEEN_QUESTIONS = [
  {
    id: 1,
    question: 'O que é o Xaigoo?',
    shortAnswer: 'Um ecossistema tecnológico posicionado na categoria AdTech que reúne SaaS e aplicativo em uma mesma estrutura de negócios, conectando motoristas de app, anunciantes, estabelecimentos, consumidores e parceiros.',
    targetChapterId: 2,
  },
  {
    id: 2,
    question: 'Qual é a visão de longo prazo do ecossistema?',
    shortAnswer: 'Construir uma rede integrada estruturada em 4 Steps (pilares de evolução), unindo ferramentas de produtividade para motoristas, mídia digital urbana/fixa e benefícios comerciais.',
    targetChapterId: 2,
  },
  {
    id: 3,
    question: 'Quais são os produtos destinados aos motoristas?',
    shortAnswer: 'Xaigoo Copilot (Gratuito, PRO e PRO X-AI), Bônus de Indicação Direta do PRO, Programa de Afiliados PRO X-AI e o Programa Xaigoo Insiders (sujeito a confirmação das regras).',
    targetChapterId: 3,
  },
  {
    id: 4,
    question: 'Como funciona o Xaigoo Copilot?',
    shortAnswer: 'Atua como um copiloto inteligente para motoristas de app, oferecendo cálculo de lucro real por km, classificação de corridas, alerta de zonas de risco, câmera em segundo plano e auditoria por IA.',
    targetChapterId: 4,
  },
  {
    id: 5,
    question: 'Como funciona o Xaigoo Ads?',
    shortAnswer: 'É a plataforma de publicidade que permite a anunciantes e estabelecimentos planejarem campanhas exibidas em telas com Xaigoo Play, além de oferecer gestão de telas internas para comércios.',
    targetChapterId: 6,
  },
  {
    id: 6,
    question: 'O que significam as categorias de anúncios URBAN e VENUE?',
    shortAnswer: 'URBAN refere-se a anúncios exibidos em tablets dentro de veículos de motoristas parceiros. VENUE refere-se a anúncios em telas fixas em estabelecimentos comerciais, academias, mercados e elevadores.',
    targetChapterId: 6,
  },
  {
    id: 7,
    question: 'Como os produtos atuais e futuros podem se conectar?',
    shortAnswer: 'A base ativa de motoristas no Copilot cria audiência e capilaridade para o Xaigoo Ads e viabiliza futuras parcerias de alimentação, descontos em postos/academias e corridas de nicho.',
    targetChapterId: 7,
  },
  {
    id: 8,
    question: 'Por que a prioridade inicial é o STEP 1?',
    shortAnswer: 'Porque todo ecossistema precisa primeiro de base sólida e audiência qualificada. O foco agora é divulgar a marca, firmar parcerias com influenciadores e atrair usuários para o Xaigoo Copilot.',
    targetChapterId: 8,
  },
  {
    id: 9,
    question: 'Como identificar, abordar e qualificar influenciadores?',
    shortAnswer: 'Avaliando manualmente 7 critérios de aderência (fala com motoristas, engajamento real, alinhamento à marca, canal de contato) e registrando cada perfil na ficha de controle antes do envio.',
    targetChapterId: 9,
  },
  {
    id: 10,
    question: 'Qual é a sequência correta de contato, apresentação da proposta e acompanhamento?',
    shortAnswer: 'Direct curto e humano pedindo permissão → Aguardar autorização → Enviar proposta oficial → Se houver interesse, enviar os 2 vídeos de 1 min → Tirar dúvidas → Formalizar.',
    targetChapterId: 10,
  },
  {
    id: 11,
    question: 'Qual é a diferença entre o bônus de indicação direta do PRO e o programa de afiliados PRO X-AI?',
    shortAnswer: 'A Indicação Direta do PRO paga 20% uma única vez sobre a 1ª aquisição elegível (mensal, trimestral ou anual). Já o Programa de Afiliados PRO X-AI é voltado a rede e bonificações recorrentes conforme regras próprias.',
    targetChapterId: 5,
  },
  {
    id: 12,
    question: 'Como Marketing e Vendas devem trabalhar juntos?',
    shortAnswer: 'Marketing mapeia perfis, prepara materiais/vídeos e analisa canais; Vendas qualifica, conduz negociações após resposta, explica regras com precisão e formaliza parcerias.',
    targetChapterId: 12,
  },
  {
    id: 13,
    question: 'Quais informações precisam ser confirmadas antes de uma abordagem comercial?',
    shortAnswer: 'As regras oficiais vigentes do PRO X-AI e Insiders, o material de proposta aprovado, os 2 vídeos de 1 minuto validados e quem é o responsável interno pelo acompanhamento.',
    targetChapterId: 15,
  },
  {
    id: 14,
    question: 'Como conduzir cada contato para a próxima etapa?',
    shortAnswer: 'Respeitando a condição de avanço de cada fase do funil (nunca enviar mídia sem permissão e nunca prometer ganhos garantidos), registrando o status e agendando a próxima ação clara.',
    targetChapterId: 8,
  },
];

export interface PortfolioItem {
  id: string;
  name: string;
  category: 'A' | 'B';
  categoryLabel: string;
  targetAudience: string;
  mainFunction: string;
  ecosystemRelation: string;
  status: 'disponivel' | 'validacao' | 'planejado';
  statusLabel: string;
  officialUrl?: string;
  details: string[];
  commercialNote: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // CATEGORIA A — PRODUTOS PARA MOTORISTAS
  {
    id: 'copilot-app',
    name: '1. Xaigoo Copilot (Aplicativo)',
    category: 'A',
    categoryLabel: 'Categoria A · Produtos para Motoristas',
    targetAudience: 'Motoristas de aplicativos de mobilidade e motociclistas profissionais.',
    mainFunction: 'Copiloto inteligente para análise de corridas em tempo real, cálculo de lucro por km, segurança e gestão financeira.',
    ecosystemRelation: 'Produto âncora do STEP 1. Constrói a base de usuários ativos que sustenta todo o ecossistema Xaigoo.',
    status: 'disponivel',
    statusLabel: 'Disponível ou publicamente apresentado',
    officialUrl: 'https://www.xaigoo.app/',
    details: [
      'Cálculo de lucro real por quilômetro rodado em tempo real.',
      'Classificação inteligente de corridas (baixa, média ou alta rentabilidade).',
      'Destinos preferidos, alertas de zonas de risco e câmera de segurança em segundo plano.',
      'Painel de transparência financeira, controle de km e tempo online vs. ocioso.',
    ],
    commercialNote: 'Prioridade número 1 de divulgação e aquisição de usuários no STEP 1.',
  },
  {
    id: 'plano-gratuito',
    name: '2. Plano Gratuito (Entrada / Teste)',
    category: 'A',
    categoryLabel: 'Categoria A · Produtos para Motoristas',
    targetAudience: 'Novos motoristas que desejam conhecer o Xaigoo Copilot sem barreira financeira inicial.',
    mainFunction: 'Permitir a experimentação de recursos essenciais e calculadora de IA, reduzindo o atrito de adoção.',
    ecosystemRelation: 'Porta de entrada do funil de aquisição para conversão futura nos planos PRO e PRO X-AI.',
    status: 'disponivel',
    statusLabel: 'Disponível ou publicamente apresentado',
    officialUrl: 'https://www.xaigoo.app/',
    details: [
      'Apresentado publicamente na página oficial com acesso inicial e recursos de entrada.',
      'Inclui acesso ao código para participação no Bônus de Indicação Direta conforme regras do site.',
      'Limites exatos de uso diário vs. período de avaliação (7 dias) devem ser conferidos na tabela oficial.',
    ],
    commercialNote: 'Excelente isca de aquisição para campanhas com influenciadores.',
  },
  {
    id: 'plano-pro',
    name: '3. Plano PRO',
    category: 'A',
    categoryLabel: 'Categoria A · Produtos para Motoristas',
    targetAudience: 'Motoristas profissionais que buscam produtividade completa, segurança e controle financeiro diário.',
    mainFunction: 'Liberar os recursos avançados do Xaigoo Copilot em ciclos mensal, trimestral ou anual.',
    ecosystemRelation: 'Gera receita recorrente SaaS (B2C) e ativa o mecanismo de Bônus de Indicação Direta de 20%.',
    status: 'disponivel',
    statusLabel: 'Disponível ou publicamente apresentado',
    officialUrl: 'https://www.xaigoo.app/',
    details: [
      'Disponível nos ciclos de assinatura mensal, trimestral e anual.',
      'Contempla o conjunto profissional de ferramentas de análise, histórico de ofertas e câmera conforme plano.',
      'Elegível para gerar o bônus único de 20% na primeira aquisição por indicação direta.',
    ],
    commercialNote: 'Não confundir o bônus único de indicação do PRO com o programa de afiliados do PRO X-AI.',
  },
  {
    id: 'plano-pro-xai',
    name: '4. Plano PRO X-AI',
    category: 'A',
    categoryLabel: 'Categoria A · Produtos para Motoristas',
    targetAudience: 'Motoristas avançados e parceiros que desejam recursos máximos de IA e acesso ao Programa de Afiliados.',
    mainFunction: 'Unir todos os recursos PRO, inteligência artificial avançada/ilimitada e participação integrada no programa de afiliados.',
    ecosystemRelation: 'Conecta o uso avançado do produto à expansão em rede por meio de parceiros divulgadores.',
    status: 'disponivel',
    statusLabel: 'Disponível ou publicamente apresentado',
    officialUrl: 'https://www.xaigoo.app/plano-pro-xai',
    details: [
      'Inclui todos os recursos do plano PRO acrescidos das funcionalidades avançadas de IA (Xaigoo AI).',
      'Vinculado ao Programa de Afiliados PRO X-AI apresentado em página dedicada.',
      'Regras detalhadas de comissionamento e elegibilidade exigem validação prévia pelo vendedor.',
    ],
    commercialNote: 'Foco do Vídeo Explicativo 2 na abordagem de influenciadores interessados em parceria.',
  },
  {
    id: 'bonus-indicacao-pro',
    name: '5. Programa de Bonificação por Indicação Direta',
    category: 'A',
    categoryLabel: 'Categoria A · Produtos para Motoristas',
    targetAudience: 'Usuários e parceiros que indicam novos motoristas diretamente pelo seu código de indicação.',
    mainFunction: 'Bonificar em 20% sobre o valor da primeira aquisição elegível de qualquer plano PRO realizada pelo indicado.',
    ecosystemRelation: 'Mecanismo simples e direto de crescimento viral orgânico (Member-Get-Member).',
    status: 'disponivel',
    statusLabel: 'Disponível ou publicamente apresentado',
    officialUrl: 'https://www.xaigoo.app/',
    details: [
      'Percentual confirmado no briefing: 20% sobre a primeira aquisição de qualquer plano PRO.',
      'Aplica-se aos ciclos mensal, trimestral e anual.',
      'Crédito realizado uma única vez por indicação validada (NÃO é recorrente).',
    ],
    commercialNote: 'Regra confirmada pela empresa. Explicar sempre que o pagamento ocorre uma única vez na 1ª compra PRO.',
  },
  {
    id: 'afiliados-pro-xai',
    name: '6. Programa de Afiliados PRO X-AI',
    category: 'A',
    categoryLabel: 'Categoria A · Produtos para Motoristas',
    targetAudience: 'Influenciadores, criadores de conteúdo e parceiros de divulgação do ecossistema.',
    mainFunction: 'Oferecer oportunidades de bonificações recorrentes e participação em rede de afiliados conforme modelo oficial.',
    ecosystemRelation: 'Alavanca de aquisição estruturada no STEP 1 para remunerar parceiros de divulgação.',
    status: 'validacao',
    statusLabel: 'Em desenvolvimento ou sujeito a confirmação',
    officialUrl: 'https://www.xaigoo.app/plano-pro-xai',
    details: [
      'Possui página oficial publicada (/plano-pro-xai), porém regras operacionais detalhadas devem ser confirmadas.',
      'Não inventar percentuais de níveis, prazos de saque ou promessas de ganhos.',
      'Apresentar apenas com o material oficial aprovado pela empresa e o Vídeo 2.',
    ],
    commercialNote: 'O vendedor deve validar as regras vigentes com a gestão antes de detalhar condições financeiras.',
  },
  {
    id: 'xaigoo-insiders',
    name: '7. Programa Xaigoo Insiders',
    category: 'A',
    categoryLabel: 'Categoria A · Produtos para Motoristas',
    targetAudience: 'Comunidade engajada de motoristas e parceiros estratégicos.',
    mainFunction: 'Programa especial mencionado no domínio oficial (/insiders), sujeito à confirmação de suas regras e benefícios.',
    ecosystemRelation: 'Fortalecimento de comunidade e fidelização de embaixadores da marca.',
    status: 'validacao',
    statusLabel: 'Em desenvolvimento ou sujeito a confirmação',
    officialUrl: 'https://www.xaigoo.app/insiders',
    details: [
      'A URL oficial existe (xaigoo.app/insiders), mas suas regras e características oficiais dependem de validação interna.',
      'Não comercializar ou prometer benefícios do Insiders sem orientação formal da diretoria.',
    ],
    commercialNote: 'Sujeito à confirmação de regras e características oficiais pela empresa.',
  },

  // CATEGORIA B — PLATAFORMA DE PUBLICIDADE
  {
    id: 'xaigoo-ads',
    name: '1. Xaigoo Ads',
    category: 'B',
    categoryLabel: 'Categoria B · Plataforma de Publicidade',
    targetAudience: 'Anunciantes, agências, marcas locais e comerciantes.',
    mainFunction: 'Plataforma de planejamento, contratação e gerenciamento de campanhas publicitárias em telas conectadas.',
    ecosystemRelation: 'Motor de monetização AdTech (B2B) que conecta anunciantes à audiência nas ruas e estabelecimentos.',
    status: 'validacao',
    statusLabel: 'Em desenvolvimento ou sujeito a confirmação',
    details: [
      'Permite planejar campanhas segmentadas para exibição nas redes URBAN e VENUE.',
      'Integra-se aos dispositivos que executam o software reprodutor Xaigoo Play.',
      'Disponibilidade comercial em cada praça depende da rede de telas instaladas.',
    ],
    commercialNote: 'Compreender na visão do ecossistema, mas não desviar o foco operacional imediato do STEP 1.',
  },
  {
    id: 'xaigoo-play',
    name: '2. Xaigoo Play',
    category: 'B',
    categoryLabel: 'Categoria B · Plataforma de Publicidade',
    targetAudience: 'Motoristas parceiros de mídia (tablets) e estabelecimentos comerciais (TVs/monitores).',
    mainFunction: 'Software reprodutor que habilita telas móveis e fixas a receberem e exibirem campanhas do Xaigoo Ads.',
    ecosystemRelation: 'Infraestrutura tecnológica de ponta que transforma telas comuns em inventário publicitário inteligente.',
    status: 'validacao',
    statusLabel: 'Em desenvolvimento ou sujeito a confirmação',
    details: [
      'Conecta o gerenciamento de campanhas (Xaigoo Ads) à exibição física nos veículos e pontos comerciais.',
      'Suporta programação de horários, seleção de mídias e exibição de QR Codes promocionais.',
    ],
    commercialNote: 'Tecnologia habilitadora das operações URBAN e VENUE.',
  },
  {
    id: 'categoria-urban',
    name: '3. Categoria URBAN (Mídia em Veículos)',
    category: 'B',
    categoryLabel: 'Categoria B · Plataforma de Publicidade',
    targetAudience: 'Anunciantes buscando impacto para passageiros e motoristas parceiros interessados em renda extra com mídia.',
    mainFunction: 'Exibição de anúncios em tablets instalados no interior de veículos de motoristas de aplicativos.',
    ecosystemRelation: 'Une a base de motoristas do Xaigoo Copilot à rede de mídia móvel AdTech.',
    status: 'validacao',
    statusLabel: 'Em desenvolvimento ou sujeito a confirmação',
    details: [
      'O motorista atua como parceiro de exibição de mídia e pode ser remunerado conforme regras aplicáveis.',
      'Depende de disponibilidade de hardware (tablets), instalação e campanhas ativas na região.',
    ],
    commercialNote: 'Papel distinto: o parceiro URBAN disponibiliza tela móvel em seu veículo.',
  },
  {
    id: 'categoria-venue',
    name: '4. Categoria VENUE (Mídia em Pontos Fixos)',
    category: 'B',
    categoryLabel: 'Categoria B · Plataforma de Publicidade',
    targetAudience: 'Anunciantes e estabelecimentos comerciais (mercados, academias, postos, elevadores, comércios).',
    mainFunction: 'Exibição de publicidade em telas fixas instaladas em pontos comerciais e condomínios parceiros.',
    ecosystemRelation: 'Expande o alcance do Xaigoo Ads para ambientes físicos de alto fluxo e permanência.',
    status: 'validacao',
    statusLabel: 'Em desenvolvimento ou sujeito a confirmação',
    details: [
      'Ambientes possíveis: pequenos comércios, atacadistas/supermercados, academias, postos de combustível e elevadores residenciais.',
      'Disponibilidade sujeita à existência de parceiros locais, instalações e condições comerciais.',
    ],
    commercialNote: 'Importante diferenciar quem anuncia de quem cede o ponto para exibir mídia.',
  },
  {
    id: 'gestao-telas-estabelecimentos',
    name: '5. Plataforma de Campanhas para Estabelecimentos',
    category: 'B',
    categoryLabel: 'Categoria B · Plataforma de Publicidade',
    targetAudience: 'Comerciantes, redes de lojas, mercados e academias que possuem telas internas próprias.',
    mainFunction: 'Software SaaS para que o próprio estabelecimento gerencie a programação e ofertas das suas telas internas.',
    ecosystemRelation: 'Atrai estabelecimentos para dentro da plataforma Xaigoo, criando base para a rede VENUE.',
    status: 'validacao',
    statusLabel: 'Em desenvolvimento ou sujeito a confirmação',
    details: [
      'Gerenciamento de uma ou mais telas, organização de campanhas e programação de horários.',
      'Exibição de QR Codes promocionais e seleção de mídias próprias.',
      'Planos por quantidade de telas e opção personalizada para redes maiores.',
    ],
    commercialNote: 'Neste modelo, o estabelecimento é um cliente SaaS que contrata o sistema para uso próprio.',
  },
  {
    id: 'monetizacao-pontos-parceiros',
    name: '6. Monetização de Pontos Parceiros (Revenue Share)',
    category: 'B',
    categoryLabel: 'Categoria B · Plataforma de Publicidade',
    targetAudience: 'Estabelecimentos e pontos comerciais que aceitam exibir anúncios de terceiros em suas telas.',
    mainFunction: 'Permitir que o ponto parceiro habilite campanhas de anunciantes externos e receba participação na receita.',
    ecosystemRelation: 'Transforma telas internas de clientes comerciais em inventário publicitário escalável para o Xaigoo Ads.',
    status: 'planejado',
    statusLabel: 'Planejado para o futuro / Sujeito a regras oficiais',
    details: [
      'Possibilidade de habilitar espaço ocioso da tela para anunciantes externos da rede Xaigoo Ads.',
      'Participação em modelo de revenue share quando autorizado e conforme regras oficiais.',
    ],
    commercialNote: 'Não prometer percentuais de revenue share ou ganhos fixos sem tabela oficial validada.',
  },
];
