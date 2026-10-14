-- =============================================================================
-- Xaigoo Pipeline — pipeline-influencers.sql
-- Suba este arquivo no phpMyAdmin da HomeHost para deixar Ficha + Kanban
-- 100% dinâmicos no MySQL (criar/editar/excluir e drag Kanban).
--
-- Banco de destino: xaigoo_links-pipeline  (o mesmo do login @xaigoo.app)
-- Host na hospedagem: localhost  (DB_HOST=localhost em api/config.php)
--
-- COMO EXECUTAR NA HOSPEDAGEM (HomeHost):
-- 1. cPanel > phpMyAdmin > clique na base `xaigoo_links-pipeline` (crie antes
--    em Bancos de Dados MySQL se não existir — já está criada).
-- 2. Aba "Importar" > Escolher arquivo > selecione este
--    `pipeline-influencers.sql` (ou cole o conteúdo na aba SQL).
-- 3. Deixe Formato: SQL / utf-8 > Executar.
-- 4. Verifique mensagem verde "Importação finalizada com sucesso".
-- 5. Teste: recarregue o Pipeline no portal e crie/edite/arraste no Kanban —
--    deve persistir após F5 (MySQL, não mais mock).
--
-- REIMPORTAÇÃO SEGURA: CREATE TABLE IF NOT EXISTS + INSERT IGNORE —
-- reimportar NÃO duplica nem apaga dados existentes.
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ---------------------------------------------------------------------------
-- Tabela: influencers — 12 campos da ficha
-- Ficha: nome/@, plataforma, link, audiência, justificativa, 1º contato,
--        status (12 estágios), resposta, proposta, vídeos, próxima ação, notas
-- Kanban: coluna = status (12 colunas), drag = PATCH /api/influencers/:id/status
-- APIs: GET /api/influencers | POST | GET /:id | PUT /:id | PATCH /:id/status | DELETE /:id
-- Todos requerem login @xaigoo.app (sessão xaigoo_session).
-- Colunas MySQL espelham o tipo InfluencerRecord (src/data/operationalData.ts)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `influencers` (
  `id`                 VARCHAR(36)   NOT NULL,
  `name_or_handle`     VARCHAR(255)  NOT NULL,
  `platform`           ENUM('Instagram','Grupo de Facebook','YouTube','TikTok') DEFAULT NULL,
  `link`               TEXT          DEFAULT NULL,
  `audience_type`      TEXT          DEFAULT NULL,
  `justification`      TEXT          DEFAULT NULL,
  `first_contact_date` DATE          DEFAULT NULL,
  `status`             ENUM('A pesquisar','Selecionado','Primeiro contato enviado','Aguardando resposta','Autorizou o envio','Material enviado','Em avaliação','Parceria aprovada','Em execução','Encerrado','Não interessado','Sem resposta após acompanhamento') NOT NULL DEFAULT 'A pesquisar',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Fichas Pipeline — Ficha + Kanban (12 estágios). CRUD via /api/influencers';

-- ---------------------------------------------------------------------------
-- 2 fichas de teste — já aparecem na Ficha e no Kanban (A pesquisar | Selecionado)
-- Crie/edite/exclua ou arraste no Kanban para validar que o MySQL está vinculado.
-- ---------------------------------------------------------------------------
INSERT IGNORE INTO `influencers` (`id`, `name_or_handle`, `platform`, `link`, `audience_type`, `justification`, `first_contact_date`, `status`, `response_received`, `proposal_sent`, `videos_sent`, `next_action`, `notes`, `created_at`, `updated_at`) VALUES
('inf-1', '@carlos_motoristasp', 'Instagram', 'https://instagram.com/carlos_motoristasp', 'Motoristas de app em SP capital — foco em lucro por km e segurança', 'Perfil com rotina real de corridas, calcula custo de combustível nos Reels e alta interação nos comentários de motoristas.', '2026-10-10', 'A pesquisar', 'Pendente', 0, 0, 'Validar 7 critérios e mover para Selecionado', 'Ficha de teste 1 — aparece na coluna A pesquisar do Kanban.', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
('inf-2', '@ana_uber_oficial', 'YouTube', 'https://youtube.com/@ana_uber_oficial', 'Motoristas profissionais e iniciantes — tutoriais de app e dashcam', 'Conteúdo alinhado a câmera em segundo plano e alerta de áreas de risco do Copilot. Canal com boa retenção.', '2026-10-09', 'Selecionado', 'Pendente', 0, 0, 'Enviar primeiro contato no Direct pedindo permissão', 'Ficha de teste 2 — já na coluna Selecionado. Arraste no Kanban para testar.', '2026-10-09 12:00:00', '2026-10-09 12:00:00');

SET FOREIGN_KEY_CHECKS = 1;
-- Fim de pipeline-influencers.sql
-- Após importar, não é preciso mexer em api/config.php — DB já é localhost na hospedagem.
