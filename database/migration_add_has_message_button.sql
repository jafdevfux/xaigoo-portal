-- Migration: Adiciona coluna has_message_button na tabela influencers
-- Permite armazenar o resultado da verificação de perfil aberto (botão "Enviar mensagem" disponível)
-- Valores: NULL (não verificado), 0 (conta fechada/não tem msg), 1 (conta aberta/tem msg)

ALTER TABLE `influencers`
ADD COLUMN IF NOT EXISTS `has_message_button` TINYINT(1) NULL DEFAULT NULL
COMMENT '1=tem botão mensagem, 0=não tem, NULL=não verificado';

ALTER TABLE `influencers`
ADD COLUMN IF NOT EXISTS `last_visibility_check` DATETIME NULL DEFAULT NULL
COMMENT 'Última vez que a visibilidade do perfil foi verificada';