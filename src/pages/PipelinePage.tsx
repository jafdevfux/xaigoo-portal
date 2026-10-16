// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — PipelinePage: Ficha + Kanban premium (CRUD persistido MySQL)
// DECISÃO KANBAN: 12 colunas horizontais com overflow-x-auto + snap.
// Justificativa: fidelidade ao pipeline STEP 1 (12 estágios sequenciais). Agrupamento por cor
// de grupo no header (faixa superior) preserva leitura de funil sem perder precisão de estágio.
// Agrupar em 4 colunas comprimidas esconderia o estágio exato e quebraria o fluxo documentado.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Columns,
  Download,
  LayoutList,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  CalendarDays,
  Link2,
  ChevronDown,
  CheckCircle2,
  Clock3,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { InfluencerRecord } from '../data/operationalData';
import { INITIAL_INFLUENCER_RECORDS } from '../data/operationalData';
import {
  ApiError,
  createInfluencer,
  deleteInfluencer,
  getOnlineUsers,
  listInfluencers,
  updateInfluencer,
  updateInfluencerStatus,
  type CreateInfluencerPayload,
  type OnlineUser,
} from '../services/api';

// ---------------------------------------------------------------------------
// Constantes de domínio — espelham server/index.ts + operationalData.ts
// ---------------------------------------------------------------------------
const ALL_STATUSES: InfluencerRecord['status'][] = [
  'A pesquisar',
  'Selecionado',
  'Primeiro contato enviado',
  'Aguardando resposta',
  'Aguardando sistema IOS',
  'Autorizou o envio',
  'Material enviado',
  'Em avaliação',
  'Parceria aprovada',
  'Em execução',
  'Encerrado',
  'Não interessado',
  'Sem resposta após acompanhamento',
];

const ALL_PLATFORMS: InfluencerRecord['platform'][] = [
  'Instagram',
  'Grupo de Facebook',
  'YouTube',
  'TikTok',
];

const RESPONSE_OPTIONS: InfluencerRecord['responseReceived'][] = [
  'Pendente',
  'Positiva (Autorizou)',
  'Com dúvidas',
  'Recusou',
  'Sem resposta',
];

// Grupo visual do Kanban — faixa colorida no header para leitura de funil
type KanbanGroup = 'Prospecção' | 'Contato' | 'Negociação' | 'Execução' | 'Saídas';
const STATUS_GROUP: Record<InfluencerRecord['status'], KanbanGroup> = {
  'A pesquisar': 'Prospecção',
  'Selecionado': 'Prospecção',
  'Primeiro contato enviado': 'Contato',
  'Aguardando resposta': 'Contato',
  'Aguardando sistema IOS': 'Contato',
  'Autorizou o envio': 'Contato',
  'Material enviado': 'Negociação',
  'Em avaliação': 'Negociação',
  'Parceria aprovada': 'Negociação',
  'Em execução': 'Execução',
  'Encerrado': 'Execução',
  'Não interessado': 'Saídas',
  'Sem resposta após acompanhamento': 'Saídas',
};

const GROUP_ACCENT: Record<KanbanGroup, string> = {
  'Prospecção': 'bg-slate-400',
  'Contato': 'bg-amber-500',
  'Negociação': 'bg-violet-600',
  'Execução': 'bg-emerald-600',
  'Saídas': 'bg-red-400',
};

// Paleta semântica por status — alinhada ao design system existente (violet-700 primário)
const STATUS_STYLE: Record<InfluencerRecord['status'], { dot: string; badge: string; border: string }> = {
  'A pesquisar': { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700 border-slate-200', border: 'border-slate-200' },
  'Selecionado': { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200', border: 'border-blue-200' },
  'Primeiro contato enviado': { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-800 border-amber-200', border: 'border-amber-200' },
  'Aguardando resposta': { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-800 border-orange-200', border: 'border-orange-200' },
  'Aguardando sistema IOS': { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-800 border-sky-200', border: 'border-sky-200' },
  'Autorizou o envio': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', border: 'border-emerald-200' },
  'Material enviado': { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700 border-violet-200', border: 'border-violet-200' },
  'Em avaliação': { dot: 'bg-violet-600', badge: 'bg-violet-50 text-violet-800 border-violet-200', border: 'border-violet-200' },
  'Parceria aprovada': { dot: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', border: 'border-emerald-200' },
  'Em execução': { dot: 'bg-teal-600', badge: 'bg-teal-50 text-teal-800 border-teal-200', border: 'border-teal-200' },
  'Encerrado': { dot: 'bg-slate-700', badge: 'bg-slate-800 text-white border-slate-700', border: 'border-slate-300' },
  'Não interessado': { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200', border: 'border-red-200' },
  'Sem resposta após acompanhamento': { dot: 'bg-zinc-400', badge: 'bg-zinc-100 text-zinc-700 border-zinc-200', border: 'border-zinc-200' },
};

// Fallback seguro para status desconhecido (evita crash no render)
const DEFAULT_STATUS_STYLE = { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-700 border-gray-200', border: 'border-gray-200' };
function getStatusStyle(status: string) {
  return STATUS_STYLE[status as InfluencerRecord['status']] ?? DEFAULT_STATUS_STYLE;
}

const PLATFORM_STYLE: Record<InfluencerRecord['platform'], string> = {
  'Instagram': 'bg-gradient-to-br from-pink-50 to-orange-50 text-pink-700 border-pink-200',
  'Grupo de Facebook': 'bg-blue-50 text-blue-700 border-blue-200',
  'YouTube': 'bg-red-50 text-red-700 border-red-200',
  'TikTok': 'bg-zinc-900 text-white border-zinc-800',
};

const DEFAULT_PLATFORM_STYLE = 'bg-gray-50 text-gray-700 border-gray-200';
function getPlatformStyle(platform: string) {
  return PLATFORM_STYLE[platform as InfluencerRecord['platform']] ?? DEFAULT_PLATFORM_STYLE;
}

function platformIcon(platform: InfluencerRecord['platform'] | string) {
  if (platform === 'Instagram') return <Instagram className="w-3 h-3" aria-hidden />;
  if (platform === 'YouTube') return <Youtube className="w-3 h-3" aria-hidden />;
  if (platform === 'Grupo de Facebook') return <Facebook className="w-3 h-3" aria-hidden />;
  return <Music2 className="w-3 h-3" aria-hidden />;
}

// ---------------------------------------------------------------------------
// Form helpers
// ---------------------------------------------------------------------------
type ViewMode = 'tabela' | 'kanban';
type Toast = { id: number; message: string; variant: 'success' | 'error' };

const EMPTY_FORM: Omit<InfluencerRecord, 'id'> = {
  nameOrHandle: '',
  platform: 'Instagram',
  link: '',
  audienceType: '',
  justification: '',
  firstContactDate: new Date().toISOString().slice(0, 10),
  status: 'A pesquisar',
  responseReceived: 'Pendente',
  proposalSent: false,
  videosSent: false,
  nextAction: '',
  notes: '',
  tipo: '',
};

function isValidDateYYYYMMDD(v: string) {
  if (!v) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PipelinePage() {
  // Data
  const [records, setRecords] = useState<InfluencerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & view
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('TODOS');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [segmentationFilter, setSegmentationFilter] = useState<string>('TODOS');
  const [tipoFilter, setTipoFilter] = useState<string>('TODOS');
  const [view, setView] = useState<ViewMode>('tabela');

  // CRUD UI
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InfluencerRecord | null>(null);
  const [formData, setFormData] = useState<Omit<InfluencerRecord, 'id'>>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<InfluencerRecord | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Kanban drag
  const [dragOverStatus, setDragOverStatus] = useState<InfluencerRecord['status'] | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  // Colaboradores online
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [onlineLoading, setOnlineLoading] = useState(true);

  const fetchOnline = useCallback(async () => {
    try {
      const res = await getOnlineUsers();
      setOnlineUsers(res.online);
    } catch {
      setOnlineUsers([]);
    } finally {
      setOnlineLoading(false);
    }
  }, []);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastSeq = useRef(1);
  const pushToast = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    const id = toastSeq.current++;
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listInfluencers();
      setRecords(list);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.status === 401
            ? 'Sessão expirada — faça login novamente para persistir no MySQL. Exibindo fichas locais.'
            : e.message
          : e instanceof Error
            ? e.message
            : 'Falha ao carregar fichas.';
      setError(msg);
      // Fallback: mantém mocks locais para operador não ficar bloqueado
      setRecords(INITIAL_INFLUENCER_RECORDS);
      if (!(e instanceof ApiError && e.status === 401)) {
        pushToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  // Auto-refresh: busca novos registros a cada 5s para atualizar em tempo real
  // quando a extensão do navegador salva novos leads no banco
  const fetchRecordsSilent = useCallback(async () => {
    try {
      const list = await listInfluencers();
      setRecords((prev) => {
        // Só atualiza se houve mudança (evita re-render desnecessário)
        if (JSON.stringify(prev) !== JSON.stringify(list)) {
          return list;
        }
        return prev;
      });
    } catch {
      // Silencioso: não mostra erro em polling automático
    }
  }, []);

  useEffect(() => {
    void fetchRecords();
    void fetchOnline();
    // Polling de registros a cada 5s para atualização em tempo real
    const recordsInterval = setInterval(() => void fetchRecordsSilent(), 5_000);
    const onlineInterval = setInterval(() => void fetchOnline(), 30_000);
    return () => {
      clearInterval(recordsInterval);
      clearInterval(onlineInterval);
    };
  }, [fetchRecords, fetchRecordsSilent, fetchOnline]);

  const [showOnlinePanel, setShowOnlinePanel] = useState(false);

  // Detecta logout em outra aba (sessionStorage xaigoo_active removido) → limpa online instantaneamente
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'xaigoo_active' && e.newValue === null) {
        setOnlineUsers([]);
        setOnlineLoading(false);
        void fetchOnline();
      }
    };
    const onLogout = () => {
      setOnlineUsers([]);
      setOnlineLoading(false);
      void fetchOnline();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('xaigoo:logout', onLogout as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('xaigoo:logout', onLogout as EventListener);
    };
  }, [fetchOnline]);

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (platformFilter !== 'TODOS' && r.platform !== platformFilter) return false;
      if (statusFilter !== 'TODOS' && r.status !== statusFilter) return false;
      if (segmentationFilter !== 'TODOS') {
        if (segmentationFilter === 'LEVEL1' && r.segmentation_level !== 1) return false;
        if (segmentationFilter === 'LEVEL2' && r.segmentation_level !== 2) return false;
        if (segmentationFilter === 'NULL' && (r.segmentation_level !== null && r.segmentation_level !== undefined)) return false;
      }
      if (tipoFilter !== 'TODOS' && r.tipo !== tipoFilter) return false;
      if (!q) return true;
      const hay = `${r.nameOrHandle} ${r.audienceType} ${r.nextAction} ${r.notes} ${r.platform} ${r.status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [records, search, platformFilter, statusFilter, segmentationFilter, tipoFilter]);

  // Export CSV — todos 12 campos + headers pt-BR (espelha Chapter9)
  const handleExportCSV = useCallback(() => {
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
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = filteredRecords.map((r) => [
      esc(r.nameOrHandle),
      esc(r.platform),
      esc(r.link),
      esc(r.audienceType),
      esc(r.justification),
      esc(r.firstContactDate),
      esc(r.status),
      esc(r.responseReceived),
      r.proposalSent ? 'Sim' : 'Nao',
      r.videosSent ? 'Sim' : 'Nao',
      esc(r.nextAction),
      esc(r.notes),
    ]);
    const csv = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xaigoo_pipeline_fichas.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    pushToast(`CSV exportado — ${filteredRecords.length} fichas.`);
  }, [filteredRecords, pushToast]);

  // Form open helpers
  const openCreate = useCallback(() => {
    setEditingRecord(null);
    setFormData({ ...EMPTY_FORM, firstContactDate: new Date().toISOString().slice(0, 10) });
    setFormErrors({});
    setShowForm(true);
  }, []);
  const openEdit = useCallback((rec: InfluencerRecord) => {
    setEditingRecord(rec);
    setFormData({
      nameOrHandle: rec.nameOrHandle,
      platform: rec.platform,
      link: rec.link,
      audienceType: rec.audienceType,
      justification: rec.justification,
      firstContactDate: rec.firstContactDate,
      status: rec.status,
      responseReceived: rec.responseReceived,
      proposalSent: rec.proposalSent,
      videosSent: rec.videosSent,
      nextAction: rec.nextAction,
      notes: rec.notes,
    });
    setFormErrors({});
    setShowForm(true);
    setSelectedId(rec.id);
  }, []);

  const validateForm = useCallback((): boolean => {
    const fe: Record<string, string> = {};
    if (!formData.nameOrHandle.trim()) fe.nameOrHandle = 'Nome ou @ é obrigatório.';
    if (!ALL_PLATFORMS.includes(formData.platform)) fe.platform = 'Plataforma inválida.';
    if (!ALL_STATUSES.includes(formData.status)) fe.status = 'Status inválido.';
    if (formData.firstContactDate && !isValidDateYYYYMMDD(formData.firstContactDate)) fe.firstContactDate = 'Data deve ser YYYY-MM-DD válida.';
    if (formData.link && formData.link.length > 0) {
      try {
        const u = new URL(formData.link);
        if (!['http:', 'https:'].includes(u.protocol)) fe.link = 'Link deve começar com https://';
      } catch {
        fe.link = 'Link inválido — use https://...';
      }
    }
    setFormErrors(fe);
    return Object.keys(fe).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsSubmitting(true);
      const payload: CreateInfluencerPayload = {
        nameOrHandle: formData.nameOrHandle.trim(),
        platform: formData.platform,
        link: formData.link.trim(),
        audienceType: formData.audienceType.trim(),
        justification: formData.justification.trim(),
        firstContactDate: formData.firstContactDate,
        status: formData.status,
        responseReceived: formData.responseReceived,
        proposalSent: formData.proposalSent,
        videosSent: formData.videosSent,
        nextAction: formData.nextAction.trim(),
        notes: formData.notes.trim(),
      };
      try {
        if (editingRecord) {
          const updated = await updateInfluencer(editingRecord.id, payload);
          setRecords((prev) => prev.map((r) => (r.id === editingRecord.id ? updated : r)));
          pushToast('Ficha atualizada.');
        } else {
          const created = await createInfluencer(payload);
          setRecords((prev) => [created, ...prev]);
          pushToast('Ficha criada.');
        }
        setShowForm(false);
        setEditingRecord(null);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Erro ao salvar.';
        pushToast(msg, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingRecord, formData, pushToast, validateForm],
  );

  const handleDelete = useCallback(
    async (rec: InfluencerRecord) => {
      try {
        await deleteInfluencer(rec.id);
        setRecords((prev) => prev.filter((r) => r.id !== rec.id));
        pushToast('Ficha removida.');
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Erro ao remover.';
        pushToast(msg, 'error');
      } finally {
        setConfirmDelete(null);
      }
    },
    [pushToast],
  );

  // Inline status change — otimista com rollback
  const handleInlineStatus = useCallback(
    async (id: string, newStatus: InfluencerRecord['status']) => {
      const prev = records.find((r) => r.id === id);
      if (!prev || prev.status === newStatus) return;
      setRecords((p) => p.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      try {
        const updated = await updateInfluencerStatus(id, newStatus);
        setRecords((p) => p.map((r) => (r.id === id ? updated : r)));
        pushToast(`Status → ${newStatus}`);
      } catch (err) {
        setRecords((p) => p.map((r) => (r.id === id ? prev : r)));
        const msg = err instanceof ApiError ? err.message : 'Erro ao atualizar status.';
        pushToast(msg, 'error');
      }
    },
    [records, pushToast],
  );

  const handleToggleCheck = useCallback(
    async (rec: InfluencerRecord, field: 'proposalSent' | 'videosSent') => {
      const nextVal = !rec[field];
      setRecords((p) => p.map((r) => (r.id === rec.id ? { ...r, [field]: nextVal } : r)));
      try {
        const updated = await updateInfluencer(rec.id, ({ [field]: nextVal } as unknown) as CreateInfluencerPayload);
        setRecords((p) => p.map((r) => (r.id === rec.id ? updated : r)));
        pushToast(nextVal ? 'Marcado.' : 'Desmarcado.');
      } catch (err) {
        setRecords((p) => p.map((r) => (r.id === rec.id ? rec : r)));
        const msg = err instanceof ApiError ? err.message : 'Erro ao atualizar.';
        pushToast(msg, 'error');
      }
    },
    [pushToast],
  );

  // Drag-and-drop nativo para Kanban
  const onKanbanDragStart = useCallback((e: React.DragEvent, id: string) => {
    draggedIdRef.current = id;
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);
  const onKanbanDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  const onKanbanDrop = useCallback(
    async (e: React.DragEvent, targetStatus: InfluencerRecord['status']) => {
      e.preventDefault();
      const id = draggedIdRef.current || e.dataTransfer.getData('text/plain');
      setDragOverStatus(null);
      draggedIdRef.current = null;
      if (!id) return;
      const rec = records.find((r) => r.id === id);
      if (!rec || rec.status === targetStatus) return;
      await handleInlineStatus(id, targetStatus);
    },
    [records, handleInlineStatus],
  );

  const kanbanGrouped = useMemo(() => {
    const map = new Map<InfluencerRecord['status'], InfluencerRecord[]>();
    for (const s of ALL_STATUSES) map.set(s, []);
    for (const r of filteredRecords) {
      const arr = map.get(r.status);
      if (arr) arr.push(r);
    }
    return map;
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Botão flutuante lateral esquerdo — abaixo do cabeçalho, Colaboradores online */}
      <button
        type="button"
        aria-label={showOnlinePanel ? 'Ocultar colaboradores' : 'Mostrar colaboradores online'}
        aria-expanded={showOnlinePanel}
        onClick={() => setShowOnlinePanel((p) => !p)}
        className="fixed left-0 top-20 z-40 hidden lg:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-r-full shadow-md hover:shadow-lg hover:bg-violet-50 transition-all duration-200"
      >
        {showOnlinePanel ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-600" />}
        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
          {showOnlinePanel ? 'Ocultar' : 'Colaboradores'}
        </span>
        <span className={`w-2 h-2 rounded-full ${onlineLoading ? 'bg-slate-300' : onlineUsers.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
      </button>

      {/* Painel lateral esquerdo — Colaboradores online */}
      {showOnlinePanel && (
        <aside className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 bg-white border-r border-slate-200 shadow-2xl flex flex-col rounded-b-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-violet-50/50 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-700" />
              <h2 className="text-sm font-bold text-slate-900 font-display">Colaboradores Online</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowOnlinePanel(false)}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"
              aria-label="Fechar painel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {onlineLoading && onlineUsers.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Carregando...
              </div>
            ) : onlineUsers.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-400">
                Nenhum colaborador online no momento.
              </div>
            ) : (
              <ul className="space-y-1 px-2">
                {onlineUsers.map((u) => (
                  <li key={u.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      )}

      {/* Page header — container 1440 */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500">
            <li className="font-medium">Portal</li>
            <li aria-hidden className="text-slate-400">/</li>
            <li className="font-semibold text-violet-700" aria-current="page">Pipeline</li>
          </ol>
        </nav>

        {/* Title */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-display">Pipeline</h1>
            <p className="text-sm leading-relaxed text-slate-600 max-w-3xl">
              Automação de leads
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
              {records.length} fichas no pipeline
            </span>
          </div>
        </div>

        {/* View tabs — pill premium (bg-slate-100 rounded-full) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div
            role="tablist"
            aria-label="Modo de visualização do Pipeline"
            className="inline-flex p-1 bg-slate-100 border border-slate-200/60 rounded-full self-start"
          >
            <button
              role="tab"
              aria-selected={view === 'tabela'}
              onClick={() => setView('tabela')}
              className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                view === 'tabela' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" aria-hidden />
              Ficha
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${view === 'tabela' ? 'bg-violet-50 text-violet-700 border border-violet-200' : 'bg-white text-slate-600 border border-slate-200'}`}>{filteredRecords.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={view === 'kanban'}
              onClick={() => setView('kanban')}
              className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                view === 'kanban' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" aria-hidden />
              Kanban
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white text-[13px] font-semibold shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2"
            >
              <Plus className="w-4 h-4" aria-hidden />
              Nova ficha
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-semibold shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
            >
              <Download className="w-4 h-4" aria-hidden />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Error banner — banner red-50 com retry */}
        {error && (
          <div role="alert" className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
            <span className="inline-flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-700 shrink-0" aria-hidden />
              <span>{error}</span>
            </span>
            <button
              onClick={() => void fetchRecords()}
              className="inline-flex items-center justify-center h-8 px-3 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-50 transition-colors cursor-pointer shrink-0"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Toolbar — busca + filtros + contador */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, @, audiência, próxima ação…"
                aria-label="Buscar fichas"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-colors"
              />
            </div>
            {/* Platform */}
            <div className="relative">
              <label htmlFor="pipeline-platform" className="sr-only">Filtrar por plataforma</label>
              <select
                id="pipeline-platform"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer min-w-[170px] appearance-none [-webkit-appearance:none] [-moz-appearance:none] [&::-ms-expand]:hidden"
              >
                <option value="TODOS">Todas plataformas</option>
                {ALL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
            </div>
            {/* Status */}
            <div className="relative">
              <label htmlFor="pipeline-status" className="sr-only">Filtrar por status</label>
              <select
                id="pipeline-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer min-w-[210px] appearance-none [-webkit-appearance:none] [-moz-appearance:none] [&::-ms-expand]:hidden"
              >
                <option value="TODOS">Todos os status</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
            </div>
            {/* Nível de Segmentação IA */}
            <div className="relative">
              <label htmlFor="pipeline-segmentation" className="sr-only">Filtrar por nível IA</label>
              <select
                id="pipeline-segmentation"
                value={segmentationFilter}
                onChange={(e) => setSegmentationFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer min-w-[210px] appearance-none [-webkit-appearance:none] [-moz-appearance:none] [&::-ms-expand]:hidden"
              >
                <option value="TODOS">Todos níveis IA</option>
                <option value="LEVEL1">Nível 1 (Forte aderência)</option>
                <option value="LEVEL2">Nível 2 (Neutro/Fora do nicho)</option>
                <option value="NULL">Sem classificação IA</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
            </div>
            {/* Tipo (Insiders / Motorista) */}
            <div className="relative">
              <label htmlFor="pipeline-tipo" className="sr-only">Filtrar por tipo</label>
              <select
                id="pipeline-tipo"
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer min-w-[180px] appearance-none [-webkit-appearance:none] [-moz-appearance:none] [&::-ms-expand]:hidden"
              >
                <option value="TODOS">Todos os tipos</option>
                <option value="Insiders">Insiders</option>
                <option value="Motorista">Motorista</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
            </div>
            {/* Count */}
            <div className="inline-flex items-center justify-center h-10 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold tabular-nums shrink-0">
              {filteredRecords.length} fichas
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Carregando fichas">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-slate-200 rounded" />
                    <div className="h-4 w-48 bg-slate-200 rounded" />
                  </div>
                  <div className="h-8 w-40 bg-slate-200 rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="h-10 bg-slate-100 rounded-lg" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
              Carregando fichas do MySQL…
            </div>
          </div>
        ) : filteredRecords.length === 0 ? (
          /* Empty state */
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Users className="w-6 h-6" aria-hidden />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Nenhuma ficha encontrada</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Ajuste os filtros ou cadastre a primeira ficha para começar a operar o pipeline STEP 1.
              </p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden />
              Nova ficha
            </button>
          </div>
        ) : view === 'tabela' ? (
          /* ===================== FICHA — Lista + CRUD ===================== */
          <div className="space-y-4">
            {/* Desktop table */}
            <div className="hidden lg:block bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                        <th className="text-left px-4 py-3 whitespace-nowrap">Influenciador</th>
                        <th className="text-left px-4 py-3 whitespace-nowrap">Audiência</th>
                        <th className="text-left px-4 py-3 whitespace-nowrap">Status</th>
                        <th className="text-left px-4 py-3 whitespace-nowrap">Tipo</th>
                        <th className="text-left px-4 py-3 whitespace-nowrap">1º contato</th>
                        <th className="text-left px-4 py-3 whitespace-nowrap">Check</th>
                        <th classnavn-class="text-right px-4 py-3 whitespace-nowrap">Ações</th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((rec) => {
                      const ss = getStatusStyle(rec.status);
                      const isSelected = selectedId === rec.id;
                      return (
                        <tr
                          key={rec.id}
                          onClick={() => setSelectedId(rec.id)}
                          className={`group transition-colors ${isSelected ? 'bg-violet-50/60' : 'hover:bg-slate-50'}`}
                        >
                          <td className="px-4 py-3 align-top min-w-[220px]">
                            <div className="flex items-start gap-2.5">
                              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${ss.dot}`} aria-hidden />
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate max-w-[220px]" title={rec.nameOrHandle}>
                                  {rec.nameOrHandle}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[11px] font-semibold ${getPlatformStyle(rec.platform)}`}>
                                    {platformIcon(rec.platform)}
                                    {rec.platform}
                                  </span>
                                  {rec.link && (
                                    <a
                                      href={rec.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-violet-700 truncate max-w-[140px]"
                                      title={rec.link}
                                    >
                                      <Link2 className="w-3 h-3 shrink-0" aria-hidden />
                                      <span className="truncate">{rec.link.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top max-w-[200px]">
                            <span className="text-slate-600 line-clamp-2 leading-snug" title={rec.audienceType}>
                              {rec.audienceType || <span className="text-slate-400">—</span>}
                            </span>
                            {rec.nextAction && (
                              <div className="mt-1 text-xs text-violet-700 font-medium line-clamp-1" title={rec.nextAction}>
                                → {rec.nextAction}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 align-top">
                            {rec.tipo || <span className="text-slate-400">—</span>}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <label className="sr-only" htmlFor={`status-${rec.id}`}>Status de {rec.nameOrHandle}</label>
                            <select
                              id={`status-${rec.id}`}
                              value={rec.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                void handleInlineStatus(rec.id, e.target.value as InfluencerRecord['status']);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`h-8 pl-2 pr-7 rounded-full border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer ${ss.badge}`}
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <div className="mt-1 text-[11px] text-slate-500 font-mono">{rec.responseReceived}</div>
                            {rec.segmentation_level !== null && rec.segmentation_level !== undefined && (
                              <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                rec.segmentation_level === 1
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }">
                                IA: {rec.segmentation_level}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 align-top whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-700">
                              <CalendarDays className="w-3 h-3 text-slate-400" aria-hidden />
                              {rec.firstContactDate || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-col gap-1">
                              <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={rec.proposalSent}
                                  onChange={() => void handleToggleCheck(rec, 'proposalSent')}
                                  className="h-3.5 w-3.5 rounded border-slate-300 accent-violet-600"
                                />
                                <span className={rec.proposalSent ? 'text-slate-900 font-medium' : 'text-slate-600'}>Proposta</span>
                              </label>
                              <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={rec.videosSent}
                                  onChange={() => void handleToggleCheck(rec, 'videosSent')}
                                  className="h-3.5 w-3.5 rounded border-slate-300 accent-violet-600"
                                />
                                <span className={rec.videosSent ? 'text-slate-900 font-medium' : 'text-slate-600'}>Vídeos 1+2</span>
                              </label>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEdit(rec);
                                }}
                                aria-label={`Editar ${rec.nameOrHandle}`}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-violet-700 hover:border-violet-200 hover:bg-violet-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
                              >
                                <Pencil className="w-3.5 h-3.5" aria-hidden />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(rec);
                                }}
                                aria-label={`Excluir ${rec.nameOrHandle}`}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards — mesma ficha do Chapter9 refinada para produção */}
            <div className="lg:hidden grid gap-3">
              {filteredRecords.map((rec) => {
                const ss = getStatusStyle(rec.status);
                return (
                  <article
                    key={rec.id}
                    onClick={() => setSelectedId(rec.id)}
                    className={`bg-white border rounded-xl p-4 space-y-3 shadow-sm hover:shadow transition-all duration-150 ${selectedId === rec.id ? 'border-violet-300 ring-1 ring-violet-200' : 'border-slate-200'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${getPlatformStyle(rec.platform)}`}>
                            {platformIcon(rec.platform)}
                            {rec.platform}
                          </span>
                          <span className="font-mono flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" aria-hidden />
                            {rec.firstContactDate}
                          </span>
                          {rec.segmentation_level !== null && rec.segmentation_level !== undefined && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              rec.segmentation_level === 1
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              IA: {rec.segmentation_level}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 text-sm font-bold text-slate-900 font-display leading-snug break-words">{rec.nameOrHandle}</h3>
                        {rec.link && (
                          <a
                            href={rec.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-violet-700 hover:underline break-all"
                          >
                            <Link2 className="w-3 h-3 shrink-0" aria-hidden />
                            {rec.link}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(rec);
                          }}
                          className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 active:bg-slate-50"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" aria-hidden />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(rec);
                          }}
                          className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 active:bg-red-50 active:text-red-600"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-2 text-xs">
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                        <div className="font-semibold text-slate-900">Audiência</div>
                        <div className="text-slate-600 leading-snug">{rec.audienceType || '—'}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                        <div className="font-semibold text-slate-900">Justificativa</div>
                        <div className="text-slate-600 leading-snug">{rec.justification || '—'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="sr-only" htmlFor={`m-status-${rec.id}`}>Status</label>
                        <select
                          id={`m-status-${rec.id}`}
                          value={rec.status}
                          onChange={(e) => void handleInlineStatus(rec.id, e.target.value as InfluencerRecord['status'])}
                          onClick={(e) => e.stopPropagation()}
                          className={`flex-1 h-9 px-3 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200 ${ss.badge}`}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-slate-600">
                          <strong className="text-slate-900">Resp:</strong> {rec.responseReceived}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-violet-700 font-medium line-clamp-1">→ {rec.nextAction || 'Sem próxima ação'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                      <label className="inline-flex items-center gap-2 text-xs font-medium" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={rec.proposalSent} onChange={() => void handleToggleCheck(rec, 'proposalSent')} className="h-4 w-4 accent-violet-600 rounded" />
                        Proposta {rec.proposalSent ? '✓' : '—'}
                      </label>
                      <label className="inline-flex items-center gap-2 text-xs font-medium" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={rec.videosSent} onChange={() => void handleToggleCheck(rec, 'videosSent')} className="h-4 w-4 accent-violet-600 rounded" />
                        Vídeos {rec.videosSent ? '✓' : '—'}
                      </label>
                      {rec.notes && <span className="text-xs text-slate-600 truncate flex-1">Obs: {rec.notes}</span>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          /* ===================== KANBAN — Gestão por colunas ===================== */
          <div className="space-y-3">
            {/* Kanban helper bar — conta e dica drag */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-600" aria-hidden />
                Arraste os cards entre colunas para mover o estágio (ou use o select no card em mobile).
              </span>
              <span className="font-mono text-slate-500">{filteredRecords.length} cards visíveis</span>
            </div>

            {/* Scroll horizontal — 12 colunas */}
            <div className="overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
              <div className="flex gap-3 min-w-max snap-x snap-mandatory">
                {ALL_STATUSES.map((colStatus) => {
                  const colRecords = kanbanGrouped.get(colStatus) ?? [];
                  const group: KanbanGroup = STATUS_GROUP[colStatus];
                  const accent = GROUP_ACCENT[group];
                  const isDragOver = dragOverStatus === colStatus;
                  const style = getStatusStyle(colStatus);
                  return (
                    <section
                      key={colStatus}
                      onDragOver={onKanbanDragOver}
                      onDragEnter={() => setDragOverStatus(colStatus)}
                      onDragLeave={(e) => {
                        const rt = e.currentTarget as HTMLElement;
                        if (!rt.contains(e.relatedTarget as Node)) setDragOverStatus(null);
                      }}
                      onDrop={(e) => void onKanbanDrop(e, colStatus)}
                      className={`snap-start shrink-0 w-[288px] sm:w-[300px] flex flex-col rounded-xl border bg-white shadow-sm transition-colors duration-150 ${isDragOver ? 'border-violet-400 ring-2 ring-violet-200 bg-violet-50/60' : 'border-slate-200'}`}
                      aria-label={`Coluna ${colStatus}`}
                    >
                      {/* Header com faixa de grupo + badge count */}
                      <div className="sticky top-0 z-10 rounded-t-xl overflow-hidden">
                        <div className={`h-1 w-full ${accent}`} aria-hidden />
                        <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-white border-b border-slate-100">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} aria-hidden />
                            <h3 className="text-xs font-bold text-slate-900 truncate" title={colStatus}>
                              {colStatus}
                            </h3>
                          </div>
                          <span
                            className={`inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-[11px] font-bold tabular-nums border ${colRecords.length > 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                          >
                            {colRecords.length}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-slate-50 border-b border-slate-100 text-[11px] font-mono text-slate-500">
                          {group}
                        </div>
                      </div>

                      {/* Body cards */}
                      <div className={`flex-1 p-2.5 space-y-2.5 min-h-[220px] ${isDragOver ? 'bg-violet-50/40' : 'bg-slate-50/50'}`}>
                        {colRecords.length === 0 ? (
                          <div className="h-[88px] rounded-xl border-2 border-dashed border-slate-200 bg-white/60 flex flex-col items-center justify-center gap-1 text-xs text-slate-400">
                            <Clock3 className="w-4 h-4" aria-hidden />
                            Solte um card aqui
                          </div>
                        ) : (
                          colRecords.map((rec) => (
                            <article
                              key={rec.id}
                              draggable
                              onDragStart={(e) => onKanbanDragStart(e, rec.id)}
                              onDragEnd={() => {
                                draggedIdRef.current = null;
                                setDragOverStatus(null);
                              }}
                              className="group bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-slate-300 cursor-grab active:cursor-grabbing transition-all duration-150"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 flex-1" title={rec.nameOrHandle}>
                                  {rec.nameOrHandle}
                                </h4>
                                <div className="flex items-center gap-1.5">
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${getPlatformStyle(rec.platform)}`}>
                                    {platformIcon(rec.platform)}
                                    <span className="hidden sm:inline">{rec.platform === 'Grupo de Facebook' ? 'FB Grupo' : rec.platform}</span>
                                  </span>
                                  {rec.segmentation_level !== null && rec.segmentation_level !== undefined && (
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                                      rec.segmentation_level === 1
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                      IA: {rec.segmentation_level}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="mt-1.5 text-xs text-slate-600 line-clamp-1" title={rec.audienceType}>
                                {rec.audienceType || 'Sem audiência descrita'}
                              </div>
                              {rec.nextAction && (
                                <div className="mt-1.5 flex items-start gap-1 text-xs text-violet-700 font-medium line-clamp-2 leading-snug" title={rec.nextAction}>
                                  <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" aria-hidden />
                                  <span className="line-clamp-2">{rec.nextAction}</span>
                                </div>
                              )}
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                                  <CalendarDays className="w-3 h-3" aria-hidden />
                                  {rec.firstContactDate || '—'}
                                </span>
                                <div className="flex items-center gap-1">
                                  {rec.link && (
                                    <a
                                      href={rec.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-violet-700 hover:border-violet-200"
                                      aria-label="Abrir link"
                                      title={rec.link}
                                    >
                                      <Link2 className="w-3.5 h-3.5" aria-hidden />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => openEdit(rec)}
                                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-violet-700 hover:border-violet-200 cursor-pointer"
                                    aria-label="Editar"
                                  >
                                    <Pencil className="w-3.5 h-3.5" aria-hidden />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(rec)}
                                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 cursor-pointer"
                                    aria-label="Excluir"
                                  >
                                    <Trash2 className="w-3 h-3.5" aria-hidden />
                                  </button>
                                </div>
                              </div>
                              {/* Fallback mobile: mover por select */}
                              <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                                <label className="sr-only" htmlFor={`kanban-status-${rec.id}`}>Mover estágio</label>
                                <select
                                  id={`kanban-status-${rec.id}`}
                                  value={rec.status}
                                  onChange={(e) => void handleInlineStatus(rec.id, e.target.value as InfluencerRecord['status'])}
                                  className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                                >
                                  {ALL_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center sm:text-left lg:hidden">Deslize horizontalmente para ver as 12 colunas · toque e arraste o card (ou use o select).</p>
          </div>
        )}
      </div>

      {/* Form drawer/modal — Dialog backdrop slate-950/60, rounded-2xl, focus ring */}
      {showForm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pipeline-form-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h2 id="pipeline-form-title" className="text-base font-bold text-slate-900 font-display">
                  {editingRecord ? 'Editar ficha' : 'Nova ficha — 12 campos operacionais'}
                </h2>
                <p className="text-xs text-slate-600">Campos com * são obrigatórios.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" aria-hidden />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1 */}
                <div className="md:col-span-2">
                  <label htmlFor="f-name" className="block text-xs font-semibold text-slate-700 mb-1">1. Nome ou Perfil (@) *</label>
                  <input
                    id="f-name"
                    type="text"
                    value={formData.nameOrHandle}
                    onChange={(e) => setFormData((p) => ({ ...p, nameOrHandle: e.target.value }))}
                    placeholder="Ex: @motorista_real ou Nome do grupo"
                    aria-invalid={!!formErrors.nameOrHandle}
                    aria-describedby={formErrors.nameOrHandle ? 'f-name-err' : undefined}
                    className={`w-full h-10 px-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 ${formErrors.nameOrHandle ? 'border-red-300 focus:border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-violet-300'}`}
                  />
                  {formErrors.nameOrHandle && <p id="f-name-err" className="mt-1 text-xs text-red-600">{formErrors.nameOrHandle}</p>}
                </div>
                {/* 2 */}
                <div>
                  <label htmlFor="f-platform" className="block text-xs font-semibold text-slate-700 mb-1">2. Plataforma</label>
                  <select
                    id="f-platform"
                    value={formData.platform}
                    onChange={(e) => setFormData((p) => ({ ...p, platform: e.target.value as InfluencerRecord['platform'] }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                  >
                    {ALL_PLATFORMS.map((pl) => (<option key={pl} value={pl}>{pl}</option>))}
                  </select>
                  {formErrors.platform && <p className="mt-1 text-xs text-red-600">{formErrors.platform}</p>}
                </div>
                {/* 3 */}
                <div>
                  <label htmlFor="f-link" className="block text-xs font-semibold text-slate-700 mb-1">3. Link do Perfil / Comunidade</label>
                  <input
                    id="f-link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData((p) => ({ ...p, link: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    aria-invalid={!!formErrors.link}
                    className={`w-full h-10 px-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 ${formErrors.link ? 'border-red-300' : 'border-slate-200'}`}
                  />
                  {formErrors.link && <p className="mt-1 text-xs text-red-600">{formErrors.link}</p>}
                </div>
                {/* 4 */}
                <div className="md:col-span-2">
                  <label htmlFor="f-audience" className="block text-xs font-semibold text-slate-700 mb-1">4. Tipo de Audiência</label>
                  <input
                    id="f-audience"
                    type="text"
                    value={formData.audienceType}
                    onChange={(e) => setFormData((p) => ({ ...p, audienceType: e.target.value }))}
                    placeholder="Ex: Motoristas de app SP/RJ, iniciantes debatendo taxas..."
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
                {/* 5 */}
                <div className="md:col-span-2">
                  <label htmlFor="f-justification" className="block text-xs font-semibold text-slate-700 mb-1">5. Justificativa para Contato</label>
                  <textarea
                    id="f-justification"
                    value={formData.justification}
                    onChange={(e) => setFormData((p) => ({ ...p, justification: e.target.value }))}
                    placeholder="Por que esse perfil foi qualificado? Coerência com Xaigoo, engajamento, etc."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
                  />
                </div>
                {/* 6 */}
                <div>
                  <label htmlFor="f-date" className="block text-xs font-semibold text-slate-700 mb-1">6. Data do Primeiro Contato (YYYY-MM-DD)</label>
                  <input
                    id="f-date"
                    type="date"
                    value={formData.firstContactDate}
                    onChange={(e) => setFormData((p) => ({ ...p, firstContactDate: e.target.value }))}
                    aria-invalid={!!formErrors.firstContactDate}
                    className={`w-full h-10 px-3 rounded-xl border bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-200 ${formErrors.firstContactDate ? 'border-red-300' : 'border-slate-200'}`}
                  />
                  {formErrors.firstContactDate && <p className="mt-1 text-xs text-red-600">{formErrors.firstContactDate}</p>}
                </div>
                {/* 7 */}
                <div>
                  <label htmlFor="f-status" className="block text-xs font-semibold text-slate-700 mb-1">7. Status</label>
                  <select
                    id="f-status"
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as InfluencerRecord['status'] }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                {/* 8 */}
                <div>
                  <label htmlFor="f-response" className="block text-xs font-semibold text-slate-700 mb-1">8. Resposta Recebida</label>
                  <select
                    id="f-response"
                    value={formData.responseReceived}
                    onChange={(e) => setFormData((p) => ({ ...p, responseReceived: e.target.value as InfluencerRecord['responseReceived'] }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                  >
                    {RESPONSE_OPTIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
                  </select>
                </div>
                {/* 9. Tipo (Insiders / Motorista) */}
                <div>
                  <label htmlFor="f-tipo" className="block text-xs font-semibold text-slate-700 mb-1">9. Tipo (Insiders / Motorista)</label>
                  <select
                    id="f-tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData((p) => ({ ...p, tipo: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    <option value="Insiders">Insiders</option>
                    <option value="Motorista">Motorista</option>
                  </select>
                </div>
                {/* 10 e 11 — checkboxes */}
                <div className="flex flex-col gap-3 justify-end">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.proposalSent}
                      onChange={(e) => setFormData((p) => ({ ...p, proposalSent: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 accent-violet-600"
                    />
                    9. Proposta enviada
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.videosSent}
                      onChange={(e) => setFormData((p) => ({ ...p, videosSent: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 accent-violet-600"
                    />
                    10. Vídeos 1 e 2 enviados
                  </label>
                </div>
                {/* 11 */}
                <div className="md:col-span-2">
                  <label htmlFor="f-next" className="block text-xs font-semibold text-slate-700 mb-1">11. Próxima Ação</label>
                  <input
                    id="f-next"
                    type="text"
                    value={formData.nextAction}
                    onChange={(e) => setFormData((p) => ({ ...p, nextAction: e.target.value }))}
                    placeholder="Ex: Aguardar 48h; enviar 2 vídeos após autorizar"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
                {/* 12 */}
                <div className="md:col-span-2">
                  <label htmlFor="f-notes" className="block text-xs font-semibold text-slate-700 mb-1">12. Observações</label>
                  <textarea
                    id="f-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Anotações de conversa, dúvidas apresentadas, detalhes do perfil..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white text-sm font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : null}
                  {editingRecord ? 'Salvar alterações' : 'Criar ficha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-4 h-4" aria-hidden />
              </div>
              <div>
                <h3 id="confirm-delete-title" className="text-sm font-bold text-slate-900">Excluir ficha?</h3>
                <p className="text-sm text-slate-600 mt-1">
                  <strong className="text-slate-900">{confirmDelete.nameOrHandle}</strong> será removida permanentemente do MySQL (ou arquivo local se offline). Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleDelete(confirmDelete)}
                className="h-10 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts — optimistic + erro auto dismiss 3s */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto min-w-[280px] max-w-sm px-4 py-3 rounded-xl border shadow-lg text-sm font-medium flex items-start gap-2 ${t.variant === 'success' ? 'bg-slate-900 text-white border-slate-800' : 'bg-red-50 text-red-800 border-red-200'}`}
          >
            {t.variant === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" aria-hidden /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" aria-hidden />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Fechar notificação">
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
