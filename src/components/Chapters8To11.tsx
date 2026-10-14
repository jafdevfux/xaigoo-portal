import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Plus,
  Trash2,
  Video,
  FileText,
  AlertCircle,
  MessageSquare,
  Users,
  Pencil,
  X,
} from 'lucide-react';
import {
  STEP1_FLOW_STAGES,
  INITIAL_INFLUENCER_RECORDS,
  InfluencerRecord,
} from '../data/operationalData';

interface ChapterProps {
  onNavigateChapter: (chapterId: number) => void;
}

export const Chapter8Step1Priority: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const activeStage = STEP1_FLOW_STAGES[selectedStageIdx] || STEP1_FLOW_STAGES[0];

  const sevenPriorities = [
    '1. Divulgar a marca Xaigoo no universo de mobilidade urbana.',
    '2. Identificar influenciadores e comunidades que falam diretamente com motoristas de aplicativos.',
    '3. Estabelecer parcerias de divulgação éticas e estruturadas.',
    '4. Atrair downloads e novos usuários ativos para o Xaigoo Copilot.',
    '5. Testar abordagens, argumentos e formatos de mensagens no mercado real.',
    '6. Aprender continuamente com as dúvidas, objeções e respostas do público.',
    '7. Construir uma base sólida de usuários que sustentará as próximas etapas (Steps 2, 3 e 4).',
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-slate-950 text-white border border-slate-800 rounded-xl p-8 space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-violet-300 font-semibold">
          <span>CAPÍTULO 08 · EXECUÇÃO PRIORITÁRIA</span>
          <span>·</span>
          <span>STEP 1 EM FOCO</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white font-display">
          PRIMEIRO, CONSTRUIR A BASE.
        </h1>
        <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
          Por que o <strong>STEP 1</strong> é a nossa prioridade absoluta agora? Porque nenhum ecossistema AdTech ou rede de parcerias se sustenta sem audiência qualificada e usuários ativos. A empresa já separou possíveis influenciadores no Instagram e grupos de Facebook para iniciarmos os contatos imediatamente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
          {sevenPriorities.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 font-medium">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* 12-Step Interactive Flowchart of STEP 1 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Fluxograma Operacional Completo do STEP 1 (12 Etapas)
            </h2>
            <p className="text-sm text-slate-600">
              Cada etapa possui um <strong>objetivo</strong>, uma <strong>ação prática</strong> e uma <strong>condição clara para avançar</strong>. Clique em qualquer etapa abaixo para inspecionar os critérios ou consulte a sequência completa:
            </p>
          </div>
          <span className="text-xs font-mono text-violet-700 font-semibold shrink-0">
            Nunca presuma aceite antes da Etapa 08
          </span>
        </div>

        {/* Highlighted Active Stage Inspector */}
        <div className="bg-violet-50/70 border border-violet-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="font-bold text-violet-800">
              ETAPA SELECIONADA: {activeStage.stepNumber} DE 12
            </span>
            <span className="font-semibold text-slate-700">
              Responsável sugerido: {activeStage.owner}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-950 font-display">
            {activeStage.stepNumber}. {activeStage.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">1. Objetivo da Etapa</div>
              <p className="text-xs text-slate-600 leading-relaxed">{activeStage.objective}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">2. Ação Operacional</div>
              <p className="text-xs text-slate-600 leading-relaxed">{activeStage.action}</p>
            </div>
            <div className="bg-white border border-emerald-300 rounded-lg p-4 space-y-1.5">
              <div className="text-xs font-bold text-emerald-800">3. Condição Clara para Avançar</div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{activeStage.advanceCondition}</p>
            </div>
          </div>

          {activeStage.warningNote && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
              <strong>Regra de Segurança:</strong> {activeStage.warningNote}
            </div>
          )}
        </div>

        {/* Full 12-Step Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEP1_FLOW_STAGES.map((stage, idx) => {
            const isSelected = idx === selectedStageIdx;
            return (
              <button
                key={stage.stepNumber}
                onClick={() => setSelectedStageIdx(idx)}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-slate-950 text-white border-violet-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={isSelected ? 'text-violet-300 font-bold' : 'text-violet-700 font-bold'}>
                      ETAPA {stage.stepNumber}
                    </span>
                    <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>
                      {stage.owner.split(' ')[0]}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold leading-snug font-display">
                    {stage.title}
                  </h4>
                  <p className={`text-xs line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                    {stage.objective}
                  </p>
                </div>
                <div className={`pt-2 border-t text-[11px] font-mono ${isSelected ? 'border-slate-800 text-emerald-300' : 'border-slate-200 text-slate-500'}`}>
                  Condição → {stage.advanceCondition.slice(0, 42)}...
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const Chapter9Influencers: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [qualChecks, setQualChecks] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

  const [records, setRecords] = useState<InfluencerRecord[]>(INITIAL_INFLUENCER_RECORDS);
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [newRecord, setNewRecord] = useState<Omit<InfluencerRecord, 'id'>>({
    nameOrHandle: '',
    platform: 'Instagram',
    link: '',
    audienceType: '',
    justification: '',
    firstContactDate: '2026-10-10',
    status: 'Selecionado',
    responseReceived: 'Pendente',
    proposalSent: false,
    videosSent: false,
    nextAction: 'Enviar primeiro contato pelo Direct pedindo permissão',
    notes: '',
  });

  const qualificationCriteria = [
    '1. O influenciador é motorista de aplicativo ou fala diretamente com motoristas?',
    '2. O conteúdo publicado é coerente com a proposta de valor do Xaigoo Copilot?',
    '3. O público nos comentários demonstra interesse em mobilidade, tecnologia, produtividade ou renda complementar?',
    '4. O influenciador possui interação real e autêntica com sua audiência (e não apenas números inflados)?',
    '5. O tom e o conteúdo são adequados e seguros para a imagem da marca Xaigoo?',
    '6. Existe um canal de contato claramente disponível (Direct aberto, e-mail ou WhatsApp comercial)?',
    '7. O perfil parece apropriado para uma parceria ética de divulgação de longo prazo?',
  ];

  const allStatuses: InfluencerRecord['status'][] = [
    'A pesquisar',
    'Selecionado',
    'Primeiro contato enviado',
    'Aguardando resposta',
    'Autorizou o envio',
    'Material enviado',
    'Em avaliação',
    'Parceria aprovada',
    'Em execução',
    'Encerrado',
    'Não interessado',
    'Sem resposta após acompanhamento',
  ];

  const checkedCount = Object.values(qualChecks).filter(Boolean).length;

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.nameOrHandle.trim()) return;
    const created: InfluencerRecord = {
      ...newRecord,
      id: `inf-${Date.now()}`,
    };
    setRecords((prev) => [created, ...prev]);
    setNewRecord({
      nameOrHandle: '',
      platform: 'Instagram',
      link: '',
      audienceType: '',
      justification: '',
      firstContactDate: '2026-10-10',
      status: 'Selecionado',
      responseReceived: 'Pendente',
      proposalSent: false,
      videosSent: false,
      nextAction: 'Enviar primeiro contato pelo Direct pedindo permissão',
      notes: '',
    });
    setShowAddForm(false);
  };

  const handleUpdateStatus = (id: string, newStatus: InfluencerRecord['status']) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleToggleProposal = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, proposalSent: !r.proposalSent } : r))
    );
  };

  const handleToggleVideos = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, videosSent: !r.videosSent } : r))
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleExportCSV = () => {
    const headers = [
      'Nome ou Perfil',
      'Plataforma',
      'Link',
      'Tipo de Audiencia',
      'Justificativa',
      'Data Primeiro Contato',
      'Status',
      'Resposta Recebida',
      'Proposta Enviada',
      'Videos Enviados',
      'Proxima Acao',
      'Observacoes',
    ];
    const rows = records.map((r) => [
      `"${r.nameOrHandle.replace(/"/g, '""')}"`,
      `"${r.platform}"`,
      `"${r.link}"`,
      `"${r.audienceType.replace(/"/g, '""')}"`,
      `"${r.justification.replace(/"/g, '""')}"`,
      `"${r.firstContactDate}"`,
      `"${r.status}"`,
      `"${r.responseReceived}"`,
      r.proposalSent ? 'Sim' : 'Nao',
      r.videosSent ? 'Sim' : 'Nao',
      `"${r.nextAction.replace(/"/g, '""')}"`,
      `"${r.notes.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'xaigoo_step1_fichas_influenciadores.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords =
    statusFilter === 'TODOS' ? records : records.filter((r) => r.status === statusFilter);

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 09 · Qualificação Manual & Controle de Contatos
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Perfil, Priorização e Ficha de Influenciadores
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Este processo de qualificação foi desenhado para ser executado <strong>manualmente pela equipe e sem depender de ferramentas pagas</strong>. Antes de enviar qualquer mensagem, passe o perfil pelos 7 critérios abaixo e registre-o na ficha de controle.
        </p>
      </section>

      {/* Interactive 7-Criteria Qualification Simulator */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Validador Manual de Perfil (7 Critérios de Qualificação)
            </h2>
            <p className="text-sm text-slate-600">
              Marque os critérios atendidos pelo influenciador ou grupo antes de aprovar a abordagem:
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs text-slate-500">Pontuação do Perfil: </span>
            <span className={`text-sm font-bold tabular-nums ${checkedCount >= 6 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {checkedCount} / 7 critérios ({checkedCount >= 6 ? 'APROVADO PARA CONTATO' : 'REVISAR ADERÊNCIA'})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {qualificationCriteria.map((crit, idx) => {
            const isChecked = !!qualChecks[idx];
            return (
              <label
                key={idx}
                className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                  isChecked ? 'bg-violet-50/50 border-violet-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setQualChecks((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  className="mt-0.5 h-4 w-4 accent-violet-600 rounded shrink-0"
                />
                <span className="text-xs font-medium leading-relaxed">{crit}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Official Status Pipeline Reference */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-display">
          Régua Oficial de Status do Contato (Pipeline do STEP 1)
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
          <span>1. A pesquisar</span>
          <span>→</span>
          <span>2. Selecionado</span>
          <span>→</span>
          <span>3. Primeiro contato enviado</span>
          <span>→</span>
          <span>4. Aguardando resposta</span>
          <span>→</span>
          <span className="font-semibold text-violet-800">5. Autorizou o envio</span>
          <span>→</span>
          <span>6. Material enviado</span>
          <span>→</span>
          <span>7. Em avaliação</span>
          <span>→</span>
          <span className="font-semibold text-emerald-800">8. Parceria aprovada</span>
          <span>→</span>
          <span className="font-semibold text-emerald-800">9. Em execução</span>
          <span>→</span>
          <span>10. Encerrado</span>
        </div>
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
          Status de saída lateral: <strong>“Não interessado”</strong> (quando recusa cordialmente) e <strong>“Sem resposta após acompanhamento”</strong> (quando não responde após o follow-up respeitoso).
        </div>
        <div className="pt-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              const evt = new CustomEvent('xaigoo:open-pipeline');
              window.dispatchEvent(evt);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Abrir Pipeline dedicado
          </button>
        </div>
      </section>

      {/* Interactive Influencer Registration Sheet (Ficha Visual de Registro) — permanece no fluxo, mas operação principal está em Pipeline */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Ficha Visual de Registro e Acompanhamento de Influenciadores
            </h2>
            <p className="text-sm text-slate-600">
              Contém todos os 12 campos obrigatórios exigidos no manual operacional. Você pode adicionar novos perfis, atualizar o status em tempo real e exportar a planilha CSV.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Fechar Nova Ficha' : 'Cadastrar Novo Influenciador'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddRecord} className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Nova Ficha de Contato (12 Campos Operacionais)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">1. Nome ou Perfil (@) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: @motorista_real"
                  value={newRecord.nameOrHandle}
                  onChange={(e) => setNewRecord({ ...newRecord, nameOrHandle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">2. Plataforma</label>
                <select
                  value={newRecord.platform}
                  onChange={(e) => setNewRecord({ ...newRecord, platform: e.target.value as InfluencerRecord['platform'] })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Grupo de Facebook">Grupo de Facebook</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">3. Link do Perfil / Comunidade</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/..."
                  value={newRecord.link}
                  onChange={(e) => setNewRecord({ ...newRecord, link: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">4. Tipo de Audiência</label>
                <input
                  type="text"
                  placeholder="Ex: Motoristas de app SP/RJ"
                  value={newRecord.audienceType}
                  onChange={(e) => setNewRecord({ ...newRecord, audienceType: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">5. Justificativa para Contato</label>
                <input
                  type="text"
                  placeholder="Por que esse perfil foi aprovado?"
                  value={newRecord.justification}
                  onChange={(e) => setNewRecord({ ...newRecord, justification: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">6. Data do Primeiro Contato</label>
                <input
                  type="date"
                  value={newRecord.firstContactDate}
                  onChange={(e) => setNewRecord({ ...newRecord, firstContactDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">7. Status Inicial</label>
                <select
                  value={newRecord.status}
                  onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value as InfluencerRecord['status'] })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  {allStatuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">8. Resposta Recebida</label>
                <select
                  value={newRecord.responseReceived}
                  onChange={(e) => setNewRecord({ ...newRecord, responseReceived: e.target.value as InfluencerRecord['responseReceived'] })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Positiva (Autorizou)">Positiva (Autorizou)</option>
                  <option value="Com dúvidas">Com dúvidas</option>
                  <option value="Recusou">Recusou</option>
                  <option value="Sem resposta">Sem resposta</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">11. Próxima Ação</label>
                <input
                  type="text"
                  value={newRecord.nextAction}
                  onChange={(e) => setNewRecord({ ...newRecord, nextAction: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">12. Observações</label>
                <input
                  type="text"
                  placeholder="Anotações de conversa, dúvidas apresentadas ou detalhes do perfil..."
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Salvar Ficha na Lista
              </button>
            </div>
          </form>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Filtrar por Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-800"
          >
            <option value="TODOS">Todos os Status ({records.length})</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Influencer Cards (Fichas Visuais Completas) */}
        <div className="space-y-4">
          {filteredRecords.map((rec) => (
            <div key={rec.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-violet-700">{rec.platform}</span>
                    <span>·</span>
                    <span className="font-mono">1º Contato: {rec.firstContactDate}</span>
                    <span>·</span>
                    <a href={rec.link} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-900">
                      {rec.link}
                    </a>
                  </div>
                  <h3 className="text-base font-bold text-slate-950 font-display mt-0.5">
                    {rec.nameOrHandle}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={rec.status}
                    onChange={(e) => handleUpdateStatus(rec.id, e.target.value as InfluencerRecord['status'])}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDeleteRecord(rec.id)}
                    title="Remover ficha"
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Tipo de Audiência:</span>
                  <span className="text-slate-600">{rec.audienceType}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Justificativa para Contato:</span>
                  <span className="text-slate-600">{rec.justification}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Resposta Recebida:</span>
                  <span className="text-slate-700 font-medium">{rec.responseReceived}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Próxima Ação:</span>
                  <span className="text-violet-800 font-semibold">{rec.nextAction}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={rec.proposalSent}
                      onChange={() => handleToggleProposal(rec.id)}
                      className="h-4 w-4 accent-violet-600 rounded"
                    />
                    <span>9. Proposta enviada: <strong>{rec.proposalSent ? 'Sim' : 'Não'}</strong></span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={rec.videosSent}
                      onChange={() => handleToggleVideos(rec.id)}
                      className="h-4 w-4 accent-violet-600 rounded"
                    />
                    <span>10. Vídeos enviados (1 e 2): <strong>{rec.videosSent ? 'Sim' : 'Não'}</strong></span>
                  </label>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">Observações: </span>
                  {rec.notes || 'Sem observações adicionais.'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const Chapter10DirectOutreach: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [influencerName, setInfluencerName] = useState<string>('Carlos');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom message overrides (null = use auto-generated)
  const [customOfficial, setCustomOfficial] = useState<string | null>(null);
  const [customShort, setCustomShort] = useState<string | null>(null);
  const [customFollowUp, setCustomFollowUp] = useState<string | null>(null);
  const [customClose, setCustomClose] = useState<string | null>(null);

  // Edit mode tracking
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<string>('');

  const displayName = influencerName.trim() ? influencerName.trim() : '[nome]';

  const generatedOfficial = `Olá, ${displayName}! Tudo bem? Conhecemos seu conteúdo sobre o dia a dia dos motoristas de aplicativo e acreditamos que pode haver uma conexão interessante com o Xaigoo, um aplicativo desenvolvido para auxiliar motoristas. Estamos selecionando parceiros de divulgação e temos uma proposta que gostaríamos de apresentar. Podemos te enviar um material breve para você conhecer?`;

  const generatedShort = `Olá, ${displayName}! Tudo bem? Acompanhamos seu conteúdo para motoristas de app e vimos muita sinergia com o Xaigoo Copilot (app que ajuda o motorista a calcular lucro real por km e analisar corridas). Estamos selecionando parceiros de divulgação — posso te enviar uma proposta rápida por aqui para você avaliar?`;

  const generatedFollowUp = `Olá, ${displayName}! Tudo bem? Passando apenas para saber se você chegou a ver nossa mensagem anterior sobre o Xaigoo Copilot. Caso faça sentido para o seu perfil conhecer nossa proposta de parceria para divulgadores, me avise que te envio o resumo por aqui. Um ótimo dia de trabalho!`;

  const generatedClose = `Perfeito, ${displayName}! Agradecemos muito pela atenção e pelo retorno. Seguimos acompanhando seu trabalho e deixamos as portas abertas para o futuro. Boas corridas e ótimo trabalho!`;

  // Resolved messages: custom override or auto-generated
  const officialMessage = customOfficial ?? generatedOfficial;
  const shortInstagramMessage = customShort ?? generatedShort;
  const followUpMessage = customFollowUp ?? generatedFollowUp;
  const politeCloseMessage = customClose ?? generatedClose;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const startEdit = (key: string, currentText: string) => {
    setEditingKey(key);
    setEditDraft(currentText);
  };

  const saveEdit = (key: string) => {
    const trimmed = editDraft.trim();
    if (key === 'official') setCustomOfficial(trimmed || null);
    else if (key === 'short') setCustomShort(trimmed || null);
    else if (key === 'followup') setCustomFollowUp(trimmed || null);
    else if (key === 'close') setCustomClose(trimmed || null);
    setEditingKey(null);
    setEditDraft('');
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditDraft('');
  };

  const resetToGenerated = (key: string) => {
    if (key === 'official') setCustomOfficial(null);
    else if (key === 'short') setCustomShort(null);
    else if (key === 'followup') setCustomFollowUp(null);
    else if (key === 'close') setCustomClose(null);
    setEditingKey(null);
    setEditDraft('');
  };

  const isCustomized = (key: string): boolean => {
    if (key === 'official') return customOfficial !== null;
    if (key === 'short') return customShort !== null;
    if (key === 'followup') return customFollowUp !== null;
    if (key === 'close') return customClose !== null;
    return false;
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 10 · Abordagem Ética por Permissão
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          Abordagem pelo Direct: Scripts e Sequência de Contato
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          O primeiro contato deve ser <strong>curto, humano, respeitoso e jamais parecer uma mensagem publicitária em massa</strong>. O objetivo inicial <strong>não é</strong> explicar todas as regras, vender um plano ou prometer ganhos — é apresentar brevemente o Xaigoo e perguntar se o influenciador aceita receber um material de proposta.
        </p>
      </section>

      {/* Personalizer & Ready-to-Copy Scripts */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Gerador de Scripts Aprovados para o Direct
            </h2>
            <p className="text-sm text-slate-600">
              Digite o nome do influenciador abaixo para personalizar as mensagens e copiar com 1 clique:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Nome do Influenciador:
            </label>
            <input
              type="text"
              value={influencerName}
              onChange={(e) => setInfluencerName(e.target.value)}
              placeholder="Ex: Carlos"
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 w-40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Script 1: Official Briefing Message */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-violet-700">
                  OPÇÃO 01 · MENSAGEM PADRÃO OFICIAL (COMPLETA)
                </div>
                <div className="flex items-center gap-1.5">
                  {isCustomized('official') && (
                    <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">Editado</span>
                  )}
                  {editingKey !== 'official' && (
                    <button
                      onClick={() => startEdit('official', officialMessage)}
                      title="Editar mensagem"
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-violet-700 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-950 font-display">
                Primeiro Contato — Modelo Oficial do Briefing
              </h3>
              {editingKey === 'official' ? (
                <div className="space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={6}
                    className="w-full text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-y"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => saveEdit('official')}
                      className="py-1.5 px-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                    {isCustomized('official') && (
                      <button
                        onClick={() => resetToGenerated('official')}
                        className="py-1.5 px-3 text-amber-700 hover:bg-amber-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Restaurar Original
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                  “{officialMessage}”
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy('official', officialMessage)}
                className="flex-1 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedKey === 'official' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'official' ? 'Mensagem Copiada!' : 'Copiar Mensagem Oficial'}</span>
              </button>
              {isCustomized('official') && editingKey !== 'official' && (
                <button
                  onClick={() => resetToGenerated('official')}
                  title="Restaurar mensagem original"
                  className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Restaurar
                </button>
              )}
            </div>
          </div>

          {/* Script 2: Shorter Instagram Version */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-emerald-700">
                  OPÇÃO 02 · VERSÃO MAIS CURTA E NATURAL PARA INSTAGRAM
                </div>
                <div className="flex items-center gap-1.5">
                  {isCustomized('short') && (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Editado</span>
                  )}
                  {editingKey !== 'short' && (
                    <button
                      onClick={() => startEdit('short', shortInstagramMessage)}
                      title="Editar mensagem"
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-950 font-display">
                Primeiro Contato — Direto e Conversacional
              </h3>
              {editingKey === 'short' ? (
                <div className="space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={6}
                    className="w-full text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-y"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => saveEdit('short')}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                    {isCustomized('short') && (
                      <button
                        onClick={() => resetToGenerated('short')}
                        className="py-1.5 px-3 text-amber-700 hover:bg-amber-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Restaurar Original
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                  “{shortInstagramMessage}”
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy('short', shortInstagramMessage)}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedKey === 'short' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'short' ? 'Mensagem Copiada!' : 'Copiar Versão Curta Instagram'}</span>
              </button>
              {isCustomized('short') && editingKey !== 'short' && (
                <button
                  onClick={() => resetToGenerated('short')}
                  title="Restaurar mensagem original"
                  className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Restaurar
                </button>
              )}
            </div>
          </div>

          {/* Script 3: Respectful Follow-up */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-amber-800">
                  ACOMPANHAMENTO RESPEITOSO E LIMITADO (CASO NÃO RESPONDA)
                </div>
                <div className="flex items-center gap-1.5">
                  {isCustomized('followup') && (
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Editado</span>
                  )}
                  {editingKey !== 'followup' && (
                    <button
                      onClick={() => startEdit('followup', followUpMessage)}
                      title="Editar mensagem"
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {editingKey === 'followup' ? (
                <div className="space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={5}
                    className="w-full text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-y"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => saveEdit('followup')}
                      className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                    {isCustomized('followup') && (
                      <button
                        onClick={() => resetToGenerated('followup')}
                        className="py-1.5 px-3 text-amber-700 hover:bg-amber-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Restaurar Original
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                  “{followUpMessage}”
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy('followup', followUpMessage)}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedKey === 'followup' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'followup' ? 'Copiado!' : 'Copiar Acompanhamento Único'}</span>
              </button>
              {isCustomized('followup') && editingKey !== 'followup' && (
                <button
                  onClick={() => resetToGenerated('followup')}
                  title="Restaurar mensagem original"
                  className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Restaurar
                </button>
              )}
            </div>
          </div>

          {/* Script 4: Polite Close on Refusal */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-slate-600">
                  ENCERRAMENTO CORDIAL (EM CASO DE RECUSA)
                </div>
                <div className="flex items-center gap-1.5">
                  {isCustomized('close') && (
                    <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Editado</span>
                  )}
                  {editingKey !== 'close' && (
                    <button
                      onClick={() => startEdit('close', politeCloseMessage)}
                      title="Editar mensagem"
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {editingKey === 'close' ? (
                <div className="space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={4}
                    className="w-full text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-y"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => saveEdit('close')}
                      className="py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                    {isCustomized('close') && (
                      <button
                        onClick={() => resetToGenerated('close')}
                        className="py-1.5 px-3 text-amber-700 hover:bg-amber-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Restaurar Original
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                  “{politeCloseMessage}”
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy('close', politeCloseMessage)}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedKey === 'close' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'close' ? 'Copiado!' : 'Copiar Encerramento Cordial'}</span>
              </button>
              {isCustomized('close') && editingKey !== 'close' && (
                <button
                  onClick={() => resetToGenerated('close')}
                  title="Restaurar mensagem original"
                  className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Restaurar
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Correct Cadence & Decision Tree */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Sequência Correta de Condução e Protocolo Anti-Spam
          </h2>
          <p className="text-sm text-slate-600">
            Respeite rigorosamente a escada de permissão abaixo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {[
            { step: '01', title: 'Contato Inicial', desc: 'Enviar Direct curto e personalizado perguntando se pode enviar a proposta.' },
            { step: '02', title: 'Aguardar Resposta', desc: 'Esperar o retorno. Nunca tratar o silêncio como autorização para enviar anexos.' },
            { step: '03', title: 'Se Autorizar: Enviar Proposta', desc: 'Encaminhar apenas o material de proposta oficial aprovado pela empresa.' },
            { step: '04', title: 'Se Houver Interesse: 2 Vídeos', desc: 'Somente após sinalizar interesse na proposta, enviar os 2 vídeos de ~1 minuto.' },
            { step: '05', title: 'Responder às Dúvidas', desc: 'Esclarecer perguntas usando exclusivamente fatos e regras confirmadas.' },
            { step: '06', title: 'Alinhar Próximos Passos', desc: 'Definir escopo, código/link de indicação e data da divulgação.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-violet-700">PASSO {item.step}</div>
              <h3 className="text-sm font-bold text-slate-950 font-display">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const Chapter11ProposalAndVideos: React.FC<ChapterProps> = ({ onNavigateChapter }) => {
  const [videoChecks, setVideoChecks] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const checklistItems = [
    '1. Linguagem simples e acessível (sem jargões técnicos confusos).',
    '2. Objetivos e diretos ao ponto (duração aproximada de 1 minuto cada).',
    '3. Totalmente coerentes com as regras oficiais vigentes da empresa.',
    '4. Nenhuma promessa de renda garantida, lucro fácil ou ganhos fixos.',
    '5. Diferenciam claramente os dois programas (Indicação Direta PRO vs. Afiliados PRO X-AI).',
    '6. Apresentam com clareza o próximo passo prático para o influenciador interessado.',
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wider text-violet-700 font-semibold">
          Capítulo 11 · Materiais de Conversão de Parcerias
        </p>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display">
          A Proposta Comercial e os Dois Vídeos Explicativos (~1 Minuto)
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Após a autorização explícita do influenciador no Direct, enviamos o <strong>material de proposta aprovado pela empresa</strong>. Se o parceiro demonstrar interesse em prosseguir, encaminhamos <strong>dois vídeos explicativos de aproximadamente um minuto cada</strong>.
        </p>
      </section>

      {/* Two Videos Detailed Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VIDEO 1 */}
        <section className="bg-white border-2 border-emerald-600 rounded-xl p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-800">
            <span>VÍDEO EXPLICATIVO 01 (~1 MINUTO)</span>
            <span>REGRAS CONFIRMADAS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 font-display">
                VÍDEO 1 — Bônus de Indicação Direta do PRO
              </h2>
              <p className="text-xs text-slate-500">
                Explicação simples, direta e transparente sobre o bônus único de 20%
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-200 text-xs text-slate-700">
            <div className="font-bold text-slate-900">Roteiro de pontos obrigatórios do Vídeo 1:</div>
            <ul className="space-y-2">
              <li>• <strong>Como funciona o código de indicação:</strong> cada participante possui seu código único para compartilhar com colegas motoristas ou seguidores.</li>
              <li>• <strong>O bônus de 20%:</strong> cálculo de 20% sobre o valor da primeira aquisição elegível de qualquer plano PRO realizada pelo indicado.</li>
              <li>• <strong>Validade para os ciclos contemplados:</strong> aplica-se às assinaturas dos planos PRO nos ciclos <strong>mensal, trimestral e anual</strong>.</li>
              <li>• <strong>Crédito único (não recorrente):</strong> deixar explícito que o bônus é creditado <strong>uma única vez por indicação elegível</strong>, na primeira compra.</li>
              <li>• <strong>Conformidade:</strong> mencionar a existência das regras específicas de validação e crédito do programa.</li>
            </ul>
          </div>
        </section>

        {/* VIDEO 2 */}
        <section className="bg-white border-2 border-violet-600 rounded-xl p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-violet-800">
            <span>VÍDEO EXPLICATIVO 02 (~1 MINUTO)</span>
            <span>MODELO DE AFILIADOS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 text-violet-700 rounded-lg border border-violet-200">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 font-display">
                VÍDEO 2 — Programa de Afiliados PRO X-AI
              </h2>
              <p className="text-xs text-slate-500">
                Apresentação do modelo de parceria em rede e bonificações recorrentes
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-200 text-xs text-slate-700">
            <div className="font-bold text-slate-900">Roteiro de pontos obrigatórios do Vídeo 2:</div>
            <ul className="space-y-2">
              <li>• <strong>Separação clara:</strong> explicar logo no início que o Programa de Afiliados PRO X-AI é um modelo diferente da indicação direta do PRO.</li>
              <li>• <strong>Oportunidade de parceria:</strong> apresentar o funcionamento da rede e o potencial de bonificações recorrentes vinculados ao plano PRO X-AI.</li>
              <li>• <strong>Fidelidade estrita às regras oficiais:</strong> apresentar apenas o funcionamento confirmado em <span className="font-mono">xaigoo.app/plano-pro-xai</span> e validado pela empresa.</li>
              <li>• <strong>Trava de segurança:</strong> não inventar percentuais, níveis ou simulações financeiras não autorizadas pela direção.</li>
              <li>• <strong>Chamada para o próximo passo:</strong> convidar o influenciador a tirar dúvidas com nosso time e alinhar sua participação.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Video Quality & Compliance Checklist */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Checklist de Auditoria dos Dois Vídeos antes do Envio
          </h2>
          <p className="text-sm text-slate-600">
            Certifique-se de que ambos os vídeos cumprem integralmente os 6 requisitos abaixo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklistItems.map((item, idx) => {
            const checked = !!videoChecks[idx];
            return (
              <label
                key={idx}
                className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                  checked ? 'bg-emerald-50/50 border-emerald-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setVideoChecks((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  className="mt-0.5 h-4 w-4 accent-emerald-600 rounded shrink-0"
                />
                <span className="text-xs font-medium leading-relaxed">{item}</span>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
};
