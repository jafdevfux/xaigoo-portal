-- Adicionar coluna segmentation_level na tabela influencers
ALTER TABLE `influencers`
  ADD COLUMN `segmentation_level` TINYINT NULL
  COMMENT 'Nível de segmentação IA: 1 = Forte aderência, 2 = Neutro/Fora do nicho. NULL quando IA não aplicada';

-- Criar índice único para evitar duplicatas por name_or_handle
ALTER TABLE `influencers`
  ADD UNIQUE KEY `uq_influencers_name_or_handle` (`name_or_handle`);

-- Coluna para rastrear leads capturados pela extensão (session_id)
ALTER TABLE `influencers`
  ADD COLUMN `created_by` VARCHAR(128) NULL
  COMMENT 'session_id PHP da sessão que capturou o lead (extensão). NULL para leads manuais.';