import React, { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Printer,
  AlertTriangle,
  Users,
  BarChart3,
  ClipboardCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  INITIAL_KPI_METRICS,
  KpiMetricItem,
  INITIAL_PENDING_ITEMS,
  PendingGovernanceItem,
} from '../data/operationalData';

interface ChapterProps {
  onNavigateChapter: (chapterId: number) => void;
}

export const Chapter12WorkflowMktSales: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 12 · Governança de Equipe
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Fluxo de Trabalho Integrado entre Marketing e Vendas
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Para que o <strong>STEP 1</strong> funcione com previsibilidade, Marketing e Vendas não podem atuar em silos isolados. Abaixo está a matriz visual de responsabilidades e os pontos de atuação conjunta.
        </p>
      </section>

      {/* 3-Column Responsibility Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MARKETING */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-violet-700">
              FRENTE 01 · INTELIGÊNCIA, MARCA E CONTEÚDO
            </div>
            <h2 className="text-xl font-bold text-slate-950 font-display">
              Responsabilidades de MARKETING
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200">
              <li>• <strong>Pesquisar e selecionar influenciadores</strong> que dialogam com motoristas de aplicativos.</li>
              <li>• <strong>Analisar perfis e comunidades</strong> (Instagram, grupos de Facebook e demais redes).</li>
              <li>• <strong>Preparar mensagens e materiais</strong> de abordagem com linguagem alinhada e persuasiva.</li>
              <li>• <strong>Organizar os dois vídeos explicativos (~1 min) e a proposta</strong> comercial aprovada.</li>
              <li>• <strong>Manter a identidade e a consistência da marca</strong> Xaigoo em todos os pontos de contato.</li>
              <li>• <strong>Registrar os contatos e os resultados de divulgação</strong> em conjunto com o time comercial.</li>
              <li>• <strong>Avaliar quais canais e mensagens</strong> geram maior taxa de resposta e interesse.</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            Entrega principal: Base qualificada + Materiais aprovados + Análise de performance.
          </div>
        </section>

        {/* VENDAS E PARCERIAS */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-emerald-700">
              FRENTE 02 · RELACIONAMENTO, CONVERSÃO E FECHAMENTO
            </div>
            <h2 className="text-xl font-bold text-slate-950 font-display">
              Responsabilidades de VENDAS E PARCERIAS
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200">
              <li>• <strong>Qualificar oportunidades</strong> validando a aderência de cada influenciador ou parceiro.</li>
              <li>• <strong>Realizar ou conduzir os contatos</strong> conforme a divisão interna de responsabilidades.</li>
              <li>• <strong>Apresentar a proposta oficial</strong> somente após a permissão explícita do contato.</li>
              <li>• <strong>Explicar os programas com precisão</strong> (diferenciando o bônus único de 20% do PRO e o afiliado PRO X-AI).</li>
              <li>• <strong>Responder às dúvidas</strong> técnicas e comerciais sem prometer ganhos garantidos.</li>
              <li>• <strong>Negociar e formalizar parcerias</strong> estritamente dentro das condições autorizadas pela empresa.</li>
              <li>• <strong>Acompanhar a evolução dos contatos</strong> no funil e <strong>registrar objeções e feedbacks</strong>.</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            Entrega principal: Parcerias formalizadas + Divulgações ativas + Feedback de campo.
          </div>
        </section>

        {/* TRABALHO CONJUNTO */}
        <section className="bg-violet-50/60 border border-violet-200 rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold text-violet-800">
              FRENTE 03 · SINERGIA E MELHORIA CONTÍNUA
            </div>
            <h2 className="text-xl font-bold text-slate-950 font-display">
              TRABALHO CONJUNTO (Marketing + Vendas)
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed pt-2 border-t border-violet-200">
              <li>• <strong>Aprovar mensagens e materiais</strong> antes de irem para a rua, garantindo precisão comercial e visual.</li>
              <li>• <strong>Compartilhar dúvidas recorrentes</strong> trazidas pelos influenciadores e motoristas.</li>
              <li>• <strong>Identificar oportunidades de melhoria</strong> nos scripts de Direct, na proposta e nos vídeos de 1 minuto.</li>
              <li>• <strong>Avaliar a qualidade dos usuários atraídos</strong> para o Xaigoo Copilot (não apenas volume bruto).</li>
              <li>• <strong>Ajustar as campanhas e priorizações</strong> com base nos resultados reais medidos no STEP 1.</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-violet-200 text-xs text-violet-900 font-semibold">
            Ritual sugerido: Reunião rápida semanal de alinhamento de aprendizados do STEP 1.
          </div>
        </section>
      </div>

      {/* Leadership Governance Note on Contact Execution */}
      <section className="bg-white border border-amber-300 rounded-xl p-6 space-y-2">
        <div className="text-xs font-mono font-bold text-amber-800 uppercase">
          Ponto de Decisão da Liderança (Passagem de Bastão)
        </div>
        <h3 className="text-base font-bold text-slate-950 font-display">
          Quem executa o envio do primeiro Direct e quem assume a conversa após a resposta?
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          Conforme diretriz do manual operacional: a divisão nominal exata de quem envia a primeira mensagem no Direct (Marketing ou Vendas) e em qual etapa ocorre a passagem de bastão deve ser <strong>decidida e formalizada pela liderança da empresa</strong> antes do disparo em lote, evitando que dois colaboradores abordem o mesmo perfil simultaneamente.
        </p>
      </section>
    </div>
  );
};

export const Chapter13KpisAndLearning: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [metrics, setMetrics] = useState<KpiMetricItem[]>(INITIAL_KPI_METRICS);

  const handleUpdateMetric = (id: string, field: 'currentValue' | 'targetGoal', val: string) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 13 · Mensuração, Atribuição e Aprendizado
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Painel de Indicadores Operacionais do STEP 1
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Este painel organiza os <strong>13 indicadores oficiais do STEP 1</strong> sem inventar metas arbitrárias. Os campos de <strong>Realizado</strong> e <strong>Meta da Gestão</strong> são totalmente editáveis para uso nas reuniões de acompanhamento da equipe.
        </p>
      </section>

      {/* Critical Rule: Volume of Activity vs Business Result */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-mono font-bold text-violet-700">DIFERENCIAÇÃO ESSENCIAL 01</div>
          <h2 className="text-base font-bold text-slate-950 font-display">
            Volume de Atividade ≠ Resultado de Negócio
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pesquisar 100 perfis e enviar 50 Directs mede o <strong>esforço operacional</strong> da equipe (Volume de Atividade). Já parcerias aprovadas, downloads atribuíveis, cadastros ativados no Xaigoo Copilot e conversões em planos pagos medem o <strong>resultado real</strong>. Nunca confunda movimento com conversão.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-800">DIFERENCIAÇÃO ESSENCIAL 02</div>
          <h2 className="text-base font-bold text-slate-950 font-display">
            Seguidores e Visualizações Não Geram Downloads Automaticamente
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Um perfil com muitos seguidores pode gerar zero instalações se o público não for de motoristas reais ou se a chamada for confusa. Por isso, recomendamos o <strong>registro rigoroso da origem dos usuários</strong> por meio de códigos de indicação, links parametrizados (UTM) ou mecanismos de atribuição validados tecnicamente.
          </p>
        </div>
      </section>

      {/* Editable 13 KPI Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Matriz dos 13 Indicadores do STEP 1 (Metas Editáveis pela Gestão)
            </h2>
            <p className="text-sm text-slate-600">
              Clique nos campos de <strong>Valor Atual</strong> ou <strong>Meta da Gestão</strong> para atualizar os números da operação:
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar Painel em PDF</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-900">
                <th className="py-3.5 px-4">Indicador Operacional</th>
                <th className="py-3.5 px-4">Natureza da Métrica</th>
                <th className="py-3.5 px-4 w-32 text-right">Realizado Atual</th>
                <th className="py-3.5 px-4 w-48">Meta (Definir pela Gestão)</th>
                <th className="py-3.5 px-4">Orientação de Leitura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {metrics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-950">{m.name}</div>
                    <div className="text-slate-500 mt-0.5">{m.description}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {m.stage}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="text"
                      value={m.currentValue}
                      onChange={(e) => handleUpdateMetric(m.id, 'currentValue', e.target.value)}
                      className="w-24 text-right px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-mono font-bold text-slate-900 tabular-nums"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={m.targetGoal}
                      onChange={(e) => handleUpdateMetric(m.id, 'targetGoal', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-violet-50/50 border border-violet-200 rounded-md font-mono text-violet-900 tabular-nums"
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {m.measurementNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export const Chapter14Checklist: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const checklistGroups = [
    {
      groupId: 'before-contact',
      title: '1. ANTES DO CONTATO',
      subtitle: 'Garantia de qualificação e registro prévio',
      items: [
        { id: 'c1', label: 'Perfil selecionado (fala diretamente com motoristas de aplicativos).' },
        { id: 'c2', label: 'Compatibilidade com o público e adequação à imagem da marca conferidas.' },
        { id: 'c3', label: 'Mensagem inicial curta e humana revisada (sem links invasivos ou promessas).' },
        { id: 'c4', label: 'Contato registrado na Ficha de Influenciadores com data e link.' },
      ],
    },
    {
      groupId: 'after-response',
      title: '2. DEPOIS DA RESPOSTA',
      subtitle: 'Respeito ao protocolo de permissão',
      items: [
        { id: 'c5', label: 'Interesse ou resposta do influenciador devidamente registrado na ficha.' },
        { id: 'c6', label: 'Permissão explícita para envio do material confirmada.' },
        { id: 'c7', label: 'Proposta oficial correta encaminhada (e os 2 vídeos de 1 min enviados caso haja interesse).' },
      ],
    },
    {
      groupId: 'before-bonus',
      title: '3. ANTES DE APRESENTAR A BONIFICAÇÃO',
      subtitle: 'Precisão absoluta entre PRO e PRO X-AI',
      items: [
        { id: 'c8', label: 'Programa correto identificado (Indicação Direta PRO vs. Afiliados PRO X-AI).' },
        { id: 'c9', label: 'Regras oficiais consultadas nas fontes da empresa.' },
        { id: 'c10', label: 'Percentuais e condições conferidos (20% único na 1ª aquisição PRO para mensal, trimestral e anual).' },
        { id: 'c11', label: 'Nenhuma promessa de renda garantida, ganho fixo ou informação não verificada.' },
      ],
    },
    {
      groupId: 'before-formalize',
      title: '4. ANTES DE FORMALIZAR A PARCERIA',
      subtitle: 'Alinhamento de entregas e governança',
      items: [
        { id: 'c12', label: 'Escopo da divulgação claramente definido (formato, canal e mensagem).' },
        { id: 'c13', label: 'Entregas e condições comerciais aprovadas conforme diretrizes da empresa.' },
        { id: 'c14', label: 'Regras de pagamento, elegibilidade e atribuição confirmadas.' },
        { id: 'c15', label: 'Próximas ações e data prevista de publicação registradas.' },
      ],
    },
    {
      groupId: 'after-publication',
      title: '5. DEPOIS DA DIVULGAÇÃO',
      subtitle: 'Mensuração real e aprendizado entre Marketing e Vendas',
      items: [
        { id: 'c16', label: 'Resultado da publicação acompanhado (cliques, downloads e cadastros no Xaigoo Copilot).' },
        { id: 'c17', label: 'Origem dos acessos e usuários registrada por código ou link rastreável, quando possível.' },
        { id: 'c18', label: 'Feedback da audiência e objeções dos motoristas coletados.' },
        { id: 'c19', label: 'Aprendizados compartilhados entre Marketing e Vendas para otimizar o próximo ciclo.' },
      ],
    },
  ];

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    setCheckedMap({});
  };

  const totalItems = 19;
  const completedItems = Object.values(checkedMap).filter(Boolean).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
              Capítulo 14 · Consulta Rápida Diária
            </p>
            <h1 className="text-3xl font-extrabold text-slate-950 font-display">
              Checklist Operacional de Execução do STEP 1
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Utilize esta página como guia de verificação rápida a cada novo influenciador abordado. Garante zero erro de comunicação e alinhamento total entre Marketing e Vendas.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-sm font-mono font-bold text-violet-800 tabular-nums">
              Progresso da Verificação: {completedItems} / {totalItems} itens
            </div>
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar marcações</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Checklist</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Checklist Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {checklistGroups.map((group, idx) => (
          <section
            key={group.groupId}
            className={`bg-white border border-slate-200 rounded-xl p-6 space-y-4 ${
              idx === 4 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-950 font-display">
                {group.title}
              </h2>
              <p className="text-xs text-slate-500">{group.subtitle}</p>
            </div>

            <div className="space-y-2.5">
              {group.items.map((item) => {
                const isChecked = !!checkedMap[item.id];
                return (
                  <label
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item.id)}
                      className="mt-0.5 h-4 w-4 accent-emerald-600 rounded shrink-0"
                    />
                    <span className={`text-xs font-medium leading-relaxed ${isChecked ? 'line-through text-slate-500' : ''}`}>
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export const Chapter15GovernancePending: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [pendingItems, setPendingItems] = useState<PendingGovernanceItem[]>(INITIAL_PENDING_ITEMS);
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');

  const handleStatusChange = (id: string, newStatus: PendingGovernanceItem['validationStatus']) => {
    setPendingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, validationStatus: newStatus } : item))
    );
  };

  const filtered =
    filterStatus === 'TODOS'
      ? pendingItems
      : pendingItems.filter((i) => i.validationStatus === filterStatus);

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
          Capítulo 15 · Governança Executiva e Validação Interna
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Pendências para Validação da Gestão
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Para que a operação seja considerada 100% definida e livre de riscos comerciais, esta matriz separa com transparência <strong>o que já está confirmado no briefing/site</strong> daquilo que <strong>depende de validação ou decisão formal da gestão</strong>.
        </p>
      </section>

      {/* Summary Banner of Confirmed vs Pending */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="text-xs font-mono font-bold text-emerald-700">1. INFORMAÇÕES CONFIRMADAS</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Posicionamento SaaS + AdTech, foco prioritário no STEP 1 (Xaigoo Copilot), regra do Bônus de Indicação Direta do PRO (20% único na 1ª compra para ciclos mensal, trimestral e anual), categorias URBAN e VENUE, e fluxo de abordagem com permissão + 2 vídeos de 1 minuto.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="text-xs font-mono font-bold text-violet-700">2. REGISTRO DE CONFORMIDADE COM O SITE</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            As páginas <span className="font-mono">xaigoo.app</span>, <span className="font-mono">/plano-pro-xai</span> e <span className="font-mono">/insiders</span> confirmam o Xaigoo Copilot e a menção aos programas. Como os regulamentos integrais de níveis/recorrência do PRO X-AI e do Insiders não devem ser presumidos, estão listados abaixo para validação interna.
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-900">3. DECISÕES PENDENTES DA LIDERANÇA</div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Os 11 tópicos abaixo reúnem as definições que a diretoria pode validar progressivamente. Conforme cada item for aprovado, altere o seletor de status correspondente.
          </p>
        </div>
      </section>

      {/* Interactive Governance Validation Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Matriz das 11 Pendências de Validação Operacional e Estratégica
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Filtrar:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-800"
            >
              <option value="TODOS">Todos os Itens ({pendingItems.length})</option>
              <option value="Pendente de validação">Pendente de validação</option>
              <option value="Em revisão pela gestão">Em revisão pela gestão</option>
              <option value="Validado internamente">Validado internamente</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => {
            const statusStyle =
              item.validationStatus === 'Validado internamente'
                ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                : item.validationStatus === 'Em revisão pela gestão'
                ? 'text-violet-800 bg-violet-50 border-violet-300'
                : 'text-amber-900 bg-amber-50 border-amber-300';

            return (
              <div key={item.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-xs font-mono text-slate-500">{item.category}</div>
                    <h3 className="text-base font-bold text-slate-950 font-display">
                      {item.topic}
                    </h3>
                  </div>

                  <select
                    value={item.validationStatus}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value as PendingGovernanceItem['validationStatus'])
                    }
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${statusStyle}`}
                  >
                    <option value="Pendente de validação">Pendente de validação</option>
                    <option value="Em revisão pela gestão">Em revisão pela gestão</option>
                    <option value="Validado internamente">Validado internamente</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-emerald-800">O que já está confirmado (Briefing / Site):</div>
                    <p className="text-slate-600 leading-relaxed">{item.confirmedInBriefingOrSite}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-amber-200 space-y-1">
                    <div className="font-bold text-amber-900">O que precisa ser validado pela gestão:</div>
                    <p className="text-slate-700 leading-relaxed font-medium">{item.pendingDecision}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">Orientação operacional até a validação:</div>
                    <p className="text-slate-600 leading-relaxed">{item.impactOnTeam}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
