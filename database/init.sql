-- =============================================================================
-- Xaigoo Pipeline — database/init.sql
-- Banco: xaigoo_links-pipeline | Host: localhost (HomeHost - PHP e MySQL no mesmo servidor)
-- Compatível: MySQL 5.7+ / MariaDB 10+
-- =============================================================================
-- COMO IMPORTAR NA HOMEHOST (cPanel > phpMyAdmin)
-- -----------------------------------------------------------------------------
-- 1. Acesse o cPanel da HomeHost > phpMyAdmin.
-- 2. No painel lateral esquerdo, clique na base `xaigoo_links-pipeline`.
--    (se não existir, crie antes em cPanel > Bancos de Dados MySQL).
-- 3. Vá na aba "Importar" (Import).
-- 4. Em "Arquivo a ser importado", clique em "Escolher arquivo" e selecione
--    este arquivo `init.sql` (enviado via FTP para `database/init.sql` ou
--    upload direto do seu computador).
-- 5. Deixe "Formato: SQL" e "Conjunto de caracteres: utf-8".
-- 6. Clique em "Executar" / "Importar".
-- 7. Verifique a mensagem verde "Importação finalizada com sucesso".
-- 8. Teste a API: GET https://seu-dominio-na-homehost/api/health
--    deve retornar {"status":"ok","db":"connected",...}.
--
-- REIMPORTAÇÃO SEGURA:
-- - Todas as tabelas usam IF NOT EXISTS e todos os inserts usam INSERT IGNORE,
--   portanto reimportar o arquivo NÃO duplica dados e NÃO apaga dados existentes.
-- - Para recriar do zero, apague as tabelas manualmente antes de reimportar.
--
-- VALIDAÇÃO DE DOMÍNIO:
-- - A tabela `users` aceita qualquer e-mail no banco; a restrição
--   "apenas @xaigoo.app" é aplicada na API (helpers/index). O comentário
--   na coluna `email` documenta a regra. Não há CHECK REGEXP aqui por
--   incompatibilidade com MySQL 5.7.
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ---------------------------------------------------------------------------
-- Tabela: users
-- Login restrito ao domínio xaigoo.app (validação na API, ver comentário)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`            VARCHAR(36)  NOT NULL,
  `name`          VARCHAR(120) NOT NULL,
  `email`         VARCHAR(255) NOT NULL COMMENT 'Apenas @xaigoo.app permitido (validação na API).',
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Usuários do painel — apenas @xaigoo.app permitido (validação na API)';

-- ---------------------------------------------------------------------------
-- Tabela: influencers
-- Enums extraídos de api/index.php (INFLUENCER_PLATFORMS / STATUSES / RESPONSES)
-- e src/data/operationalData.ts (InfluencerRecord)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `influencers` (
  `id`                 VARCHAR(36)   NOT NULL,
  `name_or_handle`     VARCHAR(255)  NOT NULL,
  `platform`           ENUM('Instagram','Grupo de Facebook','YouTube','TikTok') DEFAULT NULL,
  `link`               TEXT          DEFAULT NULL,
  `audience_type`      TEXT          DEFAULT NULL,
  `justification`      TEXT          DEFAULT NULL,
  `first_contact_date` DATE          DEFAULT NULL,
  `status`             ENUM('A pesquisar','Selecionado','Primeiro contato enviado','Aguardando resposta','Aguardando sistema IOS','Autorizou o envio','Material enviado','Em avaliação','Parceria aprovada','Em execução','Encerrado','Não interessado','Sem resposta após acompanhamento') NOT NULL DEFAULT 'A pesquisar',
  `response_received`  ENUM('Pendente','Positiva (Autorizou)','Com dúvidas','Recusou','Sem resposta') NOT NULL DEFAULT 'Pendente',
  `proposal_sent`      TINYINT(1)    NOT NULL DEFAULT 0,
  `videos_sent`        TINYINT(1)    NOT NULL DEFAULT 0,
  `next_action`        TEXT          DEFAULT NULL,
  `notes`              TEXT          DEFAULT NULL,
  `created_at`         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_updated` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Tabela: kpi_metrics
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kpi_metrics` (
  `id`               VARCHAR(36)   NOT NULL,
  `stage`            ENUM('Volume de Atividade (Esforço)','Conversão do Funil de Parcerias','Resultado Real de Negócio (Atribuição)') NOT NULL,
  `name`             VARCHAR(255)  NOT NULL,
  `description`      TEXT          DEFAULT NULL,
  `current_value`    VARCHAR(50)   NOT NULL DEFAULT '0',
  `target_goal`      VARCHAR(255)  DEFAULT NULL,
  `measurement_note` TEXT          DEFAULT NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Tabela: flow_stages
-- PK = step_number VARCHAR(5) ('01'..'12') — espelha STEP1_FLOW_STAGES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `flow_stages` (
  `step_number`      VARCHAR(5)    NOT NULL,
  `title`            VARCHAR(255)  NOT NULL,
  `owner`            ENUM('Marketing','Vendas & Parcerias','Conjunto (Mkt + Vendas)') NOT NULL,
  `objective`        TEXT          NOT NULL,
  `action`           TEXT          NOT NULL,
  `advance_condition` TEXT         NOT NULL,
  `warning_note`     TEXT          DEFAULT NULL,
  PRIMARY KEY (`step_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Tabela: pending_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pending_items` (
  `id`                           VARCHAR(36)   NOT NULL,
  `topic`                        VARCHAR(500)  NOT NULL,
  `category`                     ENUM('Estratégia & Produto','Regras Comerciais & Afiliados','Operação & Responsabilidades','Tecnologia & Metas') NOT NULL,
  `confirmed_in_briefing_or_site` TEXT         DEFAULT NULL,
  `pending_decision`             TEXT          DEFAULT NULL,
  `impact_on_team`               TEXT          DEFAULT NULL,
  `validation_status`            ENUM('Pendente de validação','Em revisão pela gestão','Validado internamente') NOT NULL DEFAULT 'Pendente de validação',
  `created_at`                   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`                   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEEDS — INSERT IGNORE (reimportação segura, sem duplicatas)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Seed OPCIONAL: usuário admin — DESCOMENTE para criar o primeiro acesso.
-- E-mail restrito a @xaigoo.app (a API rejeita outros domínios).
-- Senha: Xaigoo@2026  |  Hash: bcrypt cost 10 (gerado via PHP password_hash)
-- Para gerar outro hash: php -r "echo password_hash('SUA_SENHA', PASSWORD_BCRYPT);"
-- Hash abaixo é $2y$10$QGcOXdxRfRbocLywUvno..n3ZNNBANyO8Oh1VxR51u622v1/uFD2e
-- (compatível com password_verify em PHP 7.4+ / 8.x).
-- ---------------------------------------------------------------------------
-- INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`) VALUES
-- ('usr-admin-001', 'João Xaigoo', 'joao@xaigoo.app', '$2y$10$QGcOXdxRfRbocLywUvno..n3ZNNBANyO8Oh1VxR51u622v1/uFD2e');

-- ---------------------------------------------------------------------------
-- Seeds: influencers — 2 fichas de teste (Ficha + Kanban já nascem populados)
-- Toda mutação da ficha (criar/editar/excluir) e do Kanban (drag status) persiste neste MySQL
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO `influencers` (`id`, `name_or_handle`, `platform`, `link`, `audience_type`, `justification`, `first_contact_date`, `status`, `response_received`, `proposal_sent`, `videos_sent`, `next_action`, `notes`, `created_at`, `updated_at`) VALUES
('inf-1', '@carlos_motoristasp', 'Instagram', 'https://instagram.com/carlos_motoristasp', 'Motoristas de app em SP capital — foco em lucro por km e segurança', 'Perfil com rotina real de corridas, calcula custo de combustível nos Reels e alta interação nos comentários de motoristas.', '2026-10-10', 'A pesquisar', 'Pendente', 0, 0, 'Validar 7 critérios e mover para Selecionado', 'Ficha de teste 1 — aparece na coluna A pesquisar do Kanban.', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
('inf-2', '@ana_uber_oficial', 'YouTube', 'https://youtube.com/@ana_uber_oficial', 'Motoristas profissionais e iniciantes — tutoriais de app e dashcam', 'Conteúdo alinhado a câmera em segundo plano e alerta de áreas de risco do Copilot. Canal com boa retenção.', '2026-10-09', 'Selecionado', 'Pendente', 0, 0, 'Enviar primeiro contato no Direct pedindo permissão', 'Ficha de teste 2 — já na coluna Selecionado. Arraste no Kanban para testar.', '2026-10-09 12:00:00', '2026-10-09 12:00:00');

-- ---------------------------------------------------------------------------
-- Seeds: kpi_metrics — 13 registros (INITIAL_KPI_METRICS)
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO `kpi_metrics` (`id`, `stage`, `name`, `description`, `current_value`, `target_goal`, `measurement_note`, `created_at`, `updated_at`) VALUES
('kpi-1', 'Volume de Atividade (Esforço)', '1. Influenciadores e comunidades pesquisados', 'Total de perfis no Instagram e grupos de Facebook identificados na triagem inicial.', '0', 'A definir pela gestão', 'Métrica de atividade de Marketing. Não representa parceria fechada.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-2', 'Volume de Atividade (Esforço)', '2. Perfis qualificados (Selecionados)', 'Perfis que passaram pelos 7 critérios manuais de aderência e segurança de marca.', '0', 'A definir pela gestão', 'Garante que o tempo de abordagem seja investido apenas em quem fala com motoristas.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-3', 'Volume de Atividade (Esforço)', '3. Primeiros contatos enviados', 'Mensagens iniciais enviadas no Direct solicitando permissão para apresentar a proposta.', '0', 'A definir pela gestão', 'Volume de prospecção ativa respeitando o protocolo sem spam.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-4', 'Conversão do Funil de Parcerias', '4. Respostas recebidas', 'Total de influenciadores que responderam ao contato inicial (positiva, dúvida ou recusa).', '0', 'A definir pela gestão', 'Termômetro da qualidade da abordagem inicial no Direct.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-5', 'Conversão do Funil de Parcerias', '5. Autorizações para envio de proposta', 'Contatos que deram permissão explícita para conhecer o material comercial do Xaigoo.', '0', 'A definir pela gestão', 'Condição obrigatória para destravar o envio do documento de proposta.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-6', 'Conversão do Funil de Parcerias', '6. Propostas enviadas', 'Materiais oficiais aprovados encaminhados aos influenciadores que autorizaram.', '0', 'A definir pela gestão', 'Deve corresponder a 100% dos perfis que concederam autorização.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-7', 'Conversão do Funil de Parcerias', '7. Vídeos explicativos enviados (Vídeo 1 e Vídeo 2)', 'Perfis que demonstraram interesse após a proposta e receberam os 2 vídeos de ~1 minuto.', '0', 'A definir pela gestão', 'Indica interesse concreto em entender os modelos de bonificação.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-8', 'Conversão do Funil de Parcerias', '8. Parcerias aprovadas', 'Influenciadores alinhados e formalizados com escopo e código/link de divulgação definidos.', '0', 'A definir pela gestão', 'Marco de fechamento do trabalho de Vendas & Parcerias.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-9', 'Conversão do Funil de Parcerias', '9. Divulgações realizadas', 'Publicações, Stories, Reels ou ações em grupos efetivamente colocadas no ar.', '0', 'A definir pela gestão', 'Pontapé para geração de tráfego e testes de mensagem com o público.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-10', 'Resultado Real de Negócio (Atribuição)', '10. Cliques ou acessos rastreáveis', 'Visitas às páginas ou lojas de aplicativo originadas por links parametrizados dos parceiros.', '0', 'A definir pela gestão', 'Depende de link rastreável (UTM / link de afiliado) validado tecnicamente.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-11', 'Resultado Real de Negócio (Atribuição)', '11. Downloads atribuíveis às ações', 'Instalações do aplicativo Xaigoo Copilot originadas pelas campanhas do STEP 1.', '0', 'A definir pela gestão', 'Lembrete: visualizações ou número de seguidores não geram downloads automaticamente.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-12', 'Resultado Real de Negócio (Atribuição)', '12. Usuários cadastrados ou ativados (quando mensuráveis)', 'Motoristas que criaram conta ou utilizaram o código de indicação dentro do Xaigoo Copilot.', '0', 'A definir pela gestão', 'Mede a qualidade real da audiência trazida por cada influenciador.', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('kpi-13', 'Resultado Real de Negócio (Atribuição)', '13. Conversões para planos pagos (PRO / PRO X-AI)', 'Aquisições elegíveis de planos pagos originadas pelos códigos ou links dos parceiros.', '0', 'A definir pela gestão', 'Fato gerador das bonificações conforme as regras oficiais de cada programa.', '2026-10-13 12:00:00', '2026-10-13 12:00:00');

-- ---------------------------------------------------------------------------
-- Seeds: flow_stages — 12 registros (STEP1_FLOW_STAGES)
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO `flow_stages` (`step_number`, `title`, `owner`, `objective`, `action`, `advance_condition`, `warning_note`) VALUES
('01', 'Mapeamento de influenciadores e comunidades', 'Marketing', 'Identificar criadores de conteúdo no Instagram e grupos de Facebook que dialogam diretamente com motoristas de aplicativos.', 'Utilizar a listagem inicial já separada pela empresa e expandir a pesquisa manual de perfis do nicho de mobilidade.', 'Perfil localizado com link ativo e temática compatível com motoristas de app.', NULL),
('02', 'Priorização dos contatos', 'Marketing', 'Classificar e ordenar os perfis mapeados pelos 7 critérios manuais de qualificação sem uso de ferramentas pagas.', 'Avaliar engajamento real, adequação à imagem da marca, coerência do conteúdo e disponibilidade de canal de contato.', 'Ficha do influenciador preenchida com status \"Selecionado\" e justificativa clara para abordagem.', NULL),
('03', 'Primeiro contato pelo Direct', 'Conjunto (Mkt + Vendas)', 'Iniciar conversa de forma humana, curta e respeitosa, apresentando brevemente o Xaigoo sem parecer spam.', 'Enviar a mensagem inicial personalizada no Direct do Instagram (ou canal principal), perguntando apenas se aceita receber a proposta.', 'Mensagem enviada e data do primeiro contato devidamente registrada na ficha de controle.', 'Jamais enviar links longos, regras de comissão ou vídeos no primeiro contato sem permissão.'),
('04', 'Permissão para enviar a proposta', 'Vendas & Parcerias', 'Obter o consentimento explícito do influenciador antes de encaminhar qualquer material comercial.', 'Monitorar a caixa de entrada. Se não houver resposta, realizar acompanhamento respeitoso e limitado. Se recusar, agradecer e encerrar.', 'Influenciador respondeu positivamente autorizando o envio do material (Status: \"Autorizou o envio\").', 'Nunca trate o silêncio como autorização para enviar materiais repetidamente.'),
('05', 'Envio do material aprovado', 'Vendas & Parcerias', 'Apresentar a visão geral da parceria com clareza executiva por meio do documento oficial aprovado pela empresa.', 'Encaminhar o material de proposta oficial e perguntar se o formato faz sentido para o perfil dele.', 'Material entregue, registrado na ficha (\"Proposta enviada: Sim\") e leitura/interesse sinalizado pelo parceiro.', NULL),
('06', 'Envio dos dois vídeos explicativos (~1 minuto)', 'Vendas & Parcerias', 'Explicar de forma visual e separada os dois modelos de ganho disponíveis, somente após o influenciador demonstrar interesse na proposta.', 'Enviar o Vídeo 1 (Bônus de Indicação Direta do PRO - 20% único) e o Vídeo 2 (Programa de Afiliados PRO X-AI).', 'Interesse prévio confirmado pelo influenciador e ambos os vídeos encaminhados na conversa.', 'Os dois vídeos nunca devem misturar as regras da indicação direta com o programa PRO X-AI.'),
('07', 'Esclarecimento de dúvidas', 'Vendas & Parcerias', 'Responder com precisão técnica e transparência a todas as perguntas sobre o Xaigoo Copilot e os modelos de parceria.', 'Consultar as regras oficiais confirmadas. Caso surja dúvida sobre item não documentado, alinhar com a gestão antes de responder.', 'Dúvidas sanadas sem promessas de renda garantida ou percentuais não verificados.', NULL),
('08', 'Avaliação da parceria', 'Conjunto (Mkt + Vendas)', 'Permitir que tanto o influenciador quanto a equipe Xaigoo avaliem se há aderência para avançar à execução.', 'Analisar o interesse do parceiro, o formato de divulgação proposto (Stories, Reels, menção em grupo) e as condições autorizadas.', 'Ambas as partes de acordo com o modelo de atuação (Status: \"Parceria aprovada\").', NULL),
('09', 'Formalização e alinhamento da divulgação', 'Vendas & Parcerias', 'Deixar claro o escopo da divulgação, links/códigos de atribuição, regras de bonificação e cronograma de postagem.', 'Confirmar por escrito o que será divulgado, fornecer o código/link correto e alinhar diretrizes de comunicação da marca.', 'Escopo formalizado, código de rastreamento entregue e data prevista de publicação alinhada.', NULL),
('10', 'Publicação ou ação acordada', 'Marketing', 'Garantir que a divulgação do Xaigoo Copilot ocorra conforme o alinhamento e respeitando a linguagem oficial.', 'Acompanhar a postagem em tempo real, verificar se o código/link está funcional e interagir institucionalmente se aplicável.', 'Conteúdo publicado e ativo para a audiência de motoristas (Status: \"Em execução\").', NULL),
('11', 'Acompanhamento de resultados', 'Conjunto (Mkt + Vendas)', 'Mensurar o impacto real da ação separando métricas de vaidade (visualizações) de resultados concretos (downloads e ativações).', 'Rastrear cliques, acessos, downloads atribuíveis, cadastros no Xaigoo Copilot e eventuais conversões para planos pagos.', 'Dados da campanha consolidados no painel de indicadores do STEP 1.', NULL),
('12', 'Registro de aprendizados', 'Conjunto (Mkt + Vendas)', 'Transformar cada abordagem e campanha em inteligência prática para otimizar os próximos contatos.', 'Documentar objeções, perguntas frequentes dos motoristas, melhores formatos de mensagem e qualidade do público atraído.', 'Feedback compartilhado entre Marketing e Vendas para ajuste contínuo do processo.', NULL);

-- ---------------------------------------------------------------------------
-- Seeds: pending_items — 11 registros (INITIAL_PENDING_ITEMS)
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO `pending_items` (`id`, `topic`, `category`, `confirmed_in_briefing_or_site`, `pending_decision`, `impact_on_team`, `validation_status`, `created_at`, `updated_at`) VALUES
('pend-1', '1. Nomes e funções oficiais dos quatro Steps (Steps 2, 3 e 4)', 'Estratégia & Produto', 'O ecossistema possui 4 Steps. O STEP 1 é oficialmente focado no Xaigoo Copilot, captação de parceiros de divulgação e aquisição de usuários.', 'Confirmar a nomenclatura definitiva, a ordem exata e os marcos de ativação dos Steps 2, 3 e 4.', 'Até a confirmação, a equipe deve apresentá-los apenas como pilares de expansão do ecossistema, sem prometer datas.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-2', '2. Status operacional detalhado de cada produto e recurso', 'Estratégia & Produto', 'O Xaigoo Copilot já é apresentado publicamente no site e Google Play com recursos para motoristas. Existe página para PRO X-AI e Insiders.', 'Distinguir internamente quais recursos de cada plano (Gratuito, PRO, PRO X-AI) e do Xaigoo Ads/Play já estão 100% operacionais em produção hoje.', 'Evita confundir a existência de uma página comercial com a disponibilidade imediata de todos os recursos.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-3', '3. Regras completas do Programa de Afiliados PRO X-AI', 'Regras Comerciais & Afiliados', 'Trata-se de um programa distinto da indicação direta do PRO, vinculado ao plano PRO X-AI (/plano-pro-xai), com oportunidades de bonificações recorrentes e rede.', 'Documentar percentuais exatos, níveis de rede (se aplicável), requisitos de elegibilidade, prazos de saque e políticas de cancelamento.', 'Vendas não deve inventar percentuais ou exemplos financeiros antes de receber a tabela validada.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-4', '4. Regras e funcionamento do Xaigoo Insiders', 'Regras Comerciais & Afiliados', 'A página oficial https://www.xaigoo.app/insiders existe e faz parte da Categoria A do portfólio.', 'Confirmar o escopo oficial do programa Insiders, quem pode ingressar, como difere do PRO X-AI e quais são os benefícios vigentes.', 'Manter como \"Sujeito à confirmação\" durante as abordagens iniciais do STEP 1.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-5', '5. Modelo oficial de proposta e aprovação dos 2 vídeos de 1 minuto', 'Operação & Responsabilidades', 'O fluxo exige enviar primeiro uma proposta aprovada (após permissão) e, havendo interesse, 2 vídeos de ~1 min (Vídeo 1: Indicação PRO 20%; Vídeo 2: Afiliados PRO X-AI).', 'Disponibilizar o arquivo final da proposta (PDF/link) e os arquivos finais dos Vídeos 1 e 2 revisados pela diretoria.', 'Bloqueio operacional direto: os contatos no Direct só devem avançar à etapa de envio com os arquivos oficiais em mãos.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-6', '6. Condições comerciais das parcerias com influenciadores', 'Regras Comerciais & Afiliados', 'A parceria baseia-se nos mecanismos de bonificação (Indicação Direta PRO 20% único e/ou Programa de Afiliados PRO X-AI).', 'Definir se os influenciadores parceiros receberão acesso cortesia ao plano PRO / PRO X-AI para testar e demonstrar o app aos seguidores, e se há teto ou condição especial.', 'Fundamental para responder à pergunta mais comum de criadores de conteúdo durante a negociação.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-7', '7. Divisão exata de responsáveis por cada etapa do contato', 'Operação & Responsabilidades', 'Marketing mapeia, prepara materiais e analisa canais; Vendas qualifica, conduz negociação, apresenta proposta e formaliza.', 'Decidir nominalmente na liderança quem envia o primeiro Direct e em que momento exato o bastão passa de Marketing para Vendas.', 'Evita duplicidade de mensagens para o mesmo influenciador ou contatos esquecidos no Direct.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-8', '8. Ferramentas de registro, CRM e acompanhamento', 'Tecnologia & Metas', 'O processo do STEP 1 foi desenhado para ser executado manualmente e sem depender de ferramentas pagas.', 'Definir onde a ficha oficial de influenciadores será mantida no dia a dia pela equipe (planilha compartilhada, CRM gratuito ou exportação CSV deste portal).', 'Garante fonte única de verdade para o status de cada influenciador.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-9', '9. Metas numéricas de divulgação e aquisição do STEP 1', 'Tecnologia & Metas', 'Os 13 indicadores operacionais já estão estruturados (de influenciadores pesquisados até conversões em planos pagos).', 'Estabelecer as metas semanais/mensais de prospecção, parcerias aprovadas e downloads esperados.', 'Permite calibrar o ritmo diário de envios de Direct e acompanhamento.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-10', '10. Mecanismos técnicos de rastreamento e atribuição de usuários', 'Tecnologia & Metas', 'A atribuição deve ocorrer por meio de códigos de indicação, links parametrizados ou mecanismos disponíveis no app.', 'Validar com a equipe técnica como o código de cada influenciador será gerado e como os relatórios de downloads/ativações serão extraídos.', 'Indispensável para apurar resultados reais e calcular bonificações com exatidão.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00'),
('pend-11', '11. Regras para pagamentos, bonificações, revenue share e formalização', 'Regras Comerciais & Afiliados', 'Bônus de Indicação Direta do PRO é de 20% único na 1ª aquisição (mensal, trimestral ou anual). Estabelecimentos e parceiros URBAN/VENUE possuem modelos próprios.', 'Confirmar prazo de liberação do crédito, forma de resgate/pagamento, retenções fiscais e termo de adesão/formalização do parceiro.', 'Garante segurança jurídica e transparência total no fechamento da parceria.', 'Pendente de validação', '2026-10-13 12:00:00', '2026-10-13 12:00:00');

SET FOREIGN_KEY_CHECKS = 1;
-- Fim de database/init.sql
