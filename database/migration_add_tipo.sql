-- =============================================================================
-- Xaigoo Pipeline — migration_add_tipo.sql
-- Adiciona coluna `tipo` (Insiders / Motorista) à tabela influencers.
--
-- COMO EXECUTAR:
-- 1. cPanel > phpMyAdmin > selecione a base `xaigoo_links-pipeline`
-- 2. Aba "SQL" > cole este conteúdo > Executar
-- 3. Verifique mensagem verde "Consulta executada com sucesso"
--
-- REIMPORTAÇÃO SEGURA: IF NOT EXISTS — reimportar não causa erro.
-- =============================================================================

SET NAMES utf8mb4;

-- Adicionar coluna tipo (Insiders / Motorista) se não existir
-- Usando procedimento para verificação segura de existência
SET @dbname = DATABASE();
SET @tablename = 'influencers';
SET @columnname = 'tipo';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1 /* coluna tipo já existe */',
  'ALTER TABLE influencers ADD COLUMN tipo VARCHAR(20) DEFAULT NULL COMMENT \'Insiders ou Motorista\' AFTER notes'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Índice para filtro rápido por tipo
SET @preparedStatement2 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_tipo'
  ) > 0,
  'SELECT 1 /* índice idx_tipo já existe */',
  'ALTER TABLE influencers ADD INDEX idx_tipo (tipo)'
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;

-- Fim de migration_add_tipo.sql
