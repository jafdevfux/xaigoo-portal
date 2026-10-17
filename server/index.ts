// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — Dev API server :3001 (Express + MySQL remoto com fallback arquivo)
// Em produção (portal.xaigoo.app na HomeHost) a API PHP usa DB_HOST=localhost e funciona.
// Em dev local o MySQL remoto pode estar bloqueado por firewall; então este server tenta
// conectar no IP 216.198.79.1 e, se falhar, opera em modo arquivo local sem bloquear.

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV_USERS_FILE = path.join(__dirname, '.dev-users.json');
const DEV_INFLUENCERS_FILE = path.join(__dirname, '.dev-influencers.json');

const DB_CONFIG = {
  host: process.env.DB_HOST || '216.198.79.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'xaigoo_links-pipeline',
  password: process.env.DB_PASS || 'hr7V534bqqmHWzSSxS9J',
  database: process.env.DB_NAME || 'xaigoo_links-pipeline',
  waitForConnections: true,
  connectionLimit: 4,
  queueLimit: 0,
  connectTimeout: 4000,
} as const;

let pool: mysql.Pool | null = null;
let dbAvailable = false;

async function initDb(): Promise<void> {
  try {
    pool = mysql.createPool({ ...DB_CONFIG, charset: 'utf8mb4' } as any);
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    // Garantir tabela influencers existe (schema espelha database/init.sql)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`influencers\` (
        \`id\` VARCHAR(36) NOT NULL,
        \`name_or_handle\` VARCHAR(255) NOT NULL,
        \`platform\` ENUM('Instagram','Grupo de Facebook','YouTube','TikTok') DEFAULT NULL,
        \`link\` TEXT DEFAULT NULL,
        \`audience_type\` TEXT DEFAULT NULL,
        \`justification\` TEXT DEFAULT NULL,
        \`first_contact_date\` DATE DEFAULT NULL,
        \`status\` ENUM('A pesquisar','Selecionado','Primeiro contato enviado','Aguardando resposta','Aguardando sistema IOS','Autorizou o envio','Material enviado','Em avaliação','Parceria aprovada','Em execução','Encerrado','Não interessado','Sem resposta após acompanhamento') NOT NULL DEFAULT 'A pesquisar',
        \`response_received\` ENUM('Pendente','Positiva (Autorizou)','Com dúvidas','Recusou','Sem resposta') NOT NULL DEFAULT 'Pendente',
        \`proposal_sent\` TINYINT(1) NOT NULL DEFAULT 0,
        \`videos_sent\` TINYINT(1) NOT NULL DEFAULT 0,
        \`next_action\` TEXT DEFAULT NULL,
        \`notes\` TEXT DEFAULT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_status\` (\`status\`),
        KEY \`idx_updated\` (\`updated_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    const [tables] = await conn.query('SHOW TABLES');
    console.log('[db] conectado OK', { host: DB_CONFIG.host, tables: (tables as any[]).map((r: any) => Object.values(r)[0]) });
    console.log('[db] tabela influencers garantida (CREATE TABLE IF NOT EXISTS)');
    conn.release();
    dbAvailable = true;
  } catch (e: any) {
    console.warn('[db] remoto indisponível, modo arquivo local ativo:', e.code || e.message?.slice(0, 120));
    if (pool) { try { await pool.end(); } catch {} pool = null; }
    dbAvailable = false;
  }
}

// Fallback arquivo — users
type DevUser = { id: string; name: string; email: string; passwordHash: string; created_at: string; updated_at: string };
function loadDevUsers(): DevUser[] {
  try {
    if (!fs.existsSync(DEV_USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(DEV_USERS_FILE, 'utf-8')) as DevUser[];
  } catch { return []; }
}
function saveDevUsers(users: DevUser[]): void {
  fs.writeFileSync(DEV_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// ---------------------------------------------------------------------------
// Influencers — tipos, fallback arquivo, helpers validação/normalização
// ---------------------------------------------------------------------------
export type InfluencerPlatform = 'Instagram' | 'Grupo de Facebook' | 'YouTube' | 'TikTok';
export type InfluencerStatus =
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
export type InfluencerResponse = 'Pendente' | 'Positiva (Autorizou)' | 'Com dúvidas' | 'Recusou' | 'Sem resposta';

export interface InfluencerRecord {
  id: string;
  nameOrHandle: string;
  platform: InfluencerPlatform;
  link: string;
  audienceType: string;
  justification: string;
  firstContactDate: string;
  status: InfluencerStatus;
  responseReceived: InfluencerResponse;
  proposalSent: boolean;
  videosSent: boolean;
  nextAction: string;
  notes: string;
  hasMessageButton?: boolean | null; // 1=tem botão, 0=não tem, NULL=não verificado
  lastVisibilityCheck?: string | null; // YYYY-MM-DD HH:MM:SS
}

export type DevInfluencer = InfluencerRecord & { created_at: string; updated_at: string };

const VALID_PLATFORMS: readonly InfluencerPlatform[] = ['Instagram', 'Grupo de Facebook', 'YouTube', 'TikTok'] as const;
const VALID_STATUSES: readonly InfluencerStatus[] = [
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
] as const;
const VALID_RESPONSES: readonly InfluencerResponse[] = ['Pendente', 'Positiva (Autorizou)', 'Com dúvidas', 'Recusou', 'Sem resposta'] as const;

function isValidPlatform(v: unknown): v is InfluencerPlatform {
  return typeof v === 'string' && (VALID_PLATFORMS as readonly string[]).includes(v);
}
function isValidStatus(v: unknown): v is InfluencerStatus {
  return typeof v === 'string' && (VALID_STATUSES as readonly string[]).includes(v);
}
function isValidResponse(v: unknown): v is InfluencerResponse {
  return typeof v === 'string' && (VALID_RESPONSES as readonly string[]).includes(v);
}

const INFLUENCER_SEED: DevInfluencer[] = [
  {
    id: 'inf-1',
    nameOrHandle: '@carlos_motoristasp',
    platform: 'Instagram',
    link: 'https://instagram.com/carlos_motoristasp',
    audienceType: 'Motoristas de app em SP capital — foco em lucro por km e segurança',
    justification: 'Perfil com rotina real de corridas, calcula custo de combustível nos Reels e alta interação nos comentários de motoristas.',
    firstContactDate: '2026-10-10',
    status: 'A pesquisar',
    responseReceived: 'Pendente',
    proposalSent: false,
    videosSent: false,
    nextAction: 'Validar 7 critérios e mover para Selecionado',
    notes: 'Ficha de teste 1 — aparece na coluna A pesquisar do Kanban.',
    created_at: '2026-10-10 12:00:00',
    updated_at: '2026-10-10 12:00:00',
  },
  {
    id: 'inf-2',
    nameOrHandle: '@ana_uber_oficial',
    platform: 'YouTube',
    link: 'https://youtube.com/@ana_uber_oficial',
    audienceType: 'Motoristas profissionais e iniciantes — tutoriais de app e dashcam',
    justification: 'Conteúdo alinhado a câmera em segundo plano e alerta de áreas de risco do Copilot. Canal com boa retenção.',
    firstContactDate: '2026-10-09',
    status: 'Selecionado',
    responseReceived: 'Pendente',
    proposalSent: false,
    videosSent: false,
    nextAction: 'Enviar primeiro contato no Direct pedindo permissão',
    notes: 'Ficha de teste 2 — já na coluna Selecionado. Arraste no Kanban para testar.',
    created_at: '2026-10-09 12:00:00',
    updated_at: '2026-10-09 12:00:00',
  },
];

function loadDevInfluencers(): DevInfluencer[] {
  try {
    if (!fs.existsSync(DEV_INFLUENCERS_FILE)) {
      fs.writeFileSync(DEV_INFLUENCERS_FILE, JSON.stringify(INFLUENCER_SEED, null, 2), 'utf-8');
      return [...INFLUENCER_SEED];
    }
    const raw = fs.readFileSync(DEV_INFLUENCERS_FILE, 'utf-8').trim();
    if (!raw) {
      fs.writeFileSync(DEV_INFLUENCERS_FILE, JSON.stringify(INFLUENCER_SEED, null, 2), 'utf-8');
      return [...INFLUENCER_SEED];
    }
    const parsed = JSON.parse(raw) as DevInfluencer[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(DEV_INFLUENCERS_FILE, JSON.stringify(INFLUENCER_SEED, null, 2), 'utf-8');
      return [...INFLUENCER_SEED];
    }
    return parsed;
  } catch {
    try { fs.writeFileSync(DEV_INFLUENCERS_FILE, JSON.stringify(INFLUENCER_SEED, null, 2), 'utf-8'); } catch {}
    return [...INFLUENCER_SEED];
  }
}
function saveDevInfluencers(list: DevInfluencer[]): void {
  fs.writeFileSync(DEV_INFLUENCERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function formatDateYYYYMMDD(v: unknown): string {
  if (v == null || v === '') return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return s;
}
function formatDateTime(v: unknown): string {
  if (!v) return new Date().toISOString().slice(0, 19).replace('T', ' ');
  if (v instanceof Date) return v.toISOString().slice(0, 19).replace('T', ' ');
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 19).replace('T', ' ');
  return s;
}

function normalizeInfluencerRow(row: any): DevInfluencer {
  const firstContactDate = formatDateYYYYMMDD(row.first_contact_date ?? row.firstContactDate ?? '');
  const proposalSentRaw = row.proposal_sent ?? row.proposalSent;
  const videosSentRaw = row.videos_sent ?? row.videosSent;
  const hasMessageButtonRaw = row.has_message_button ?? row.hasMessageButton;
  const lastVisibilityCheckRaw = row.last_visibility_check ?? row.lastVisibilityCheck;
  const toBool = (val: unknown): boolean => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val === '1' || val.toLowerCase() === 'true';
    return Boolean(val);
  };
  return {
    id: String(row.id ?? ''),
    nameOrHandle: String(row.name_or_handle ?? row.nameOrHandle ?? ''),
    platform: (row.platform as InfluencerPlatform) ?? 'Instagram',
    link: String(row.link ?? ''),
    audienceType: String(row.audience_type ?? row.audienceType ?? ''),
    justification: String(row.justification ?? ''),
    firstContactDate,
    status: (row.status as InfluencerStatus) ?? 'A pesicionar',
    responseReceived: (row.response_received ?? row.responseReceived ?? 'Pendente') as InfluencerResponse,
    proposalSent: toBool(proposalSentRaw),
    videosSent: toBool(videosSentRaw),
    nextAction: String(row.next_action ?? row.nextAction ?? ''),
    notes: String(row.notes ?? ''),
    hasMessageButton: hasMessageButtonRaw != null ? toBool(hasMessageButtonRaw) : null,
    lastVisibilityCheck: lastVisibilityCheckRaw != null ? formatDateTime(lastVisibilityCheckRaw) : null,
    created_at: formatDateTime(row.created_at ?? row.createdAt ?? ''),
    updated_at: formatDateTime(row.updated_at ?? row.updatedAt ?? ''),
  };
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const uid = (req.session as any)?.user_id;
  if (!uid) {
    res.status(401).json({ error: 'Não autenticado.' });
    return;
  }
  next();
}

// Helpers auth
function isXaigooEmail(email: string): boolean {
  return /^[^@\s]+@xaigoo\.app$/i.test(email.trim());
}
function xaigooDomainError(): string {
  return 'Apenas contas @xaigoo.app são permitidas. Use seu e-mail corporativo Xaigoo.';
}
function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'Senha deve ter pelo menos 8 caracteres.';
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return 'Senha deve conter pelo menos 1 letra e 1 número.';
  return null;
}
function publicUser(row: any) {
  return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at ?? null, updatedAt: row.updated_at ?? null };
}

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://www.xaigoo.app', 'https://xaigoo.app', 'https://portal.xaigoo.app'],
  credentials: true,
}));
app.use(session({
  name: 'xaigoo_session',
  secret: process.env.SESSION_SECRET || 'xaigoo-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: undefined },
}));

// Health
app.get('/api/health', async (_req, res) => {
  if (dbAvailable && pool) {
    try { const c = await pool.getConnection(); await c.query('SELECT 1'); c.release(); return res.json({ status: 'ok', db: 'connected', mode: 'mysql', time: new Date().toISOString() }); }
    catch { return res.json({ status: 'ok', db: 'offline-fallback', mode: 'file', time: new Date().toISOString() }); }
  }
  res.json({ status: 'ok', db: dbAvailable ? 'connected' : 'offline-fallback', mode: dbAvailable ? 'mysql' : 'file', time: new Date().toISOString() });
});
app.get('/api/auth/health', (_req, res) => res.redirect(307, '/api/health'));

// Register
app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const emailRaw = String(req.body?.email ?? '');
  const email = emailRaw.trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!name || name.length < 2) return res.status(422).json({ error: 'Nome deve ter pelo menos 2 caracteres.' });
  if (!email) return res.status(422).json({ error: 'E-mail é obrigatório.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(422).json({ error: 'E-mail inválido.' });
  if (!isXaigooEmail(email)) return res.status(422).json({ error: xaigooDomainError() });
  if (!password) return res.status(422).json({ error: 'Senha é obrigatória.' });
  const pwErr = validatePassword(password);
  if (pwErr) return res.status(422).json({ error: pwErr });

  const id = 'usr-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const hash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (dbAvailable && pool) {
    try {
      await pool.query('INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [id, name, email, hash, now, now]);
      (req.session as any).user_id = id;
      const [rows] = await pool.query('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1', [id]) as any;
      return res.status(201).json(publicUser(rows[0]));
    } catch (e: any) {
      if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'E-mail já cadastrado.' });
      console.error('[register mysql]', e.code, e.message);
      return res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
  } else {
    const users = loadDevUsers();
    if (users.some(u => u.email === email)) return res.status(409).json({ error: 'E-mail já cadastrado.' });
    const u: DevUser = { id, name, email, passwordHash: hash, created_at: now, updated_at: now };
    users.push(u);
    saveDevUsers(users);
    (req.session as any).user_id = id;
    return res.status(201).json(publicUser(u));
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const emailRaw = String(req.body?.email ?? '');
  const email = emailRaw.trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  if (!email || !password) return res.status(422).json({ error: 'E-mail e senha são obrigatórios.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(422).json({ error: 'E-mail inválido.' });
  if (!isXaigooEmail(email)) return res.status(403).json({ error: xaigooDomainError() });

  let row: any = null;
  if (dbAvailable && pool) {
    try {
      const [rows] = await pool.query('SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = ? LIMIT 1', [email]) as any;
      row = rows[0] ?? null;
    } catch (e: any) { console.error('[login mysql]', e.code); return res.status(500).json({ error: 'Erro ao autenticar.' }); }
  } else {
    row = loadDevUsers().find(u => u.email === email) ?? null;
    if (row) row = { ...row, password_hash: row.passwordHash };
  }

  if (!row || !(await bcrypt.compare(password, String(row.password_hash ?? row.passwordHash ?? '')))) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }
  (req.session as any).user_id = row.id;
  return res.json(publicUser(row));
});

// Me
const onlineUsers = new Map<string, { id: string; name: string; email: string; lastSeen: number }>();
const ONLINE_TTL_MS = 60_000; // 60s de "online"

function pruneOnline(): void {
  const cutoff = Date.now() - ONLINE_TTL_MS;
  for (const [k, v] of onlineUsers) {
    if (v.lastSeen < cutoff) onlineUsers.delete(k);
  }
}

app.get('/api/auth/me', async (req, res) => {
  const uid = (req.session as any)?.user_id;
  if (!uid) return res.status(401).json({ error: 'Não autenticado.' });
  let row: any = null;
  if (dbAvailable && pool) {
    try {
      const [rows] = await pool.query('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1', [uid]) as any;
      row = rows[0] ?? null;
    } catch { return res.status(500).json({ error: 'Erro ao buscar usuário.' }); }
  } else {
    row = loadDevUsers().find(u => u.id === uid) ?? null;
  }
  if (!row) { (req.session as any).user_id = null; return res.status(401).json({ error: 'Não autenticado.' }); }
  // Marca como online
  onlineUsers.set(uid, { id: row.id, name: row.name, email: row.email, lastSeen: Date.now() });
  res.json(publicUser(row));
});

// Quem está online (últimos 60s)
app.get('/api/auth/online', async (_req, res) => {
  pruneOnline();
  const list = Array.from(onlineUsers.values())
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .map(({ id, name, email }) => ({ id, name, email }));
  res.json({ online: list, count: list.length });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('xaigoo_session', { path: '/' });
    res.json({ ok: true });
  });
});

// ---------------------------------------------------------------------------
// Influencers CRUD — todos com requireAuth, MySQL com fallback arquivo + ETIMEDOUT
// ---------------------------------------------------------------------------

// GET /api/influencers — lista ordenada updated_at DESC
app.get('/api/influencers', requireAuth, async (_req, res) => {
  if (dbAvailable && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM influencers ORDER BY updated_at DESC') as any;
      const list = (rows as any[]).map(normalizeInfluencerRow);
      return res.json(list);
    } catch (e: any) {
      if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[influencers:list mysql fallback]', e.code);
        dbAvailable = false;
      } else {
        console.error('[influencers:list mysql]', e.code, e.message);
        return res.status(500).json({ error: 'Erro ao listar influenciadores.' });
      }
    }
  }
  const list = loadDevInfluencers().sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  res.json(list);
});

// POST /api/influencers — cria
app.post('/api/influencers', requireAuth, async (req, res) => {
  const body = req.body ?? {};
  const nameOrHandle = String(body.nameOrHandle ?? body.name_or_handle ?? '').trim();
  const platform = body.platform;
  const link = String(body.link ?? '').trim();
  const audienceType = String(body.audienceType ?? body.audience_type ?? '').trim();
  const justification = String(body.justification ?? '').trim();
  const firstContactDateRaw = String(body.firstContactDate ?? body.first_contact_date ?? '').trim();
  const status = body.status;
  const responseReceived = body.responseReceived ?? body.response_received;
  const proposalSent = body.proposalSent ?? body.proposal_sent;
  const videosSent = body.videosSent ?? body.videos_sent;
  const nextAction = String(body.nextAction ?? body.next_action ?? '').trim();
  const notes = String(body.notes ?? '').trim();

  if (!nameOrHandle) return res.status(422).json({ error: 'nameOrHandle é obrigatório.' });
  if (platform != null && platform !== '' && !isValidPlatform(platform)) return res.status(422).json({ error: `platform inválida. Valores: ${VALID_PLATFORMS.join(', ')}` });
  if (status != null && status !== '' && !isValidStatus(status)) return res.status(422).json({ error: `status inválido. Valores: ${VALID_STATUSES.join(', ')}` });
  if (responseReceived != null && responseReceived !== '' && !isValidResponse(responseReceived)) return res.status(422).json({ error: `responseReceived inválido. Valores: ${VALID_RESPONSES.join(', ')}` });
  if (firstContactDateRaw && !/^\d{4}-\d{2}-\d{2}$/.test(firstContactDateRaw)) return res.status(422).json({ error: 'firstContactDate deve ser YYYY-MM-DD.' });

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const today = new Date().toISOString().slice(0, 10);
  const id = 'inf-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  const record: DevInfluencer = {
    id,
    nameOrHandle,
    platform: isValidPlatform(platform) ? platform : 'Instagram',
    link,
    audienceType,
    justification,
    firstContactDate: firstContactDateRaw || today,
    status: isValidStatus(status) ? status : 'A pesquisar',
    responseReceived: isValidResponse(responseReceived) ? responseReceived : 'Pendente',
    proposalSent: Boolean(proposalSent),
    videosSent: Boolean(videosSent),
    nextAction,
    notes,
    created_at: now,
    updated_at: now,
  };

  if (dbAvailable && pool) {
    try {
      await pool.query(
        `INSERT INTO influencers (id, name_or_handle, platform, link, audience_type, justification, first_contact_date, status, response_received, proposal_sent, videos_sent, next_action, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.nameOrHandle,
          record.platform,
          record.link || null,
          record.audienceType || null,
          record.justification || null,
          record.firstContactDate || null,
          record.status,
          record.responseReceived,
          record.proposalSent ? 1 : 0,
          record.videosSent ? 1 : 0,
          record.nextAction || null,
          record.notes || null,
          record.created_at,
          record.updated_at,
        ]
      );
      const [rows] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      if (rows[0]) return res.status(201).json(normalizeInfluencerRow(rows[0]));
      return res.status(201).json(record);
    } catch (e: any) {
      if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[influencers:create mysql fallback ETIMEDOUT]', e.code);
        dbAvailable = false;
      } else {
        console.error('[influencers:create mysql]', e.code, e.message);
        return res.status(500).json({ error: 'Erro ao criar influenciador.' });
      }
    }
  }

  const list = loadDevInfluencers();
  list.unshift(record);
  saveDevInfluencers(list);
  return res.status(201).json(record);
});

// GET /api/influencers/:id
app.get('/api/influencers/:id', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  if (dbAvailable && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      if (!rows[0]) return res.status(404).json({ error: 'Influenciador não encontrado.' });
      return res.json(normalizeInfluencerRow(rows[0]));
    } catch (e: any) {
      if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[influencers:get mysql fallback]', e.code);
        dbAvailable = false;
      } else {
        console.error('[influencers:get mysql]', e.code, e.message);
        return res.status(500).json({ error: 'Erro ao buscar influenciador.' });
      }
    }
  }
  const list = loadDevInfluencers();
  const found = list.find(r => r.id === id);
  if (!found) return res.status(404).json({ error: 'Influenciador não encontrado.' });
  res.json(found);
});

// PUT /api/influencers/:id — update parcial
app.put('/api/influencers/:id', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  const body = req.body ?? {};

  // Valida enums se presentes
  if (body.platform != null && body.platform !== '' && !isValidPlatform(body.platform)) return res.status(422).json({ error: `platform inválida. Valores: ${VALID_PLATFORMS.join(', ')}` });
  if (body.status != null && body.status !== '' && !isValidStatus(body.status)) return res.status(422).json({ error: `status inválido. Valores: ${VALID_STATUSES.join(', ')}` });
  const rr = body.responseReceived ?? body.response_received;
  if (rr != null && rr !== '' && !isValidResponse(rr)) return res.status(422).json({ error: `responseReceived inválido. Valores: ${VALID_RESPONSES.join(', ')}` });
  const fcdRaw = body.firstContactDate ?? body.first_contact_date;
  if (fcdRaw != null && String(fcdRaw).trim() !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(String(fcdRaw).trim())) return res.status(422).json({ error: 'firstContactDate deve ser YYYY-MM-DD.' });
  if (body.nameOrHandle != null && String(body.nameOrHandle).trim() === '' && body.name_or_handle == null) {
    // se enviou nameOrHandle vazio explicitamente
    return res.status(422).json({ error: 'nameOrHandle não pode ser vazio.' });
  }
  if (body.name_or_handle != null && String(body.name_or_handle).trim() === '') return res.status(422).json({ error: 'nameOrHandle não pode ser vazio.' });

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (dbAvailable && pool) {
    try {
      const [existingRows] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      if (!existingRows[0]) return res.status(404).json({ error: 'Influenciador não encontrado.' });
      const existing = normalizeInfluencerRow(existingRows[0]);

      const next: DevInfluencer = {
        ...existing,
        nameOrHandle: body.nameOrHandle != null ? String(body.nameOrHandle).trim() : body.name_or_handle != null ? String(body.name_or_handle).trim() : existing.nameOrHandle,
        platform: body.platform != null && body.platform !== '' ? body.platform : existing.platform,
        link: body.link != null ? String(body.link).trim() : existing.link,
        audienceType: (body.audienceType ?? body.audience_type) != null ? String(body.audienceType ?? body.audience_type).trim() : existing.audienceType,
        justification: body.justification != null ? String(body.justification).trim() : existing.justification,
        firstContactDate: fcdRaw != null && String(fcdRaw).trim() !== '' ? String(fcdRaw).trim() : existing.firstContactDate,
        status: body.status != null && body.status !== '' ? body.status : existing.status,
        responseReceived: rr != null && rr !== '' ? rr : existing.responseReceived,
        proposalSent: (body.proposalSent ?? body.proposal_sent) != null ? Boolean(body.proposalSent ?? body.proposal_sent) : existing.proposalSent,
        videosSent: (body.videosSent ?? body.videos_sent) != null ? Boolean(body.videosSent ?? body.videos_sent) : existing.videosSent,
        nextAction: (body.nextAction ?? body.next_action) != null ? String(body.nextAction ?? body.next_action).trim() : existing.nextAction,
        notes: body.notes != null ? String(body.notes).trim() : existing.notes,
        created_at: existing.created_at,
        updated_at: now,
      };

      await pool.query(
        `UPDATE influencers SET name_or_handle=?, platform=?, link=?, audience_type=?, justification=?, first_contact_date=?, status=?, response_received=?, proposal_sent=?, videos_sent=?, next_action=?, notes=?, updated_at=? WHERE id=?`,
        [
          next.nameOrHandle,
          next.platform,
          next.link || null,
          next.audienceType || null,
          next.justification || null,
          next.firstContactDate || null,
          next.status,
          next.responseReceived,
          next.proposalSent ? 1 : 0,
          next.videosSent ? 1 : 0,
          next.nextAction || null,
          next.notes || null,
          next.updated_at,
          id,
        ]
      );
      const [updatedRows] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      return res.json(normalizeInfluencerRow(updatedRows[0]));
    } catch (e: any) {
      if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[influencers:put mysql fallback]', e.code);
        dbAvailable = false;
      } else {
        console.error('[influencers:put mysql]', e.code, e.message);
        return res.status(500).json({ error: 'Erro ao atualizar influenciador.' });
      }
    }
  }

  const list = loadDevInfluencers();
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Influenciador não encontrado.' });
  const cur = list[idx];
  const updated: DevInfluencer = {
    ...cur,
    nameOrHandle: body.nameOrHandle != null ? String(body.nameOrHandle).trim() : body.name_or_handle != null ? String(body.name_or_handle).trim() : cur.nameOrHandle,
    platform: body.platform != null && body.platform !== '' ? (body.platform as InfluencerPlatform) : cur.platform,
    link: body.link != null ? String(body.link).trim() : cur.link,
    audienceType: (body.audienceType ?? body.audience_type) != null ? String(body.audienceType ?? body.audience_type).trim() : cur.audienceType,
    justification: body.justification != null ? String(body.justification).trim() : cur.justification,
    firstContactDate: fcdRaw != null && String(fcdRaw).trim() !== '' ? String(fcdRaw).trim() : cur.firstContactDate,
    status: body.status != null && body.status !== '' ? (body.status as InfluencerStatus) : cur.status,
    responseReceived: rr != null && rr !== '' ? (rr as InfluencerResponse) : cur.responseReceived,
    proposalSent: (body.proposalSent ?? body.proposal_sent) != null ? Boolean(body.proposalSent ?? body.proposal_sent) : cur.proposalSent,
    videosSent: (body.videosSent ?? body.videos_sent) != null ? Boolean(body.videosSent ?? body.videos_sent) : cur.videosSent,
    nextAction: (body.nextAction ?? body.next_action) != null ? String(body.nextAction ?? body.next_action).trim() : cur.nextAction,
    notes: body.notes != null ? String(body.notes).trim() : cur.notes,
    updated_at: now,
  };
  list[idx] = updated;
  saveDevInfluencers(list);
  res.json(updated);
});

// PATCH /api/influencers/:id/status — drag Kanban rápido
app.patch('/api/influencers/:id/status', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  const status = req.body?.status;
  if (!isValidStatus(status)) return res.status(422).json({ error: `status inválido. Valores: ${VALID_STATUSES.join(', ')}` });
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (dbAvailable && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      if (!rows[0]) return res.status(404).json({ error: 'Influenciador não encontrado.' });
      await pool.query('UPDATE influencers SET status=?, updated_at=? WHERE id=?', [status, now, id]);
      const [updated] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      return res.json(normalizeInfluencerRow(updated[0]));
    } catch (e: any) {
      if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[influencers:patch-status mysql fallback]', e.code);
        dbAvailable = false;
      } else {
        console.error('[influencers:patch-status mysql]', e.code, e.message);
        return res.status(500).json({ error: 'Erro ao atualizar status.' });
      }
    }
  }

  const list = loadDevInfluencers();
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Influenciador não encontrado.' });
  list[idx] = { ...list[idx], status, updated_at: now };
  saveDevInfluencers(list);
  res.json(list[idx]);
});

// PATCH /api/influencers/:id/visibility — atualiza resultado da verificação de visibilidade
app.patch('/api/influencers/:id/visibility', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  const body = req.body ?? {};
  const hasMessageButton = body.hasMessageButton;
  if (hasMessageButton !== null && hasMessageButton !== undefined && typeof hasMessageButton !== 'boolean') {
    return res.status(422).json({ error: 'hasMessageButton deve ser boolean ou null.' });
  }
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (dbAvailable && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      if (!rows[0]) return res.status(404).json({ error: 'Influenciador não encontrado.' });
      await pool.query(
        'UPDATE influencers SET has_message_button=?, last_visibility_check=? WHERE id=?',
        [hasMessageButton != null ? (hasMessageButton ? 1 : 0) : null, now, id]
      );
      const [updated] = await pool.query('SELECT * FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      return res.json(normalizeInfluencerRow(updated[0]));
    } catch (e: any) {
      if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[influencers:patch-visibility mysql fallback]', e.code);
        dbAvailable = false;
      } else {
        console.error('[influencers:patch-visibility mysql]', e.code, e.message);
        return res.status(500).json({ error: 'Erro ao atualizar visibilidade.' });
      }
    }
  }

  const list = loadDevInfluencers();
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Influenciador não encontrado.' });
  list[idx] = { ...list[idx], hasMessageButton: hasMessageButton != null ? Boolean(hasMessageButton) : null, lastVisibilityCheck: now, updated_at: now };
  saveDevInfluencers(list);
  res.json(list[idx]);
});

// POST /api/profile/verify-visibility — verifica se perfil tem botão de mensagem
app.post('/api/profile/verify-visibility', requireAuth, async (req, res) => {
  const { profileUrl } = req.body ?? {};
  if (!profileUrl || typeof profileUrl !== 'string') {
    return res.status(422).json({ error: 'profileUrl é obrigatório.' });
  }

  try {
    // Fazer fetch para o perfil do Instagram
    const response = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // 10 segundos timeout
    });

    let hasMessageButton = false;
    if (response.ok) {
      const html = await response.text();
      // Verificar se contém botão "Enviar mensagem" ou "Send message"
      hasMessageButton = 
        html.includes('enviar mensagem') ||
        html.includes('send message') ||
        html.includes('Enviar mensagem') ||
        html.includes('Send message') ||
        html.includes('/messages/') ||
        html.includes('/compose/');
    }

    // Salvar no banco de dados
    const visibilityId = 'vis-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (dbAvailable && pool) {
      try {
        await pool.query(
          `INSERT INTO profile_visibilities (id, profile_url, is_visible, checked_at, status) 
           VALUES (?, ?, ?, ?, 'completed')`,
          [visibilityId, profileUrl, hasMessageButton, now]
        );
      } catch (e: any) {
        console.error('[profile:verify-visibility insert]', e.code, e.message);
        // Não falhar a resposta por erro de insert no log
      }
    }

    res.json({ 
      success: true, 
      hasMessageButton, 
      profileUrl,
      timestamp: now 
    });
  } catch (error: any) {
    console.error('[profile:verify-visibility]', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao verificar perfil',
      hasMessageButton: false 
    });
  }
});

// DELETE /api/influencers/:id
app.delete('/api/influencers/:id', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  if (dbAvailable && pool) {
    try {
      const [rows] = await pool.query('SELECT id FROM influencers WHERE id = ? LIMIT 1', [id]) as any;
      if (!rows[0]) return res.status(404).json({ error: 'Influenciador não encontrado.' });
      await pool.query('DELETE FROM influencers WHERE id = ?', [id]);
      return res.json({ ok: true });
    } catch (e: any) {
      if (e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED' || e.code === 'PROTOCOL_CONNECTION_LOST') {
        console.warn('[influencers:delete mysql fallback]', e.code);
        dbAvailable = false;
      } else {
        console.error('[influencers:delete mysql]', e.code, e.message);
        return res.status(500).json({ error: 'Erro ao remover influenciador.' });
      }
    }
  }
  const list = loadDevInfluencers();
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Influenciador não encontrado.' });
  list.splice(idx, 1);
  saveDevInfluencers(list);
  res.json({ ok: true });
});

const PORT = Number(process.env.API_PORT || 3001);
await initDb();
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[api] dev server em http://localhost:${PORT} — modo ${dbAvailable ? 'MySQL remoto' : 'arquivo local (MySQL indisponível — .dev-users.json + .dev-influencers.json)'} — CORS 3000`);
  if (!dbAvailable) console.log('[api] Dica: em portal.xaigoo.app a HomeHost usa DB_HOST=localhost e o MySQL funcionará normalmente. Para liberar remoto, verifique firewall da hospedagem na porta 3306.');
});
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[api] porta ${PORT} já em uso — feche o outro 'npm run dev' ou rode: kill ${process.pid} e tente novamente`);
  } else {
    console.error('[api] listen error', err);
  }
  process.exit(1);
});
