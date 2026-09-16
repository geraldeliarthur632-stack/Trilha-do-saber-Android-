import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Award,
  ArrowRight,
  Info,
  ExternalLink,
} from 'lucide-react';
import { adMobService } from '../services/adMobService';
import { getActiveInterstitialAdUnitId, IS_TEST_MODE } from '../config/adMobConfig';
import { AdMobPrivacyModal } from './AdMobPrivacyModal';
import { soundEffects } from '../services/soundEffects';

interface TaskExitInterstitialAdProps {
  isOpen: boolean;
  taskTitle?: string;
  earnedXp?: number;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

interface EducationalSponsor {
  id: string;
  tag: string;
  title: string;
  description: string;
  category: string;
  callToAction: string;
  accentColor: string;
  iconText: string;
}

const EDUCATIONAL_SPONSORS: EducationalSponsor[] = [
  {
    id: 'obmep',
    tag: 'Matemática & Raciocínio',
    title: 'Olimpíada do Saber & Matemática Divertida',
    description:
      'Desenvolva seu raciocínio lógico com desafios, problemas matemáticos práticos e provas preparatórias gratuitas para todas as séries.',
    category: 'Desafio Educacional • Acesso Livre',
    callToAction: 'Explorar Desafios',
    accentColor: 'from-amber-500 to-orange-600',
    iconText: '📐',
  },
  {
    id: 'biblioteca',
    tag: 'Português & Literatura',
    title: 'Biblioteca Digital & Acervo Escolar Nacional',
    description:
      'Mais de 10.000 livros clássicos infantojuvenis, contos, fábulas e enciclopédias ilustradas de domínio público para incentivar o hábito da leitura.',
    category: 'Leitura & Cultura • Conteúdo Gratuito',
    callToAction: 'Ver Livros Recomendados',
    accentColor: 'from-emerald-500 to-teal-700',
    iconText: '📖',
  },
  {
    id: 'robotica',
    tag: 'Ciências & Inovação',
    title: 'Iniciação Científica & Robótica Educacional',
    description:
      'Descubra como funcionam os computadores, crie experimentos de física e química em casa com materiais simples e aprenda lógica de programação.',
    category: 'Ciência & Tecnologia para Jovens',
    callToAction: 'Conhecer Projetos',
    accentColor: 'from-blue-500 to-indigo-600',
    iconText: '🔬',
  },
  {
    id: 'redacao',
    tag: 'Língua Portuguesa',
    title: 'Clube de Redação Nota 10 & Ortografia Fácil',
    description:
      'Dicas práticas de pontuação, conectivos, novos vocabulários e estruturas de texto para arrasar nas avaliações e no Enem.',
    category: 'Comunicação Escolar • Dicas Práticas',
    callToAction: 'Aprender Dicas',
    accentColor: 'from-purple-500 to-pink-600',
    iconText: '✍️',
  },
  {
    id: 'idiomas',
    tag: 'Línguas Estrangeiras',
    title: 'Inglês Prático para o Dia a Dia Escolar',
    description:
      'Pratique pronúncia, saudações, diálogos do cotidiano e vocabulário com pequenos desafios sonoros divertidos.',
    category: 'Inglês Estudantil • Nível Iniciante/Intermediário',
    callToAction: 'Praticar Vocabulário',
    accentColor: 'from-cyan-500 to-blue-600',
    iconText: '🌍',
  },
];

export const TaskExitInterstitialAd: React.FC<TaskExitInterstitialAdProps> = ({
  isOpen,
  taskTitle = 'Atividade de Estudos',
  earnedXp,
  onClose,
  theme = 'light',
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [canSkip, setCanSkip] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  // Seleciona um patrocinador rotativo ao abrir
  useEffect(() => {
    if (isOpen) {
      soundEffects.playSuccess();
      adMobService.recordTaskExitAdShown();
      setSponsorIndex(Math.floor(Math.random() * EDUCATIONAL_SPONSORS.length));
      setCountdown(3);
      setCanSkip(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSponsor = EDUCATIONAL_SPONSORS[sponsorIndex] || EDUCATIONAL_SPONSORS[0];
  const interstitialUnitId = getActiveInterstitialAdUnitId();
  const isLight = theme === 'light';

  const handleClose = () => {
    soundEffects.playClick();
    onClose();
  };

  return (
    <>
      <div
        id="task-exit-ad-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Anúncio ao sair da tarefa"
      >
        <div
          id="task-exit-ad-modal"
          className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-slate-900 border-slate-700 text-white'
          }`}
        >
          {/* Top Bar: Identificação Oficial AdMob e Famílias */}
          <div
            className={`px-4 py-2.5 border-b flex items-center justify-between gap-2 text-xs select-none ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Anúncio
              </span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Google AdMob
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-ad-privacy-info"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                title="Conformidade com a Política para Famílias do Google Play"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Classificação Livre</span>
              </button>

              <button
                type="button"
                id="btn-close-ad-top"
                onClick={handleClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Fechar anúncio"
                aria-label="Fechar anúncio"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tarefa Concluída / Status Feedback */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${
              isLight ? 'bg-emerald-50/70 border-emerald-100' : 'bg-emerald-950/20 border-emerald-900/30'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block">
                  Tarefa Finalizada
                </span>
                <h4 className="text-xs sm:text-sm font-black truncate text-slate-800 dark:text-slate-100">
                  {taskTitle}
                </h4>
              </div>
            </div>

            {earnedXp !== undefined && earnedXp > 0 && (
              <div className="shrink-0 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{earnedXp} XP</span>
              </div>
            )}
          </div>

          {/* Corpo do Anúncio Intersticial: Patrocinador Educacional */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            <div
              className={`rounded-xl p-4 border relative overflow-hidden transition-all shadow-sm ${
                isLight
                  ? 'bg-gradient-to-br from-slate-50 to-indigo-50/40 border-indigo-100'
                  : 'bg-gradient-to-br from-slate-800/90 to-indigo-950/40 border-indigo-900/40'
              }`}
            >
              {/* Badge da Categoria */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {currentSponsor.category}
                </span>
                <span className="text-xl select-none">{currentSponsor.iconText}</span>
              </div>

              {/* Título e Texto do Patrocinador */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight mb-2">
                {currentSponsor.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {currentSponsor.description}
              </p>

              {/* Tag temática e Botão informativo */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {currentSponsor.tag}
                </span>

                <button
                  type="button"
                  id="btn-sponsor-action"
                  onClick={() => {
                    soundEffects.playClick();
                    alert(
                      `📚 Patrocinador Educacional: "${currentSponsor.title}"\n\nEste é um conteúdo patrocinado educacional seguro, sem coleta de dados privados, em total conformidade com a Política para Famílias da Google Play.`
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <span>{currentSponsor.callToAction}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Caixa técnica explicativa e ID de conformidade do AdMob */}
            <div
              className={`p-3 rounded-lg border text-[11px] space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-800/50 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Tipo: Intersticial pós-tarefa
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                  {IS_TEST_MODE ? 'TEST_MODE' : 'PROD'}
                </span>
              </div>
              <div className="font-mono text-[10px] truncate text-slate-400">
                ID Bloco: {interstitialUnitId}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                ✓ Exibido apenas em momentos naturais de transição (saída ou fim de atividade), sem ficar o tempo todo na tela.
              </p>
            </div>
          </div>

          {/* Rodapé: Controles de Saída e Fechamento */}
          <div
            className={`p-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-2.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/80 border-slate-700'
            }`}
          >
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 select-none">
              {!canSkip ? (
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  Aguarde {countdown}s para pular...
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Pronto para continuar
                </span>
              )}
            </div>

            <button
              type="button"
              id="btn-ad-return-home"
              onClick={handleClose}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-95 ${
                canSkip
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <span>Continuar para o Início</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Transparência e Privacidade AdMob */}
      <AdMobPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        theme={theme}
      />
    </>
  );
};
