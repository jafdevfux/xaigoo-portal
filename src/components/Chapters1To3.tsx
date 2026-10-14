import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  ExternalLink,
  HelpCircle,
  Layers,
  Network,
  ShieldCheck,
  Target,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FOURTEEN_QUESTIONS, PORTFOLIO_ITEMS, PortfolioItem } from '../data/presentationData';

interface ChapterProps {
  onNavigateChapter: (chapterId: number) => void;
}

export const Chapter1Opening: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  return (
    <div className="space-y-12">
      {/* Main Hero Executive Opening */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 mb-6">
          <span>Documento Interno de Alinhamento Estratégico e Operacional</span>
          <span aria-hidden="true">·</span>
          <span>Equipes de Marketing, Growth, Vendas & Parcerias</span>
          <span aria-hidden="true">·</span>
          <span>Ecossistema SaaS & AdTech</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
                Capítulo 01 · Diretriz Executiva
              </p>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 font-display">
                XAIGOO
              </h1>
              <p className="text-xl lg:text-2xl font-semibold text-slate-800 leading-snug font-display">
                Visão do ecossistema, estratégia de crescimento e plano operacional de Marketing e Vendas.
              </p>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Este portal não é uma página publicitária para clientes externos. É a nossa ferramenta interna oficial de alinhamento para garantir que cada integrante compreenda a visão de longo prazo do negócio, domine o portfólio atual e saiba exatamente como executar nossa prioridade imediata.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-900 tracking-tight">
                “Entender o todo. Executar o próximo passo. Construir o ecossistema.”
              </p>
            </div>
          </div>

          {/* Visual Callout for Priority Chapter: STEP 1 */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-xl p-6 lg:p-8 flex flex-col justify-between border border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-violet-300 font-mono">
                <span>PRIORIDADE OPERACIONAL IMEDIATA</span>
                <span>FOCO ATUAL</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-white leading-snug font-display">
                STEP 1 — CAPTAÇÃO DE PARCEIROS DE DIVULGAÇÃO E AQUISIÇÃO DE USUÁRIOS
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Antes de escalar as demais camadas do ecossistema, nossa missão número um é divulgar a marca Xaigoo, firmar parcerias com influenciadores que falam com motoristas de aplicativos e atrair usuários qualificados para o <strong>Xaigoo Copilot</strong>.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
              <button
                onClick={() => onNavigateChapter(8)}
                className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="whitespace-nowrap">Ir direto para o Plano do STEP 1 (Cap. 08)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <button
                onClick={() => onNavigateChapter(2)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-xs rounded-lg border border-slate-800 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="whitespace-nowrap">Seguir leitura sequencial: Cap. 02 · O Ecossistema</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Distinction Matrix: What exists vs What is in validation vs Future vs Now */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Regra de Ouro: Clareza Temporal e Transparência Comercial
            </h2>
            <p className="text-sm text-slate-600">
              Para trabalhar de forma integrada e segura, Marketing e Vendas devem diferenciar rigorosamente os quatro estados do negócio:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>1. JÁ EXISTE / APRESENTADO</span>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pode ser utilizado ou divulgado</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aplicativo <strong>Xaigoo Copilot</strong>, planos Gratuito, PRO e PRO X-AI publicados no site oficial, e o <strong>Bônus de Indicação Direta do PRO (20% único na 1ª compra)</strong>.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>2. EM DESENVOLVIMENTO / VALIDAÇÃO</span>
              <AlertCircle className="w-4 h-4 shrink-0" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Depende de confirmação</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regras operacionais detalhadas do <strong>Programa de Afiliados PRO X-AI</strong>, escopo do <strong>Xaigoo Insiders</strong> e operação comercial do <strong>Xaigoo Ads / Play (URBAN e VENUE)</strong>.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>3. OPORTUNIDADE FUTURA</span>
              <Compass className="w-4 h-4 shrink-0" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Visão estratégica de expansão</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pedidos de café/lanches com retirada rápida, descontos em postos e academias, corridas de nicho, casas de shows e integração POP/PREMIUM. <strong>Não vender como ativo hoje.</strong>
            </p>
          </div>

          <div className="bg-violet-50/70 border border-violet-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-violet-800">
              <span>4. EXECUTAR AGORA (STEP 1)</span>
              <Target className="w-4 h-4 shrink-0" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Missão imediata da equipe</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Mapear influenciadores do nicho de motoristas, abordar no Direct pedindo permissão, apresentar a proposta aprovada + 2 vídeos de 1 min e converter usuários para o <strong>Xaigoo Copilot</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Official Sources & Anti-Hallucination Guardrails */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Fontes Oficiais do Xaigoo & Diretrizes de Conformidade
            </h2>
            <p className="text-sm text-slate-600">
              Consulte sempre as páginas oficiais publicadas e nunca invente condições comerciais não documentadas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.xaigoo.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>xaigoo.app (Principal)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.xaigoo.app/plano-pro-xai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>/plano-pro-xai</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.xaigoo.app/insiders"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>/insiders</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              O que NUNCA inventar ou prometer na abordagem:
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• Valores de remuneração, comissões ou percentuais de revenue share não confirmados.</li>
              <li>• Garantias de renda fixa, lucro certo ou resultados financeiros automáticos.</li>
              <li>• Nomes oficiais, cronogramas ou metas para os Steps 2, 3 e 4 antes da validação.</li>
              <li>• Recursos planejados para o futuro como se já estivessem operacionais no aplicativo hoje.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Como agir diante de dúvidas ou divergências:
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A existência de uma página comercial publicada não significa automaticamente que todos os recursos ou programas estão 100% operacionais em todas as regiões. Sempre que houver dúvida sobre elegibilidade, regras do PRO X-AI ou Insiders, utilize a seção de <strong>Pendências para Validação (Cap. 15)</strong> e consulte a liderança antes de responder ao parceiro.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive 14 Core Questions Mastery Check */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
            Guia de Domínio Rápido da Equipe
          </p>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            As 14 Perguntas Que Todo Colaborador Deve Saber Responder
          </h2>
          <p className="text-sm text-slate-600">
            Ao concluir este manual interativo, você terá domínio completo sobre estas 14 perguntas essenciais. Clique em qualquer pergunta para ver a resposta síntese e ir ao capítulo correspondente:
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {FOURTEEN_QUESTIONS.map((item) => {
            const isOpen = expandedQuestion === item.id;
            return (
              <div key={item.id} className="py-3.5">
                <button
                  onClick={() => setExpandedQuestion(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono font-semibold text-violet-700 tabular-nums shrink-0">
                      {String(item.id).padStart(2, '0')}.
                    </span>
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                      {item.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-3 pl-7 pr-4 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.shortAnswer}
                    </p>
                    <div>
                      <button
                        onClick={() => onNavigateChapter(item.targetChapterId)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 cursor-pointer"
                      >
                        <span>Aprofundar no Capítulo {String(item.targetChapterId).padStart(2, '0')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const Chapter2Ecosystem: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [selectedEntity, setSelectedEntity] = useState<string>('produto');

  const entities = [
    {
      id: 'produto',
      title: '1. Produto',
      subtitle: 'Solução entregue para resolver uma dor específica',
      description:
        'É a aplicação prática utilizada pelo cliente final. No STEP 1, o produto principal é o aplicativo Xaigoo Copilot (nos planos Gratuito, PRO e PRO X-AI), que resolve a dor de cálculo de lucro real, segurança e produtividade do motorista.',
      example: 'Exemplos no Xaigoo: Xaigoo Copilot, software Xaigoo Play, painel de gestão de telas internas.',
      connections: 'Conecta-se ao Usuário (motorista) e gera valor recorrente via assinatura SaaS.',
    },
    {
      id: 'plataforma',
      title: '2. Plataforma',
      subtitle: 'Ambiente tecnológico que conecta múltiplos lados',
      description:
        'Enquanto um produto atende a um usuário diretamente, a plataforma conecta diferentes participantes (como anunciantes, telas de parceiros e consumidores) permitindo transações e campanhas entre eles.',
      example: 'Exemplo no Xaigoo: Xaigoo Ads (conecta anunciantes às redes de telas URBAN e VENUE).',
      connections: 'Integra Anunciantes, Parceiros Comerciais e Motoristas parceiros de mídia.',
    },
    {
      id: 'canal',
      title: '3. Canal de Aquisição',
      subtitle: 'Meio pelo qual atraímos novos usuários e clientes',
      description:
        'Não é um produto, mas o caminho estratégico utilizado por Marketing e Vendas para fazer a mensagem chegar ao público-alvo e gerar downloads ou cadastros.',
      example: 'Exemplos no STEP 1: Direct do Instagram, perfis de influenciadores automotivos/mobilidade, grupos de Facebook de motoristas.',
      connections: 'Alimenta o topo do funil trazendo Usuários para o Produto (Xaigoo Copilot).',
    },
    {
      id: 'parceiro-divulgacao',
      title: '4. Parceiro de Divulgação',
      subtitle: 'Criador, influenciador ou afiliado que amplifica a marca',
      description:
        'Pessoa ou comunidade com audiência qualificada que apresenta o Xaigoo Copilot para outros motoristas, utilizando seu código de indicação ou participando do Programa de Afiliados conforme as regras oficiais.',
      example: 'Exemplos: Influenciadores de rotina de motorista de app no Instagram, administradores de comunidades e afiliados PRO X-AI.',
      connections: 'Atua nos Canais de Aquisição e é recompensado pelos Modelos de Bonificação.',
    },
    {
      id: 'parceiro-comercial',
      title: '5. Parceiro Comercial',
      subtitle: 'Estabelecimento ou ponto físico integrado ao ecossistema',
      description:
        'Comércio, academia, supermercado, posto de combustível ou condomínio que se conecta ao ecossistema Xaigoo — seja cedendo espaço para telas VENUE (mídia de terceiros com revenue share) ou oferecendo benefícios futuros aos motoristas.',
      example: 'Exemplos: Mercados, postos, academias, pequenos comércios e condomínios parceiros.',
      connections: 'Habilita a rede VENUE do Xaigoo Ads e as futuras parcerias de benefícios do ecossistema.',
    },
    {
      id: 'anunciante',
      title: '6. Anunciante',
      subtitle: 'Empresa ou marca que compra espaço publicitário (Mídia)',
      description:
        'Cliente B2B que investe orçamento no Xaigoo Ads para exibir suas campanhas nas telas em veículos (URBAN) ou em pontos fixos (VENUE) visando alcançar passageiros e consumidores.',
      example: 'Exemplos: Marcas locais, redes varejistas, serviços automotivos, anunciantes regionais.',
      connections: 'Injeta receita publicitária (AdTech) na Plataforma, viabilizando a remuneração da rede.',
    },
    {
      id: 'usuario',
      title: '7. Usuário',
      subtitle: 'Pessoa que utiliza ativamente as soluções no dia a dia',
      description:
        'No estágio atual (STEP 1), nosso usuário central é o motorista de aplicativo ou motociclista profissional que utiliza o Xaigoo Copilot para analisar corridas e controlar seus ganhos.',
      example: 'Exemplo central: Motorista de aplicativo ativo no plano Gratuito, PRO ou PRO X-AI.',
      connections: 'É a base fundamental do ecossistema; pode também indicar colegas ou tornar-se parceiro URBAN no futuro.',
    },
    {
      id: 'monetizacao',
      title: '8. Modelo de Monetização',
      subtitle: 'Regra financeira que gera receita ou distribui ganhos',
      description:
        'Conjunto de mecanismos pelos quais o Xaigoo gera receita sustentável e remunera parceiros, combinando assinaturas SaaS e publicidade AdTech.',
      example: 'Exemplos: Assinaturas PRO/PRO X-AI (mensal, trimestral, anual), venda de mídia Xaigoo Ads, planos por tela para comércios e revenue share.',
      connections: 'Sustenta financeiramente a evolução dos 4 Steps do ecossistema.',
    },
  ];

  const activeEntity = entities.find((e) => e.id === selectedEntity) || entities[0];

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 02 · Arquitetura Estratégica
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          O Ecossistema Xaigoo & Os Quatro Pilares de Crescimento
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          O Xaigoo é um ecossistema tecnológico posicionado na categoria <strong>AdTech</strong> que reúne <strong>software como serviço (SaaS)</strong> e <strong>aplicativo móvel</strong> dentro de uma mesma estrutura de negócios. Nossa visão conecta motoristas de aplicativos de mobilidade, anunciantes, estabelecimentos comerciais, pontos parceiros, consumidores e parceiros de divulgação.
        </p>
      </section>

      {/* Central Diagram: 4 Pillars Connected */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Diagrama Central: Os 4 Steps (Pilares de Desenvolvimento)
            </h2>
            <p className="text-sm text-slate-600">
              A estratégia de longo prazo é sustentada por quatro pilares conectados. O <strong>STEP 1</strong> é o alicerce em execução agora; os demais representam pilares de expansão sujeitos à validação oficial da empresa.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 shrink-0">
            Representação visual provisória para Steps 2, 3 e 4
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
          {/* STEP 1 - Highlighted */}
          <div className="bg-slate-950 text-white border-2 border-violet-600 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-violet-300">
                <span>PILAR 01 · ATIVO AGORA</span>
                <span>PRIORIDADE MÁXIMA</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                STEP 1 — XAIGOO COPILOT, DIVULGAÇÃO E AQUISIÇÃO DE USUÁRIOS
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Construção da base sólida de motoristas de aplicativos utilizando o Xaigoo Copilot, impulsionada por parcerias com influenciadores, indicação direta (PRO) e programa de afiliados (PRO X-AI).
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-xs text-violet-300 font-medium">
                Status: Em execução imediata por Marketing e Vendas
              </div>
              <button
                onClick={() => onNavigateChapter(8)}
                className="w-full py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Ver operação do STEP 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* STEP 2 - Provisional Pillar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>PILAR 02 · EXPANSÃO</span>
                <span>A VALIDAR</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                STEP 2 — Pilar de Expansão do Ecossistema (Em Validação)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evolução conectada à base de usuários do STEP 1, contemplando a expansão das soluções de publicidade digital (Xaigoo Ads / Play nas frentes URBAN e VENUE) e parcerias comerciais.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 text-xs text-amber-800 font-medium">
              Nota de governança: Nome oficial, ordem exata e cronograma a confirmar com a direção.
            </div>
          </div>

          {/* STEP 3 - Provisional Pillar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>PILAR 03 · EXPANSÃO</span>
                <span>A VALIDAR</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                STEP 3 — Pilar de Expansão do Ecossistema (Em Validação)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integração ampliada entre motoristas, estabelecimentos comerciais, pontos parceiros e benefícios exclusivos (alimentação, postos, academias e conveniência no trajeto).
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 text-xs text-amber-800 font-medium">
              Nota de governança: Nome oficial, regras e metas a confirmar com a direção.
            </div>
          </div>

          {/* STEP 4 - Provisional Pillar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>PILAR 04 · EXPANSÃO</span>
                <span>A VALIDAR</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                STEP 4 — Pilar de Expansão do Ecossistema (Em Validação)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidação de novas frentes de mobilidade, serviços de nicho (supermercados, eventos, casas de shows) e oportunidades adicionais de monetização multicanal.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 text-xs text-amber-800 font-medium">
              Nota de governança: Nome oficial e sequência definitiva sujeitos à validação interna.
            </div>
          </div>
        </div>

        {/* Visual Connection Flow Strip */}
        <div className="bg-slate-100 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-700">
          <div className="font-semibold text-slate-900">
            Lógica de dependência estratégica:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-violet-800">Base de Motoristas no Copilot (STEP 1)</span>
            <span>→</span>
            <span>Audiência & Capilaridade Urbana</span>
            <span>→</span>
            <span>Atração de Estabelecimentos & Anunciantes (Ads)</span>
            <span>→</span>
            <span>Novas Transações & Benefícios no Ecossistema</span>
          </div>
        </div>
      </section>

      {/* Conceptual Differentiation Interactive Map (8 Elements) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Diferenciação Conceitual: Os 8 Elementos do Ecossistema
          </h2>
          <p className="text-sm text-slate-600">
            Para evitar ruídos na comunicação com parceiros, selecione cada conceito abaixo para entender sua função exata e como eles se relacionam:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left selector list */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {entities.map((ent) => {
              const active = ent.id === selectedEntity;
              return (
                <button
                  key={ent.id}
                  onClick={() => setSelectedEntity(ent.id)}
                  className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    active
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{ent.title}</div>
                    <div className={`text-xs ${active ? 'text-violet-100' : 'text-slate-500'}`}>
                      {ent.subtitle}
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right detail panel + visual relationship map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="text-xs font-mono text-violet-700 font-semibold uppercase">
                Definição Operacional Selecionada
              </div>
              <h3 className="text-2xl font-bold text-slate-950 font-display">
                {activeEntity.title}
              </h3>
              <p className="text-sm font-medium text-slate-700">
                {activeEntity.subtitle}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeEntity.description}
              </p>
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">Aplicação no Xaigoo: </span>
                  <span className="text-slate-700">{activeEntity.example}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Conexão no Ecossistema: </span>
                  <span className="text-slate-700">{activeEntity.connections}</span>
                </div>
              </div>
            </div>

            {/* Visual Relationship Diagram */}
            <div className="border border-slate-200 rounded-xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Mapa Visual de Relações entre os Elementos
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-violet-800">1. Fluxo de Aquisição (STEP 1):</span>
                  <span className="text-slate-700">
                    Parceiro de Divulgação → atua no Canal de Aquisição → atrai o Usuário (Motorista) → adota o Produto (Xaigoo Copilot).
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">2. Fluxo SaaS & Bonificação:</span>
                  <span className="text-slate-700">
                    Usuário assina Plano PRO / PRO X-AI → ativa Modelo de Monetização SaaS → gera Bônus Único (20% PRO) ou Comissão de Rede (PRO X-AI).
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">3. Fluxo AdTech (Xaigoo Ads / Play):</span>
                  <span className="text-slate-700">
                    Anunciante contrata campanha na Plataforma (Xaigoo Ads) → exibida no Produto Xaigoo Play em Veículos (URBAN) e Parceiros Comerciais (VENUE).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const Chapter3Portfolio: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'disponivel' | 'validacao' | 'planejado'>('ALL');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'copilot-app': true,
    'bonus-indicacao-pro': true,
  });

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = PORTFOLIO_ITEMS.filter((item) => {
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchCat && matchStatus;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 03 · Arquitetura de Portfólio
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Mapa do Portfólio: Produtos para Motoristas & Plataforma de Publicidade
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Nosso portfólio organiza-se em duas categorias complementares: <strong>Categoria A (Produtos e Programas para Motoristas)</strong> e <strong>Categoria B (Plataforma de Publicidade Xaigoo Ads)</strong>. Atenção: não confunda a existência de uma página comercial publicada com a confirmação de que todos os recursos estão operacionais em todas as praças.
        </p>

        {/* Interactive Filter Controls */}
        <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Categorias ({PORTFOLIO_ITEMS.length})
            </button>
            <button
              onClick={() => setCategoryFilter('A')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'A' ? 'bg-white text-violet-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Categoria A · Motoristas (7)
            </button>
            <button
              onClick={() => setCategoryFilter('B')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'B' ? 'bg-white text-violet-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Categoria B · Publicidade (6)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos os Status
            </button>
            <button
              onClick={() => setStatusFilter('disponivel')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'disponivel' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disponível / Apresentado
            </button>
            <button
              onClick={() => setStatusFilter('validacao')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'validacao' ? 'bg-white text-amber-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em desenvolvimento / A confirmar
            </button>
            <button
              onClick={() => setStatusFilter('planejado')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'planejado' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Planejado para o futuro
            </button>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item: PortfolioItem) => {
          const isExpanded = !!expandedCards[item.id];
          const statusColor =
            item.status === 'disponivel'
              ? 'text-emerald-700'
              : item.status === 'validacao'
              ? 'text-amber-700'
              : 'text-slate-600';

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Unboxed metadata row with typographic separators */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">{item.categoryLabel}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className={`font-semibold ${statusColor}`}>
                    Status: {item.statusLabel}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-950 font-display">
                  {item.name}
                </h2>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="font-semibold text-slate-900">Público-alvo: </span>
                    <span>{item.targetAudience}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Função principal: </span>
                    <span>{item.mainFunction}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Relação com o ecossistema: </span>
                    <span>{item.ecosystemRelation}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-4 mt-3 border-t border-slate-200 space-y-3">
                    <div className="text-xs font-semibold text-slate-900">
                      Detalhamento Operacional e Regras:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {item.details.map((det, idx) => (
                        <li key={idx}>• {det}</li>
                      ))}
                    </ul>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                      <span className="font-bold text-violet-800">Orientação para Marketing e Vendas: </span>
                      {item.commercialNote}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <button
                  onClick={() => toggleCard(item.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 cursor-pointer"
                >
                  <span>{isExpanded ? 'Ocultar detalhes técnicos' : 'Expandir detalhes do produto'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {item.officialUrl && (
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    <span>Página oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
