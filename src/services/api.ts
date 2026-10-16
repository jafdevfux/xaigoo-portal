// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — API client (HomeHost xaigoo_links-pipeline via /api)
// Best practice: dev usa proxy relativo '/api' (Vite :3000 -> :3001) para evitar CORS/502.
// Produção (portal.xaigoo.app) também serve frontend+api no mesmo origin, então relativo é correto.
// Só use VITE_API_BASE absoluto quando realmente precisar de origin diferente (ex: preview).

const _envBase = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();
export const API_BASE: string =
  _envBase && _envBase !== '' && !_envBase.includes('localhost:3001') ? _envBase : '/api';

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// Normaliza base + path sem duplicar barras
function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = joinUrl(API_BASE, path);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão.', 0);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  let data: unknown = null;

  if (isJson) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      data = text ? { error: text } : null;
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const msg =
      data != null && typeof data === 'object' && 'error' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).error)
        : `Erro ${res.status}: ${res.statusText || 'requisição falhou'}`;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Exports exigidos
// ---------------------------------------------------------------------------

export function register(payload: RegisterPayload): Promise<User> {
  return fetchJson<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<User> {
  return fetchJson<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function me(): Promise<User> {
  return fetchJson<User>('/auth/me', {
    method: 'GET',
  });
}

export function logout(): Promise<{ ok: true }> {
  return fetchJson<{ ok: true }>('/auth/logout', {
    method: 'POST',
  });
}

export type HealthResponse = {
  status: string;
  db?: string;
  time?: string;
};

// ---------------------------------------------------------------------------
// Influencers — Pipeline (reexporta tipo canônico de operationalData.ts)
// ---------------------------------------------------------------------------

export type InfluencerRecord = {
  id: string;
  nameOrHandle: string;
  platform: 'Instagram' | 'Grupo de Facebook' | 'YouTube' | 'TikTok';
  link: string;
  audienceType: string;
  justification: string;
  firstContactDate: string;
  status:
    | 'A pesquisar'
    | 'Selecionado'
    | 'Primeiro contato enviado'
    | 'Aguardando resposta'
    | 'Aguardando sistema IOS'
    | 'Autorizou o envio'
    | 'Material enviado'
    | 'Em avaliação'
    | 'Parceria aprovada'
    | 'Em execução'
    | 'Encerrado'
    | 'Não interessado'
    | 'Sem resposta após acompanhamento';
  responseReceived: 'Pendente' | 'Positiva (Autorizou)' | 'Com dúvidas' | 'Recusou' | 'Sem resposta';
  proposalSent: boolean;
  videosSent: boolean;
  nextAction: string;
  notes: string;
  segmentation_level?: number | null; // 1 | 2 | null (IA off)
  created_at?: string;
  updated_at?: string;
};

export type CreateInfluencerPayload = {
  nameOrHandle: string;
  platform?: InfluencerRecord['platform'];
  link?: string;
  audienceType?: string;
  justification?: string;
  firstContactDate?: string;
  status?: InfluencerRecord['status'];
  responseReceived?: InfluencerRecord['responseReceived'];
  proposalSent?: boolean;
  videosSent?: boolean;
  nextAction?: string;
  notes?: string;
  tipo?: string; // 'Insiders' ou 'Motorista'
};

export type UpdateInfluencerPayload = Partial<CreateInfluencerPayload>;

export function listInfluencers(): Promise<InfluencerRecord[]> {
  return fetchJson<InfluencerRecord[]>('/influencers', { method: 'GET' });
}

export function getInfluencer(id: string): Promise<InfluencerRecord> {
  return fetchJson<InfluencerRecord>(`/influencers/${encodeURIComponent(id)}`, { method: 'GET' });
}

export function createInfluencer(payload: CreateInfluencerPayload): Promise<InfluencerRecord> {
  return fetchJson<InfluencerRecord>('/influencers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateInfluencer(id: string, patch: UpdateInfluencerPayload): Promise<InfluencerRecord> {
  return fetchJson<InfluencerRecord>(`/influencers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export function deleteInfluencer(id: string): Promise<{ ok: true }> {
  return fetchJson<{ ok: true }>(`/influencers/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function updateInfluencerStatus(
  id: string,
  status: InfluencerRecord['status']
): Promise<InfluencerRecord> {
  return fetchJson<InfluencerRecord>(`/influencers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export type OnlineUser = {
  id: string;
  name: string;
  email: string;
};

export type OnlineResponse = {
  online: OnlineUser[];
  count: number;
};

export function getOnlineUsers(): Promise<OnlineResponse> {
  return fetchJson<OnlineResponse>('/auth/online', { method: 'GET' });
}

/**
 * Health com fallback gracioso: quando DB não acessível local (HomeHost remoto)
 * retorna null em vez de throw, para UI não quebrar.
 * Outras chamadas (me/login/register) ainda propagam erro para exibir mensagem.
 */
export async function health(): Promise<HealthResponse | null> {
  try {
    return await fetchJson<HealthResponse>('/health', { method: 'GET' });
  } catch (e) {
    if (e instanceof ApiError) {
      // Fallback gracioso: DB offline local não deve derrubar o app
      if (e.status === 500 || e.status === 0) return null;
    }
    return null;
  }
}
