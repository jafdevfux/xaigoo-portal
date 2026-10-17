-- Migration: Adiciona tabela profile_visibilities para logs de verificação
-- Permite registrar cada verificação de perfil aberto/fechado
-- Usado pela nova API de verificação backend (sem abrir guias)

CREATE TABLE IF NOT EXISTS `profile_visibilities` (
  `id` VARCHAR(36) NOT NULL,
  `profile_url` VARCHAR(500) NOT NULL,
  `is_visible` TINYINT(1) NOT NULL DEFAULT 0,
  `checked_by` VARCHAR(36) DEFAULT NULL,
  `checked_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pending', 'completed', 'error') DEFAULT 'completed',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_profile_url` (`profile_url`(100)),
  KEY `idx_checked_at` (`checked_at`),
  KEY `idx_user_id` (`checked_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;