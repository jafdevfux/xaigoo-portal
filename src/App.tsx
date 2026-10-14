/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  LogOut,
  Maximize2,
  Minimize2,
  Printer,
  Search,
  X,
  Menu,
  Layers,
  Target,
  CheckSquare,
} from 'lucide-react';
import { CHAPTERS, GLOSSARY_ITEMS } from './data/presentationData';
import {
  Chapter1Opening,
  Chapter2Ecosystem,
  Chapter3Portfolio,
} from './components/Chapters1To3';
import {
  Chapter4Copilot,
  Chapter5Bonuses,
  Chapter6Ads,
  Chapter7Future,
} from './components/Chapters4To7';
import {
  Chapter8Step1Priority,
  Chapter9Influencers,
  Chapter10DirectOutreach,
  Chapter11ProposalAndVideos,
} from './components/Chapters8To11';
import {
  Chapter12WorkflowMktSales,
  Chapter13KpisAndLearning,
  Chapter14Checklist,
  Chapter15GovernancePending,
} from './components/Chapters12To15';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import PipelinePage from './pages/PipelinePage';

type AppView = 'portal' | 'pipeline';
export default function App() {
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState<AppView>('portal');
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [showGlossaryModal, setShowGlossaryModal] = useState<boolean>(false);
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [printAllChapters, setPrintAllChapters] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentChapter =
    CHAPTERS.find((c) => c.id === activeChapterId) || CHAPTERS[0];

  const handleNavigateChapter = (chapterId: number) => {
    setView('portal');
    setActiveChapterId(chapterId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleOpenPipeline = () => {
    setView('pipeline');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    const onOpenPipeline = () => handleOpenPipeline();
    window.addEventListener('xaigoo:open-pipeline', onOpenPipeline as EventListener);
    return () => window.removeEventListener('xaigoo:open-pipeline', onOpenPipeline as EventListener);
  }, []);

  // Keyboard navigation (Left/Right arrows when not typing in an input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight' && activeChapterId < CHAPTERS.length) {
        handleNavigateChapter(activeChapterId + 1);
      } else if (e.key === 'ArrowLeft' && activeChapterId > 1) {
        handleNavigateChapter(activeChapterId - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapterId]);

  const categories: Array<
    | 'Fundamentos & Ecossistema'
    | 'Portfólio & Produtos'
    | 'Execução Prioritária (STEP 1)'
    | 'Governança & Controle'
  > = [
    'Fundamentos & Ecossistema',
    'Portfólio & Produtos',
    'Execução Prioritária (STEP 1)',
    'Governança & Controle',
  ];

  const renderChapterContent = (chapterId: number) => {
    switch (chapterId) {
      case 1:
        return <Chapter1Opening onNavigateChapter={handleNavigateChapter} />;
      case 2:
        return <Chapter2Ecosystem onNavigateChapter={handleNavigateChapter} />;
      case 3:
        return <Chapter3Portfolio onNavigateChapter={handleNavigateChapter} />;
      case 4:
        return <Chapter4Copilot onNavigateChapter={handleNavigateChapter} />;
      case 5:
        return <Chapter5Bonuses onNavigateChapter={handleNavigateChapter} />;
      case 6:
        return <Chapter6Ads onNavigateChapter={handleNavigateChapter} />;
      case 7:
        return <Chapter7Future onNavigateChapter={handleNavigateChapter} />;
      case 8:
        return <Chapter8Step1Priority onNavigateChapter={handleNavigateChapter} />;
      case 9:
        return <Chapter9Influencers onNavigateChapter={handleNavigateChapter} />;
      case 10:
        return <Chapter10DirectOutreach onNavigateChapter={handleNavigateChapter} />;
      case 11:
        return <Chapter11ProposalAndVideos onNavigateChapter={handleNavigateChapter} />;
      case 12:
        return <Chapter12WorkflowMktSales onNavigateChapter={handleNavigateChapter} />;
      case 13:
        return <Chapter13KpisAndLearning onNavigateChapter={handleNavigateChapter} />;
      case 14:
        return <Chapter14Checklist onNavigateChapter={handleNavigateChapter} />;
      case 15:
        return <Chapter15GovernancePending onNavigateChapter={handleNavigateChapter} />;
      default:
        return <Chapter1Opening onNavigateChapter={handleNavigateChapter} />;
    }
  };

  const filteredGlossary = GLOSSARY_ITEMS.filter(
    (g) =>
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.xaigooContext.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <span className="w-8 h-8 border-2 border-violet-200 border-t-violet-700 rounded-full animate-spin" aria-hidden />
          <span className="text-sm font-medium">Carregando portal…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header — roxo com logo branca e botão de contraste */}
      <header className="no-print sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-violet-700 border-b border-violet-800">
        {/* Zone 1: Logotipo oficial + label Portal */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavigateChapter(1);
          }}
          className="flex items-center gap-3 shrink-0"
          aria-label="Xaigoo | Portal — voltar ao início"
        >
          <img
            src="https://www.xaigoo.app/assets/logotipo-xaigoo-Cc62wp1B.png"
            alt="Xaigoo"
            className="h-7 w-auto object-contain brightness-0 invert"
          />
          <span className="text-sm font-bold tracking-tight text-white font-display whitespace-nowrap">
            Portal
          </span>
        </a>

        {/* Zone 2: navegação — texto branco no header roxo */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-violet-100">
          <button
            onClick={() => handleNavigateChapter(2)}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-white ${view === 'portal' && activeChapterId === 2 ? 'text-white font-semibold underline underline-offset-4' : ''}`}
          >
            Ecossistema
          </button>
          <button
            onClick={() => handleNavigateChapter(3)}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-white ${view === 'portal' && activeChapterId >= 3 && activeChapterId <= 7 ? 'text-white font-semibold underline underline-offset-4' : ''}`}
          >
            Portfólio
          </button>
          <button
            onClick={() => handleNavigateChapter(8)}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-white ${view === 'portal' && activeChapterId >= 8 && activeChapterId <= 11 ? 'text-white font-semibold underline underline-offset-4' : ''}`}
          >
            STEP 1
          </button>
          <button
            onClick={handleOpenPipeline}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-white ${view === 'pipeline' ? 'text-white font-semibold underline underline-offset-4' : ''}`}
          >
            Pipeline
          </button>
          <button
            onClick={() => handleNavigateChapter(14)}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-white ${view === 'portal' && activeChapterId === 14 ? 'text-white font-semibold underline underline-offset-4' : ''}`}
          >
            Checklist
          </button>
          <button
            onClick={() => setShowGlossaryModal(true)}
            className="transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-white"
          >
            Glossário
          </button>
        </nav>

        {/* Zone 3: botão contraste + usuário / sair */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavigateChapter(8)}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-violet-700 bg-white rounded-lg hover:bg-violet-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            Plano STEP 1
          </button>
          <span className="hidden sm:inline text-xs font-medium text-violet-100 truncate max-w-[160px]" title={user?.email ?? ''}>
            {user?.name ?? ''}
          </span>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title={user?.email ? `Sair (${user.email})` : 'Sair'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {view === 'pipeline' ? (
        <div className="flex-1 min-w-0 bg-slate-50">
          <PipelinePage />
        </div>
      ) : (
        <>
          {/* Main Workspace Layout: Sidebar + Content Viewport */}
          <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto">
        {/* Desktop Left Sidebar Navigation (280px width) */}
        <aside className="no-print hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="p-5 border-b border-slate-200 space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Sumário de Capítulos (15)
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Capítulo Atual:</span>
              <span className="font-mono font-bold text-violet-700 tabular-nums">
                {currentChapter.numberLabel} / 15
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {categories.map((cat) => {
              const catChapters = CHAPTERS.filter((c) => c.category === cat);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="px-2.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    {cat}
                  </div>
                  <div className="space-y-1">
                    {catChapters.map((chap) => {
                      const isActive = chap.id === activeChapterId;
                      return (
                        <button
                          key={chap.id}
                          onClick={() => handleNavigateChapter(chap.id)}
                          className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                            isActive
                              ? 'bg-violet-600 text-white font-semibold'
                              : 'text-slate-700 hover:bg-slate-100 font-medium'
                          }`}
                        >
                          <span className="truncate">{chap.shortTitle}</span>
                          {chap.priorityBadge && (
                            <span
                              className={`text-[10px] font-mono shrink-0 ${
                                isActive ? 'text-violet-200' : 'text-violet-700 font-bold'
                              }`}
                            >
                              STEP 1
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Bottom Official Links & Utilities */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 text-xs">
            <div className="font-semibold text-slate-800">Páginas Oficiais Xaigoo:</div>
            <div className="flex flex-col gap-1.5 text-slate-600">
              <a
                href="https://www.xaigoo.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between hover:text-violet-700"
              >
                <span>xaigoo.app (Site Principal)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.xaigoo.app/plano-pro-xai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between hover:text-violet-700"
              >
                <span>xaigoo.app/plano-pro-xai</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.xaigoo.app/insiders"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between hover:text-violet-700"
              >
                <span>xaigoo.app/insiders</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 print-full-width">
          {/* Workspace Contextual Toolbar (Mobile Chapter Selector + Presentation Controls) */}
          <div className="no-print mb-6 pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumb & Mobile Chapter Drawer Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>Capítulos ({currentChapter.numberLabel}/15)</span>
              </button>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                <span className="font-medium text-slate-700">{currentChapter.category}</span>
                <span>/</span>
                <span className="font-semibold text-violet-700">
                  Capítulo {currentChapter.numberLabel}: {currentChapter.title}
                </span>
              </div>
            </div>

            {/* Utility Controls: Glossary, Fullscreen, Print Current vs Print Complete Manual */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowGlossaryModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5 text-violet-700" />
                <span>Glossário (SaaS/AdTech)</span>
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Sair da Tela Cheia</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Tela Cheia</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setPrintAllChapters(false);
                  setTimeout(() => window.print(), 100);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Capítulo</span>
              </button>

              <button
                onClick={() => {
                  setPrintAllChapters(!printAllChapters);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  printAllChapters
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{printAllChapters ? 'Voltar à Visão por Capítulo' : 'Ver Manual Completo (15 Cap.)'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Chapter Drawer */}
          {mobileMenuOpen && (
            <div className="no-print lg:hidden mb-6 p-4 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900">
                  Selecione um Capítulo (01 a 15)
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {CHAPTERS.map((chap) => (
                  <button
                    key={chap.id}
                    onClick={() => handleNavigateChapter(chap.id)}
                    className={`px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center justify-between ${
                      chap.id === activeChapterId
                        ? 'bg-violet-600 text-white font-semibold'
                        : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{chap.shortTitle}</span>
                    {chap.priorityBadge && (
                      <span className="text-[10px] font-mono">STEP 1</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chapter Content Area */}
          {printAllChapters ? (
            <div className="space-y-16">
              <div className="no-print p-4 bg-violet-50 border border-violet-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-violet-950">
                  Modo Manual Completo Ativo (Exibindo todos os 15 capítulos em sequência para leitura contínua ou exportação em PDF).
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Imprimir PDF Completo Agora
                </button>
              </div>
              {CHAPTERS.map((chap) => (
                <div key={chap.id} className="pt-6 border-t-2 border-slate-300 first:border-t-0 first:pt-0">
                  {renderChapterContent(chap.id)}
                </div>
              ))}
            </div>
          ) : (
            <div>{renderChapterContent(activeChapterId)}</div>
          )}

          {/* Bottom Chapter Navigation Controls (Previous / Next Chapter) */}
          {!printAllChapters && (
            <div className="no-print mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              {activeChapterId > 1 ? (
                <button
                  onClick={() => handleNavigateChapter(activeChapterId - 1)}
                  className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <div className="text-[11px] font-mono text-slate-500">Capítulo Anterior</div>
                    <div className="text-xs font-bold text-slate-900">
                      {CHAPTERS[activeChapterId - 2].shortTitle}
                    </div>
                  </div>
                </button>
              ) : (
                <div />
              )}

              <div className="text-xs font-mono text-slate-500 tabular-nums">
                Capítulo {currentChapter.numberLabel} de 15
              </div>

              {activeChapterId < CHAPTERS.length ? (
                <button
                  onClick={() => handleNavigateChapter(activeChapterId + 1)}
                  className="w-full sm:w-auto px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-right flex items-center justify-end gap-3 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-[11px] font-mono text-violet-200">Próximo Capítulo</div>
                    <div className="text-xs font-bold text-white">
                      {CHAPTERS[activeChapterId].shortTitle}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white shrink-0" />
                </button>
              ) : (
                <button
                  onClick={() => handleNavigateChapter(1)}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-right flex items-center justify-end gap-3 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">Fim da Apresentação</div>
                    <div className="text-xs font-bold text-white">Voltar ao Capítulo 01</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white shrink-0" />
                </button>
              )}
            </div>
          )}
        </main>
      </div>

        </>
      )}

      {/* Quiet Executive Footer — black bg, white label */}
      <footer className="no-print border-t border-slate-800 bg-black px-6 py-4 text-xs text-white">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white">
            <strong className="text-white">XAIGOO</strong> · Documento Interno de Alinhamento Estratégico e Plano Operacional de Marketing e Vendas.
          </div>
          <div className="flex items-center gap-4 text-white">
            <a
              href="https://www.xaigoo.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-slate-200"
            >
              xaigoo.app
            </a>
            <span className="text-white/60">·</span>
            <a
              href="https://www.xaigoo.app/plano-pro-xai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-slate-200"
            >
              /plano-pro-xai
            </a>
            <span className="text-white/60">·</span>
            <a
              href="https://www.xaigoo.app/insiders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-slate-200"
            >
              /insiders
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive Glossary Modal */}
      {showGlossaryModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-xl">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-violet-700 font-semibold uppercase">
                  Dicionário Executivo Interno
                </div>
                <h2 className="text-xl font-bold text-slate-950 font-display">
                  Glossário de Termos do Ecossistema Xaigoo
                </h2>
              </div>
              <button
                onClick={() => setShowGlossaryModal(false)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Buscar termo (ex: SaaS, AdTech, URBAN, VENUE, Revenue Share, Afiliado)..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredGlossary.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-950 text-sm font-display">
                      {item.term}
                    </span>
                    <span className="font-mono text-violet-700 font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Definição geral:</strong> {item.definition}
                  </p>
                  <p className="text-xs text-slate-800 leading-relaxed pt-1 border-t border-slate-200">
                    <strong className="text-violet-800">Aplicação no Xaigoo:</strong> {item.xaigooContext}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

