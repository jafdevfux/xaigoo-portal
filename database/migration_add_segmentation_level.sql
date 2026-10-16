-- Adicionar coluna segmentation_level na tabela influencers
ALTER TABLE `influencers`
  ADD COLUMN `segmentation_level` TINYINT NULL
  COMMENT 'Nível de segmentação IA: 1 = Forte aderência, 2 = Neutro/Fora do nicho. NULL quando IA não aplicada';

-- Adicionar coluna tipo para categoria do lead (Insiders / Motorista)
ALTER TABLE `influencers`
  ADD COLUMN `tipo` VARCHAR(50) NULL
  COMMENT 'Categoria do lead: Insiders ou Motorista (selecionado na interface).';