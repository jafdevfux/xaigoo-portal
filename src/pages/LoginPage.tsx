// SPDX-License-Identifier: MIT
// Xaigoo Pipeline — LoginPage split branco/roxo (acesso restrito @xaigoo.app)

import { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';

const LOGO_URL = 'https://www.xaigoo.app/assets/logotipo-xaigoo-Cc62wp1B.png';

function isXaigooEmail(email: string): boolean {
  return /^[^@\s]+@xaigoo\.app$/i.test(email.trim());
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'Senha deve ter pelo menos 8 caracteres.';
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw))
    return 'Senha deve conter pelo menos 1 letra e 1 número.';
  return null;
}

type Mode = 'login' | 'register';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const fe: Record<string, string> = {};
    const emailTrim = email.trim();
    if (!emailTrim) fe.email = 'E-mail é obrigatório.';
    else if (!isXaigooEmail(emailTrim)) fe.email = 'Use seu e-mail corporativo @xaigoo.app.';
    if (mode === 'register') {
      if (!name.trim() || name.trim().length < 2) fe.name = 'Nome deve ter pelo menos 2 caracteres.';
    }
    if (!password) fe.password = 'Senha é obrigatória.';
    else {
      const pwErr = validatePassword(password);
      if (pwErr) fe.password = pwErr;
    }
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const validateField = (field: 'name' | 'email' | 'password') => {
    const fe = { ...fieldErrors };
    if (field === 'email') {
      const v = email.trim();
      if (!v) fe.email = 'E-mail é obrigatório.';
      else if (!isXaigooEmail(v)) fe.email = 'Use seu e-mail corporativo @xaigoo.app.';
      else delete fe.email;
    }
    if (field === 'password') {
      if (!password) fe.password = 'Senha é obrigatória.';
      else {
        const pwErr = validatePassword(password);
        if (pwErr) fe.password = pwErr;
        else delete fe.password;
      }
    }
    if (field === 'name') {
      if (mode === 'register') {
        if (!name.trim() || name.trim().length < 2) fe.name = 'Nome deve ter pelo menos 2 caracteres.';
        else delete fe.name;
      } else {
        delete fe.name;
      }
    }
    setFieldErrors(fe);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim().toLowerCase(), password);
      } else {
        await register(name.trim(), email.trim().toLowerCase(), password);
      }
    } catch (err) {
      if (err instanceof ApiError) setServerError(err.message);
      else setServerError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setFieldErrors({});
    setServerError(null);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-white flex flex-col lg:flex-row">
      {/* Painel esquerdo — roxo */}
      <div className="relative bg-violet-700 overflow-hidden flex flex-col lg:w-[50%] xl:w-[48%] shrink-0 order-1 lg:min-h-screen lg:min-h-[100dvh] lg:justify-between">
        {/* motorista ao volante dentro do veículo — background com baixa opacidade */}
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=80"
          alt=""
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-[0.22]"
        />
        <div className="pointer-events-none absolute inset-0 bg-violet-700/60" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-900/45 via-violet-700/10 to-transparent" aria-hidden />
        {/* grid sutil */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden
        />
        {/* glows radiais */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-white/[0.10] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 w-[460px] h-[460px] rounded-full bg-white/[0.08] blur-3xl"
          aria-hidden
        />

        {/* marca d'água gigante */}
        <img
          src={LOGO_URL}
          alt=""
          aria-hidden
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] lg:w-[720px] max-w-[92%] h-auto object-contain brightness-0 invert opacity-[0.09] blur-[0.4px]"
        />

        {/* conteúdo central */}
        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-10 xl:px-12 py-8 sm:py-10 lg:py-12 lg:flex-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-sm" aria-hidden />
            Acesso interno
          </div>

          <div className="mt-4">
            <img
              src={LOGO_URL}
              alt="Xaigoo"
              className="h-14 sm:h-16 lg:h-20 w-auto object-contain brightness-0 invert"
            />
            <h2 className="mt-3 font-display text-[26px] sm:text-[30px] lg:text-[38px] font-bold tracking-tight leading-[0.95] text-white">
              <span className="text-violet-100 font-semibold tracking-tight">| Portal</span>
            </h2>
          </div>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-violet-100/90">
            Portal interno Marketing e vendas.
          </p>
        </div>

        {/* footer sutil — desktop */}
        <div className="relative z-10 hidden lg:flex items-center justify-between px-6 sm:px-10 lg:px-10 xl:px-12 pb-6 text-[11px] leading-none tracking-wide text-violet-200/60">
          <span>© {new Date().getFullYear()} Xaigoo</span>
          <span className="opacity-70">Ambiente interno</span>
        </div>

        {/* separador mobile — evita que roxo pareça colado no card */}
        <div className="lg:hidden h-px bg-white/10 relative z-10" aria-hidden />
      </div>

      {/* Painel direito — branco */}
      <div className="flex flex-1 order-2 bg-slate-50 lg:bg-white flex-col items-center justify-center px-6 sm:px-8 lg:px-12 xl:px-14 py-10 lg:py-14">
        <div className="w-full max-w-[560px] mx-auto bg-white border border-slate-200 rounded-[20px] shadow-sm lg:shadow-md p-7 sm:p-8 lg:p-9 animate-[fadeIn_200ms_ease-out]">
          <h1 className="sr-only">Acesso ao Portal Xaigoo</h1>

          {/* label RESTRITO — 11px tracking 0.14em */}
          <div className="mb-5">
            <span className="inline-flex rounded-full bg-violet-50 border border-violet-200 px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-violet-700">
              RESTRITO
            </span>
          </div>

          {/* hierarquia — h2 22px bold, subtítulo 14px slate-500, gap 20-24px */}
          <div className="mb-6">
            <h2 className="text-[22px] font-bold tracking-tight text-slate-900 leading-none font-display">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="mt-2 text-[14px] leading-snug text-slate-500">
              {mode === 'login' ? 'Entre com seu e-mail @xaigoo.app' : 'Use seu e-mail @xaigoo.app para começar'}
            </p>
          </div>

          {/* Tabs premium — h-11, 14px, 150ms */}
          <div
            role="tablist"
            aria-label="Modo de acesso"
            className="mb-6 inline-flex w-full rounded-full bg-slate-100 p-1 border border-slate-200/60"
          >
            <button
              role="tab"
              aria-selected={mode === 'login'}
              type="button"
              onClick={() => switchMode('login')}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 h-11 text-[14px] font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" aria-hidden />
              Entrar
            </button>
            <button
              role="tab"
              aria-selected={mode === 'register'}
              type="button"
              onClick={() => switchMode('register')}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 h-11 text-[14px] font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              Criar conta
            </button>
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="mb-5 flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[14px] leading-snug text-red-800"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" aria-hidden />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {mode === 'register' && (
              <div>
                <label htmlFor="xaigoo-name" className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Nome
                </label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    aria-hidden
                  />
                  <input
                    id="xaigoo-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={() => validateField('name')}
                    placeholder="Seu nome"
                    autoComplete="name"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'xaigoo-name-error' : undefined}
                    className={`h-[46px] lg:h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-colors ${
                      fieldErrors.name ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p id="xaigoo-name-error" role="alert" className="mt-1.5 text-[12px] leading-snug text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="xaigoo-email" className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden
                />
                <input
                  id="xaigoo-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={() => validateField('email')}
                  placeholder="nome@xaigoo.app"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'xaigoo-email-error' : undefined}
                  className={`h-[46px] lg:h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-colors ${
                    fieldErrors.email ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p id="xaigoo-email-error" role="alert" className="mt-1.5 text-[12px] leading-snug text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="xaigoo-password" className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden
                />
                <input
                  id="xaigoo-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={() => validateField('password')}
                  placeholder={mode === 'register' ? 'Mín. 8 com letra e número' : 'Sua senha'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password
                      ? 'xaigoo-password-error'
                      : mode === 'register'
                        ? 'xaigoo-password-hint'
                        : undefined
                  }
                  className={`h-[46px] lg:h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-colors ${
                    fieldErrors.password ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="xaigoo-password-error" role="alert" className="mt-1.5 text-[12px] leading-snug text-red-600">
                  {fieldErrors.password}
                </p>
              ) : mode === 'register' ? (
                <p id="xaigoo-password-hint" className="mt-1.5 text-[11px] leading-snug text-slate-400">
                  Mín. 8 caracteres com letra e número
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-violet-800 active:bg-violet-900 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden
                  />
                  Aguarde…
                </>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="h-4 w-4" aria-hidden />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" aria-hidden />
                  Criar conta
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] leading-relaxed text-slate-400">
            Apenas contas <span className="font-medium text-slate-600">@xaigoo.app</span> são permitidas.
          </p>
        </div>

        {/* microcopy segurança — 12px slate-400 centralizado, acompanha largura do card */}
        <p className="mt-4 max-w-[560px] w-full mx-auto text-center text-[12px] leading-relaxed text-slate-400 px-2">
          Protegido por sessão segura. Seu acesso expira ao fechar o navegador.
        </p>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
