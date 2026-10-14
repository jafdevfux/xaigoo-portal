import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Monitor,
  Smartphone,
  Building2,
  Megaphone,
  Car,
  Compass,
  ShieldAlert,
} from 'lucide-react';

interface ChapterProps {
  onNavigateChapter: (chapterId: number) => void;
}

export const Chapter4Copilot: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const features = [
    {
      title: '1. Cálculo de lucro real por KM',
      desc: 'Avaliação em tempo real de distância e custos operacionais para determinar o lucro exato por quilômetro rodado antes de aceitar a corrida.',
      status: 'Confirmado nas fontes oficiais',
    },
    {
      title: '2. Análise e classificação inteligente de corridas',
      desc: 'Classifica automaticamente as ofertas de viagens por rentabilidade (baixa, média ou alta) com base nas metas definidas pelo motorista.',
      status: 'Confirmado nas fontes oficiais',
    },
    {
      title: '3. Registro e histórico de ofertas',
      desc: 'Armazenamento das ofertas recebidas e histórico detalhado para auditoria financeira e tomada de decisão.',
      status: 'Confirmado no briefing / site',
    },
    {
      title: '4. Acompanhamento de quilometragem e tempo de conexão',
      desc: 'Rastreador de produtividade que monitora a eficiência da jornada diferenciando tempo em corrida ativa de tempo ocioso conectado.',
      status: 'Confirmado nas fontes oficiais',
    },
    {
      title: '5. Recursos de câmera em segundo plano e armazenamento',
      desc: 'Gravação discreta de segurança (Dashcam oculta) que opera em segundo plano sem interromper o GPS, conforme as regras e limites de cada plano.',
      status: 'Confirmado nas fontes oficiais (conforme o plano)',
    },
    {
      title: '6. Alertas de zonas de risco e Destinos Preferidos',
      desc: 'Monitoramento comunitário de áreas perigosas e configuração de destinos preferidos para aceitar corridas na direção desejada.',
      status: 'Confirmado nas fontes oficiais',
    },
    {
      title: '7. Ferramentas de acompanhamento financeiro',
      desc: 'Painel de transparência financeira com visão de rentabilidade diária, receitas, despesas e lucro líquido.',
      status: 'Confirmado nas fontes oficiais',
    },
    {
      title: '8. Auditoria de desempenho e Assistente por IA (Xaigoo AI)',
      desc: 'Inteligência artificial que avalia métricas de trabalho e sugere melhorias práticas, variando de calculadora de IA a recursos ilimitados no PRO X-AI.',
      status: 'Confirmado nas fontes oficiais (conforme o plano)',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 04 · Produto Âncora do STEP 1
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Xaigoo Copilot: O Copiloto Inteligente do Motorista
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          <strong>Público principal:</strong> motoristas de aplicativos de mobilidade e motociclistas profissionais. <br />
          <strong>Objetivo central:</strong> funcionar como um copiloto auxiliar no dia a dia, oferecendo ferramentas para análise rápida de corridas, acompanhamento de desempenho, proteção por câmera e controle real de ganhos.
        </p>
      </section>

      {/* Strategic Sales Message Callout */}
      <section className="bg-slate-950 text-white rounded-xl p-6 lg:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-violet-300">
          <span>DIRETRIZ OBRIGATÓRIA PARA MARKETING E VENDAS</span>
          <span>FOCO COMERCIAL</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-white font-display">
          O Xaigoo Copilot é o produto prioritário do STEP 1.
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          A primeira tarefa de Marketing é ampliar o conhecimento sobre o aplicativo e atrair usuários qualificados. <strong>O objetivo inicial não é tentar vender todo o ecossistema de uma só vez.</strong> É apresentar o produto certo, para o público certo, preparando a base de usuários e parceiros para as próximas etapas.
        </p>
      </section>

      {/* Confirmed Features Grid */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Recursos Divulgados do Xaigoo Copilot
          </h2>
          <p className="text-sm text-slate-600">
            Funcionalidades identificadas nas páginas oficiais e no briefing estratégico para argumentação clara com parceiros:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, idx) => (
            <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-medium text-emerald-700">
                {feat.status}
              </div>
              <h3 className="text-sm font-bold text-slate-950 font-display">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Plan Comparison Table: Free vs PRO vs PRO X-AI */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Comparativo de Planos: Gratuito vs. PRO vs. PRO X-AI
            </h2>
            <p className="text-sm text-slate-600">
              Cada plano atende a um estágio do motorista e possui regras comerciais distintas. Nunca presuma que os recursos ou bonificações sejam idênticos entre eles.
            </p>
          </div>
          <a
            href="https://www.xaigoo.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 shrink-0"
          >
            <span>Conferir tabela vigente em xaigoo.app</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-900">
                <th className="py-3.5 px-4">Critério / Dimensão</th>
                <th className="py-3.5 px-4">Plano GRATUITO</th>
                <th className="py-3.5 px-4 bg-violet-50/60 text-violet-950">Plano PRO</th>
                <th className="py-3.5 px-4">Plano PRO X-AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Público-Alvo</td>
                <td className="py-3.5 px-4">Motoristas iniciando no app ou em período de avaliação inicial</td>
                <td className="py-3.5 px-4 bg-violet-50/30 font-medium text-slate-900">Motoristas profissionais focados em produtividade e controle diário</td>
                <td className="py-3.5 px-4">Motoristas avançados e parceiros que desejam IA completa e rede de afiliados</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Recursos Principais Divulgados</td>
                <td className="py-3.5 px-4">Acesso inicial / Calculadora de IA e recursos de entrada conforme site oficial</td>
                <td className="py-3.5 px-4 bg-violet-50/30">Todos os recursos do Gratuito + suite PRO (análise de corridas, câmera/armazenamento conforme plano, gestão financeira)</td>
                <td className="py-3.5 px-4">Todos os recursos do PRO + Xaigoo AI avançada/ilimitada</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Ciclos de Contratação</td>
                <td className="py-3.5 px-4">Acesso gratuito / Avaliação (validar limites diários vigentes)</td>
                <td className="py-3.5 px-4 bg-violet-50/30 font-mono">Mensal · Trimestral · Anual</td>
                <td className="py-3.5 px-4">Conforme condições da página oficial (/plano-pro-xai)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Mecanismo de Indicação / Parceria</td>
                <td className="py-3.5 px-4">Acesso ao código de indicação direta (conforme regras oficiais do site)</td>
                <td className="py-3.5 px-4 bg-violet-50/30 font-semibold text-emerald-800">
                  Bônus de Indicação Direta: 20% único sobre a 1ª aquisição elegível do PRO (mensal, trimestral ou anual)
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-800">
                  Programa de Afiliados PRO X-AI (regras próprias de rede e recorrência — validar detalhes)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Valores e Limites Exatos de Armazenamento</td>
                <td className="py-3.5 px-4 text-amber-800">Validar com a empresa / site oficial</td>
                <td className="py-3.5 px-4 bg-violet-50/30 text-amber-800">Validar tabela de preços vigente no site oficial</td>
                <td className="py-3.5 px-4 text-amber-800">Validar em xaigoo.app/plano-pro-xai</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export const Chapter5Bonuses: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 05 · Regras de Bonificação e Parceria
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          PRO (Indicação Direta) vs. Programa de Afiliados PRO X-AI
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Um dos pontos mais críticos para Marketing e Vendas é <strong>jamais confundir</strong> os dois mecanismos de bonificação do Xaigoo. Eles possuem naturezas, regras e objetivos completamente diferentes, e são explicados em dois vídeos separados na etapa de abordagem.
        </p>
      </section>

      {/* Side-by-Side Comparison of the 2 Mechanisms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MECANISMO A */}
        <section className="bg-white border-2 border-emerald-600 rounded-xl p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-emerald-800">
              <span>MECANISMO A · REGRA CONFIRMADA PELA EMPRESA</span>
              <span>VÍDEO EXPLICATIVO 1</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-950 font-display">
              Bônus de Indicação Direta do PRO (20% Único)
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Ao indicar um amigo para o Xaigoo usando seu código de indicação, o participante recebe um <strong>bônus de 20% sobre o valor da primeira aquisição de qualquer plano PRO</strong> realizada pelo indicado.
            </p>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-2 text-xs text-slate-800">
              <div className="font-bold text-emerald-950">Regras Oficiais Confirmadas no Briefing:</div>
              <ul className="space-y-1.5">
                <li>• <strong>Percentual:</strong> <span className="font-mono font-bold">20%</span> sobre o valor da primeira aquisição elegível do plano PRO.</li>
                <li>• <strong>Ciclos contemplados:</strong> Aplica-se aos ciclos <strong>mensal, trimestral e anual</strong>.</li>
                <li>• <strong>Frequência:</strong> Creditado <strong>uma única vez por indicação</strong>, exclusivamente na primeira aquisição elegível do plano PRO.</li>
                <li>• <strong>Atenção:</strong> <span className="underline font-semibold">NÃO apresente esse bônus como recorrente</span> nas renovações seguintes.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            Nota: O Programa de Afiliados PRO X-AI possui regras próprias e não deve ser misturado com este bônus único.
          </div>
        </section>

        {/* MECANISMO B */}
        <section className="bg-white border-2 border-violet-600 rounded-xl p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-violet-800">
              <span>MECANISMO B · REGRAS PRÓPRIAS EM REDE</span>
              <span>VÍDEO EXPLICATIVO 2</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-950 font-display">
              Programa de Afiliados PRO X-AI
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Trata-se de um programa diferente, relacionado ao plano <strong>PRO X-AI</strong> e voltado a oportunidades de bonificações recorrentes e participação em uma rede de afiliados, conforme o modelo e as regras oficiais.
            </p>

            <div className="p-4 bg-violet-50/70 border border-violet-200 rounded-lg space-y-2 text-xs text-slate-800">
              <div className="font-bold text-violet-950">Diretrizes de Segurança para o Vendedor:</div>
              <ul className="space-y-1.5">
                <li>• É uma oportunidade relevante para <strong>parceiros de divulgação e influenciadores</strong> que desejam avaliar uma parceria estruturada.</li>
                <li>• Possui página dedicada: <a href="https://www.xaigoo.app/plano-pro-xai" target="_blank" rel="noopener noreferrer" className="font-semibold underline text-violet-800">xaigoo.app/plano-pro-xai</a>.</li>
                <li>• <strong>Proibição estrita:</strong> Não invente percentuais, níveis de rede, condições de pagamento ou exemplos de ganhos que não estejam formalmente confirmados pela empresa.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-amber-800 font-semibold">
              Detalhes operacionais sujeitos a confirmação interna
            </span>
            <a
              href="https://www.xaigoo.app/plano-pro-xai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
            >
              <span>Abrir página oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>

      {/* Flowchart for Mechanism A (Direct Referral PRO 20%) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Fluxograma Oficial: Bônus de Indicação Direta do PRO (Mecanismo A)
          </h2>
          <p className="text-sm text-slate-600">
            Sequência exata de funcionamento da indicação direta (pagamento único de 20% na primeira compra elegível):
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              step: 'Etapa 01',
              title: 'Código de Indicação',
              desc: 'Participante recebe ou acessa seu código único de indicação no Xaigoo.',
            },
            {
              step: 'Etapa 02',
              title: 'Compartilhamento',
              desc: 'Compartilha o código diretamente com amigos, colegas motoristas ou seguidores.',
            },
            {
              step: 'Etapa 03',
              title: '1ª Aquisição do PRO',
              desc: 'Novo usuário realiza a primeira aquisição elegível do plano PRO (mensal, trimestral ou anual).',
            },
            {
              step: 'Etapa 04',
              title: 'Validação',
              desc: 'A indicação e a transação são validadas pelo sistema conforme as regras oficiais.',
            },
            {
              step: 'Etapa 05',
              title: 'Cálculo de 20%',
              desc: 'Apuração do bônus único de 20% sobre o valor elegível daquela primeira aquisição.',
            },
            {
              step: 'Etapa 06',
              title: 'Crédito do Bônus',
              desc: 'Crédito disponibilizado uma única vez por indicação, conforme regras oficiais.',
            },
          ].map((node, index) => (
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold text-emerald-700">{node.step}</div>
                <h3 className="text-sm font-bold text-slate-950 font-display">{node.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{node.desc}</p>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {index < 5 ? '→ Avança para próxima etapa' : '✓ Fim do ciclo único'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Required Table: "O que o vendedor precisa saber antes de explicar o programa" (PRO X-AI) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
            Quadro Obrigatório de Verificação Prévia
          </p>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            O que o vendedor precisa saber antes de explicar o Programa de Afiliados PRO X-AI
          </h2>
          <p className="text-sm text-slate-600">
            Antes de apresentar o Mecanismo B (PRO X-AI) em detalhes para qualquer influenciador ou parceiro, confira os 8 campos abaixo. Os itens marcados como <strong>“Validar com a empresa”</strong> não devem ser presumidos:
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-900">
                <th className="py-3.5 px-4 w-1/4">Campo de Verificação</th>
                <th className="py-3.5 px-4 w-1/2">Informação Documentada / Orientação Atual</th>
                <th className="py-3.5 px-4 w-1/4">Status de Confirmação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">1. Produto ou plano necessário</td>
                <td className="py-3.5 px-4">
                  Relacionado ao <strong>Plano PRO X-AI</strong>. Verificar se existe condição especial ou cortesia para influenciadores parceiros selecionados no STEP 1.
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-800">Validar com a empresa</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">2. Quem pode participar</td>
                <td className="py-3.5 px-4">
                  Assinantes do plano PRO X-AI e parceiros de divulgação elegíveis conforme os termos do programa.
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-800">Validar com a empresa</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">3. Ações que geram bonificação</td>
                <td className="py-3.5 px-4">
                  Indicação e manutenção de assinantes ativos na rede conforme regras de atribuição do programa PRO X-AI (nunca por meras visualizações ou cliques).
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-800">Validar com a empresa</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">4. Natureza da bonificação</td>
                <td className="py-3.5 px-4">
                  Oportunidades de bonificações recorrentes e participação em rede de afiliados (distinto do bônus único de 20% do PRO). Percentuais exatos não devem ser inventados.
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-800">Validar com a empresa</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">5. Regras de elegibilidade</td>
                <td className="py-3.5 px-4">
                  Critérios para manter a conta elegível ao recebimento de comissões (status da assinatura, adimplência dos indicados e conformidade).
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-800">Validar com a empresa</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">6. Regras de pagamento</td>
                <td className="py-3.5 px-4">
                  Prazos de apuração, valor mínimo de resgate, meio de transferência (PIX/conta) e regras tributárias aplicáveis.
                </td>
                <td className="py-3.5 px-4 font-semibold text-amber-800">Validar com a empresa</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">7. Restrições e políticas</td>
                <td className="py-3.5 px-4">
                  Proibido prometer renda garantida, fazer spam em nome da marca ou criar anúncios enganosos. Uso obrigatório dos materiais oficiais aprovados.
                </td>
                <td className="py-3.5 px-4 font-semibold text-emerald-700">Diretriz Confirmada</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">8. Link para as regras oficiais</td>
                <td className="py-3.5 px-4">
                  <a
                    href="https://www.xaigoo.app/plano-pro-xai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-violet-700 underline hover:text-violet-900"
                  >
                    https://www.xaigoo.app/plano-pro-xai
                  </a>
                </td>
                <td className="py-3.5 px-4 font-semibold text-emerald-700">Link Oficial Publicado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export const Chapter6Ads: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 06 · Plataforma AdTech
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Xaigoo Ads & Xaigoo Play: Modelos URBAN e VENUE
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          O <strong>Xaigoo Ads</strong> é a plataforma de publicidade do ecossistema. Ela permite que anunciantes e comerciantes planejem campanhas para exibição em telas que utilizem o software <strong>Xaigoo Play</strong> e estejam habilitadas para receber publicidade.
        </p>
      </section>

      {/* URBAN vs VENUE Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URBAN */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-violet-700">
            <span>CATEGORIA 01 · MÍDIA EM MOVIMENTO</span>
            <span>REDE MÓVEL</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 text-violet-700 rounded-lg border border-violet-200">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 font-display">
                URBAN — Publicidade em Veículos
              </h2>
              <p className="text-xs text-slate-500">
                Tablets instalados em veículos de motoristas parceiros de aplicativos
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Anúncios exibidos em tablets com <strong>Xaigoo Play</strong> instalados no interior dos veículos de motoristas parceiros de aplicativos de mobilidade, impactando passageiros durante o trajeto urbano.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
            <div>
              <strong className="text-slate-900">• Papel do Motorista Parceiro:</strong> Pode participar como parceiro de exibição de mídia e receber remuneração conforme as regras aplicáveis do programa.
            </div>
            <div>
              <strong className="text-slate-900">• Papel do Anunciante:</strong> Utiliza a plataforma Xaigoo Ads para alcançar o público em deslocamento por meio dessa rede de telas móveis.
            </div>
            <div>
              <strong className="text-slate-900">• Condição Operacional:</strong> Depende da existência de motoristas habilitados, instalação de equipamentos e campanhas ativas na localidade.
            </div>
          </div>
        </section>

        {/* VENUE */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-violet-700">
            <span>CATEGORIA 02 · MÍDIA EM AMBIENTES FÍSICOS</span>
            <span>REDE FIXA</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 text-violet-700 rounded-lg border border-violet-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 font-display">
                VENUE — Publicidade em Pontos Fixos
              </h2>
              <p className="text-xs text-slate-500">
                Telas instaladas em estabelecimentos comerciais e pontos parceiros elegíveis
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Anúncios exibidos em telas de estabelecimentos comerciais e outros locais de circulação física integrados ao Xaigoo Play. A disponibilidade de cada local depende da existência de parceiros, instalações e condições comerciais adequadas.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <div className="font-bold text-slate-900">Exemplos de ambientes elegíveis para a rede VENUE:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
              <div>• Pequenos comércios locais</div>
              <div>• Atacadistas e supermercados</div>
              <div>• Academias e centros esportivos</div>
              <div>• Postos de combustível</div>
              <div>• Elevadores residenciais de condomínios</div>
              <div>• Outros pontos comerciais ou públicos habilitados</div>
            </div>
          </div>
        </section>
      </div>

      {/* Product for Establishments: Internal Screen Management + Revenue Share */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
            Solução SaaS B2B + Monetização Opcional
          </p>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Plataforma para Estabelecimentos Gerenciarem Suas Próprias Telas Internas
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Além de vender mídia para anunciantes, o ecossistema contempla um produto destinado aos próprios estabelecimentos que desejam utilizar a plataforma para gerenciar a comunicação e publicidade em suas telas internas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Recursos que podem integrar o serviço (conforme disponibilidade):
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li>• Gerenciamento centralizado de uma ou mais telas internas.</li>
              <li>• Organização de campanhas próprias de produtos e avisos do estabelecimento.</li>
              <li>• Programação inteligente de horários de exibição (grade de mídia).</li>
              <li>• Exibição de QR Codes promocionais interativos na tela.</li>
              <li>• Seleção e atualização ágil de mídias (vídeos e imagens).</li>
              <li>• Planos estruturados por quantidade de telas, com opção personalizada para redes ou estabelecimentos com maior número de telas.</li>
            </ul>
          </div>

          <div className="p-5 bg-violet-50/50 border border-violet-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-violet-950 font-display">
              Habilitação de Anunciantes Externos & Modelo de Revenue Share:
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Um estabelecimento que utiliza o sistema em suas telas pode optar por <strong>habilitar a exibição de campanhas de anunciantes externos</strong> (integrando-se à rede VENUE) e participar de um modelo de <strong>revenue share (compartilhamento de receita)</strong>, quando autorizado e de acordo com as regras oficiais.
            </p>
            <div className="pt-2 border-t border-violet-200 text-xs text-amber-900 font-medium">
              Atenção: Nunca prometa percentuais fixos de revenue share ou faturamento garantido ao comerciante sem que as regras oficiais e o contrato da praça estejam validados.
            </div>
          </div>
        </div>
      </section>

      {/* Visual Distinction of the 4 Commercial Roles */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Distinção Visual Obrigatória: Os 4 Papéis no Xaigoo Ads
          </h2>
          <p className="text-sm text-slate-600">
            Esses quatro papéis podem coexistir na mesma empresa ou pessoa, mas <strong>não são o mesmo tipo de cliente</strong>. A equipe comercial deve saber diferenciá-los com precisão:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
            <div className="text-xs font-mono font-bold text-violet-700">PAPEL 01 · CLIENTE SAAS</div>
            <h3 className="text-sm font-bold text-slate-950 font-display">
              Estabelecimento que gerencia as próprias telas
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Contrata a plataforma (por número de telas) para exibir suas próprias promoções, cardápios e avisos internos dentro da sua loja, academia ou mercado.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
            <div className="text-xs font-mono font-bold text-emerald-700">PAPEL 02 · PARCEIRO VENUE</div>
            <h3 className="text-sm font-bold text-slate-950 font-display">
              Ponto parceiro que exibe anúncios de terceiros
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Estabelecimento ou condomínio que autoriza suas telas fixas a exibirem campanhas de anunciantes externos da rede Xaigoo Ads, podendo participar de revenue share.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-900">PAPEL 03 · COMPRADOR DE MÍDIA</div>
            <h3 className="text-sm font-bold text-slate-950 font-display">
              Anunciante que compra mídia
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Marca, agência ou comércio que investe verba publicitária no Xaigoo Ads para que seu anúncio apareça nas telas de veículos (URBAN) ou de pontos fixos (VENUE).
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
            <div className="text-xs font-mono font-bold text-amber-800">PAPEL 04 · PARCEIRO URBAN</div>
            <h3 className="text-sm font-bold text-slate-950 font-display">
              Parceiro URBAN que disponibiliza tela móvel
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Motorista de aplicativo parceiro que possui tablet com Xaigoo Play instalado no veículo para exibir campanhas aos passageiros e receber conforme regras aplicáveis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export const Chapter7Future: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const futureOpportunities = [
    {
      title: '1. Pedidos de lanches e café em estabelecimentos parceiros',
      desc: 'Integração para que o motorista possa localizar e adquirir alimentação rápida e café em comércios parceiros durante seus intervalos.',
      benefit: 'Gera fluxo recorrente de clientes (motoristas) para padarias, cafeterias e lanchonetes parceiras.',
    },
    {
      title: '2. Solicitação antecipada e retirada sem sair do veículo',
      desc: 'Possibilidade de pedir pelo aplicativo com antecedência e retirar no local (inclusive sem sair do veículo, conforme a operação futura de cada ponto).',
      benefit: 'Resolve uma grande dor do motorista: perder tempo estacionando ou procurando vaga apenas para tomar um café.',
    },
    {
      title: '3. Descontos exclusivos para motoristas em parceiros',
      desc: 'Rede de benefícios comerciais em estabelecimentos credenciados (postos, serviços automotivos, alimentação) para usuários ativos do Xaigoo.',
      benefit: 'Aumenta a retenção no Xaigoo Copilot ao gerar economia direta no custo diário de rodagem.',
    },
    {
      title: '4. Benefícios e descontos em academias parceiras',
      desc: 'Condições diferenciadas em academias integradas ao ecossistema para incentivar a saúde e qualidade de vida dos motoristas.',
      benefit: 'Conecta os motoristas aos mesmos estabelecimentos que podem integrar a rede de telas VENUE.',
    },
    {
      title: '5. Solicitação de corridas adicionais por nichos (ex: Supermercados)',
      desc: 'Oportunidade futura de conectar demandas específicas de transporte de estabelecimentos (como compras de supermercados e atacadistas) aos motoristas.',
      benefit: 'Cria novas fontes de corridas qualificadas para o motorista e resolve logística local do varejo.',
    },
    {
      title: '6. Parcerias com casas de shows e eventos',
      desc: 'Integração comercial com casas de espetáculos, eventos e polos de entretenimento de alta demanda de mobilidade e mídia.',
      benefit: 'Une divulgação de eventos nas telas Xaigoo Ads com fluxo de público e oportunidades de transporte.',
    },
    {
      title: '7. Compra de ingressos pelo aplicativo',
      desc: 'Possibilidade futura de comercialização de ingressos e experiências diretamente dentro do ecossistema digital Xaigoo.',
      benefit: 'Amplia as linhas de receita transacional além da assinatura SaaS e da mídia tradicional.',
    },
    {
      title: '8. Possibilidade de integração com serviços de transporte POP e PREMIUM',
      desc: 'Expansão estratégica contemplando modalidades de transporte nas categorias POP e PREMIUM conforme evolução futura da plataforma.',
      benefit: 'Consolida a visão de longo prazo no setor de mobilidade urbana.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-800 font-semibold">
          <span>CAPÍTULO 07 · DIREÇÃO ESTRATÉGICA DE LONGO PRAZO</span>
          <span>·</span>
          <span>STATUS: PLANEJADO PARA O FUTURO / SUJEITO À CONFIRMAÇÃO</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          O Futuro do Ecossistema Xaigoo
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Este capítulo apresenta as oportunidades futuras descritas pela empresa para demonstrar a potência da nossa visão de longo prazo. <strong>Atenção:</strong> o objetivo aqui é mostrar a direção estratégica do negócio para a equipe interna, e <strong>não orientar a venda de recursos futuros como se já estivessem ativos hoje</strong>.
        </p>
      </section>

      {/* Evolution Diagram: How Copilot Expands into the Full Ecosystem */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Diagrama de Evolução: Da Ferramenta do Motorista ao Ecossistema Integrado
          </h2>
          <p className="text-sm text-slate-600">
            Veja como a adoção do Xaigoo Copilot no STEP 1 cria o efeito de rede que destrava valor para comerciantes, anunciantes e usuários:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-violet-50/70 border border-violet-200 rounded-xl space-y-3">
            <div className="text-xs font-mono font-bold text-violet-800">ESTÁGIO ATUAL (STEP 1)</div>
            <h3 className="text-base font-bold text-slate-950 font-display">
              1. Utilidade Diária no Xaigoo Copilot
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              O motorista adota o aplicativo para calcular lucro real por km, classificar corridas e proteger-se com câmera em segundo plano. Forma-se uma comunidade engajada e diária.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="text-xs font-mono font-bold text-slate-600">CONEXÃO COMERCIAL & MÍDIA</div>
            <h3 className="text-base font-bold text-slate-950 font-display">
              2. Integração de Estabelecimentos e Ads
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Com milhares de motoristas circulando pela cidade, postos, cafeterias, mercados e academias têm interesse tanto em anunciar na rede (URBAN/VENUE) quanto em atrair esses motoristas como clientes.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="text-xs font-mono font-bold text-slate-600">EXPANSÃO FUTURA PLANEJADA</div>
            <h3 className="text-base font-bold text-slate-950 font-display">
              3. Conveniência, Benefícios e Novos Serviços
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O ecossistema passa a intermediar pedidos antecipados de lanche/café, descontos exclusivos, corridas por nicho (mercados), eventos, ingressos e frentes POP/PREMIUM.
            </p>
          </div>
        </div>
      </section>

      {/* 8 Future Opportunities Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              As 8 Oportunidades Futuras Mapeadas pela Empresa
            </h2>
            <p className="text-sm text-slate-600">
              Todas as iniciativas abaixo estão classificadas como <strong>Planejado para o futuro / Sujeito à confirmação</strong> (não prometer datas ou disponibilidade):
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {futureOpportunities.map((opp, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono font-semibold text-amber-800">Status: Planejado / Sujeito à confirmação</span>
                <span>Sem data prometida</span>
              </div>
              <h3 className="text-base font-bold text-slate-950 font-display">
                {opp.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {opp.desc}
              </p>
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Sinergia no Ecossistema: </span>
                {opp.benefit}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
