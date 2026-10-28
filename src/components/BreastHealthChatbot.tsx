import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  AlertCircle,
  WifiOff,
  CheckCircle,
  HelpCircle,
  Globe,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useOnlineStatus } from '../utils/useOnlineStatus';
import { AnOnTcheText } from './BreastOIcon';
import { sanitizeTextForSpeech } from '../utils/speechSanitizer';

interface ChatSource {
  title: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
  sources?: ChatSource[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    text: "Bonjour chère sœur. Je suis votre assistante d'écoute et d'information AnOnTché.\n\nPosez-moi toutes vos questions en toute intimité. Mes réponses s'appuient sur des informations médicales vérifiées du web, des recommandations officielles et des centres de santé au Bénin. Que souhaitez-vous savoir ?",
    timestamp: 'À l\'instant',
  },
];

const SUGGESTIONS = [
  "J'ai senti une petite boule indolore, que faire ?",
  "Quel est le meilleur moment pour palper mes seins ?",
  "Où faire une mammographie à Cotonou ou Parakou ?",
  "L'allaitement protège-t-il vraiment du cancer ?",
  "La palpation fait-elle mal ?",
  "Quels sont les vrais signes d'alerte ?",
];

// Offline clinical knowledge base for 100% offline reliability
const OFFLINE_KNOWLEDGE: { keywords: string[]; answer: string; sources: ChatSource[] }[] = [
  {
    keywords: ['boule', 'grosseur', 'nodule', 'indolore', 'masse'],
    answer:
      "Si vous sentez une boule ou une grosseur, restez sereine. Dans huit à neuf cas sur dix, il s'agit d'une anomalie bénigne comme un kyste d'eau ou un fibroadénome fréquent chez les femmes jeunes. Prenez rendez-vous sans tarder avec une sage-femme ou un médecin, par exemple au CNHU de Cotonou ou au centre de santé de votre commune. Seule une échographie ou une mammographie permet de confirmer le diagnostic avec certitude.",
    sources: [
      { title: 'Recommandations OMS Dépistage', url: 'https://www.who.int' },
      { title: 'Guide Clinique Sénologie Bénin', url: 'https://sante.gouv.bj' },
    ],
  },
  {
    keywords: ['moment', 'quand', 'cycle', 'règles', 'période', 'date'],
    answer:
      "Le moment idéal pour examiner vos seins se situe entre le cinquième et le septième jour après le premier jour de vos règles. À cette période du cycle, vos seins sont particulièrement souples et non douloureux. Si vous êtes ménopausée, enceinte ou sous contraception sans règles, choisissez simplement une date fixe chaque mois, par exemple le premier jour du mois.",
    sources: [
      { title: 'Institut National du Cancer (INCa)', url: 'https://www.e-cancer.fr' },
    ],
  },
  {
    keywords: ['centre', 'cotonou', 'parakou', 'hôpital', 'mammographie', 'porto-novo', 'où'],
    answer:
      "Plusieurs centres de référence vous accueillent au Bénin. À Cotonou, vous pouvez vous rendre au CNHU Hubert Koutoukou Maga dans le service de gynécologie, au CHU Mère-Enfant Lagune ou à l'Hôpital de Ménontin. À Porto-Novo, le CHUD Ouémé-Plateau assure le dépistage. À Parakou, vous avez le CHUD Borgou-Alibori, et dans le Nord l'Hôpital Saint-Jean de Dieu de Tanguiéta. Vous pouvez également composer gratuitement le 136, la ligne verte santé du Bénin.",
    sources: [
      { title: 'Ministère de la Santé du Bénin', url: 'https://sante.gouv.bj' },
      { title: 'CNHU-HKM Cotonou', url: 'https://sante.gouv.bj' },
    ],
  },
  {
    keywords: ['allaitement', 'allaiter', 'sein', 'lait', 'protège'],
    answer:
      "L'allaitement maternel exclusif et prolongé constitue un véritable bouclier protecteur prouvé par les études scientifiques mondiales. En réduisant le nombre total de cycles ovulatoires au cours de votre vie, il diminue l'exposition globale aux hormones oestrogènes. Il aide également les cellules glandulaires du sein à atteindre une maturation complète, les rendant beaucoup plus résistantes aux anomalies.",
    sources: [
      { title: 'Organisation Mondiale de la Santé (OMS)', url: 'https://www.who.int' },
    ],
  },
  {
    keywords: ['mal', 'douleur', 'douloureux', 'fait mal'],
    answer:
      "L'autopalpation mensuelle ne doit jamais faire mal. Le geste doit être effectué avec la pulpe douce des doigts bien à plat et non avec la pointe des ongles. Une tension des seins avant les règles est naturelle à cause des variations hormonales. C'est précisément pour cela qu'il convient d'attendre cinq à sept jours après le début des règles pour faire l'examen dans le plus grand confort.",
    sources: [
      { title: 'Société Française de Sénologie', url: 'https://www.senologie.com' },
    ],
  },
  {
    keywords: ['signe', 'alerte', 'symptôme', 'danger', 'peau'],
    answer:
      "Les principaux signes d'alerte à montrer sans attendre à un médecin ou une sage-femme sont : une boule dure et non douloureuse qui ne bouge pas, un écoulement inhabituel par le mamelon notamment s'il contient du sang, un mamelon qui rentre vers l'intérieur, une peau d'orange ou un creux inhabituel, ainsi qu'un ganglion gonflé sous l'aisselle. Détecté de façon précoce, le cancer du sein se guérit dans plus de neuf cas sur dix.",
    sources: [
      { title: 'Recherche Web Médicale & OMS', url: 'https://www.who.int' },
      { title: 'Ligue contre le Cancer', url: 'https://www.ligue-cancer.net' },
    ],
  },
];

interface BreastHealthChatbotProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const BreastHealthChatbot: React.FC<BreastHealthChatbotProps> = ({
  isOpen: controlledIsOpen,
  onOpen: controlledOnOpen,
  onClose: controlledOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (val: boolean) => {
    if (val) {
      if (controlledOnOpen) controlledOnOpen();
      else setInternalIsOpen(true);
    } else {
      if (controlledOnClose) controlledOnClose();
      else setInternalIsOpen(false);
    }
  };

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('anontche_chat_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  const { effectiveOnline } = useOnlineStatus();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Save messages in session
  useEffect(() => {
    try {
      sessionStorage.setItem('anontche_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Fluent voice read-aloud: sanitizes text so speech synthesis never reads *, :, ., etc.
  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setActiveSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text to achieve fluent, human French speech without punctuation spelling
    const fluentSpokenText = sanitizeTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(fluentSpokenText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.94; // Fluent, natural pace
    utterance.pitch = 1.02;

    // Pick best available French voice
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice =
      voices.find((v) => v.lang.startsWith('fr') && !v.name.includes('Compact')) ||
      voices.find((v) => v.lang.startsWith('fr'));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onend = () => setActiveSpeakingId(null);
    utterance.onerror = () => setActiveSpeakingId(null);

    window.speechSynthesis.speak(utterance);
    setActiveSpeakingId(messageId);
  };

  // Stop voice when closing
  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeakingId(null);
    setIsOpen(false);
  };

  // Find offline answer if network is unavailable
  const getOfflineAnswer = (query: string): { text: string; sources: ChatSource[] } => {
    const q = query.toLowerCase();
    for (const item of OFFLINE_KNOWLEDGE) {
      if (item.keywords.some((k) => q.includes(k))) {
        return { text: item.answer, sources: item.sources };
      }
    }
    return {
      text: "Je suis actuellement en mode hors connexion. Retenez les recommandations clés : effectuez votre autopalpation cinq à sept jours après vos règles. Si vous remarquez une grosseur ou un écoulement suspect, rendez-vous dès que possible dans le centre de santé le plus proche de votre commune au Bénin.",
      sources: [{ title: 'Centre de Santé Communal Bénin', url: 'https://sante.gouv.bj' }],
    };
  };

  // Submit query
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // If offline, use instant built-in clinical answers with verified sources
    if (!effectiveOnline) {
      setTimeout(() => {
        const offlineData = getOfflineAnswer(messageContent);
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: offlineData.text,
          sources: offlineData.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // Call server-side Gemini API route with Google Search Grounding
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: messages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply || getOfflineAnswer(messageContent).text,
        sources: Array.isArray(data.sources) && data.sources.length > 0 ? data.sources : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Fallback chatbot answering:', err);
      // Seamless clinical fallback
      const fallbackData = getOfflineAnswer(messageContent);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: fallbackData.text,
        sources: fallbackData.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeakingId(null);
    setMessages(INITIAL_MESSAGES);
    try {
      sessionStorage.removeItem('anontche_chat_messages');
    } catch {}
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#ac2356] to-[#cd3e6e] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group border-2 border-white/30"
          title="Ouvrir l'assistant AnOnTché Conseil"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#86f2e4] ring-2 ring-white" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-black tracking-wide leading-tight">
              AnOnTché Conseil
            </span>
            <span className="block text-[10px] text-pink-100 font-medium">
              Écoute & Orientation
            </span>
          </div>
        </button>
      )}

      {/* Chat Window Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-72 rounded-2xl shadow-xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[460px] h-[92vh] sm:h-[640px] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl'
          } bg-white border border-[#dee8ff] flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#ac2356] via-[#cd3e6e] to-[#ac2356] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold tracking-tight">
                    AnOnTché Conseil
                  </h3>
                  {effectiveOnline ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[10px] font-bold">
                      En ligne
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-100 text-[10px] font-bold">
                      Hors-ligne
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-pink-100/90 leading-tight">
                  Santé du sein & Prévention au Bénin
                </p>
              </div>
            </div>

            {/* Header controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center cursor-pointer transition-colors"
                title="Effacer la conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center cursor-pointer transition-colors"
                title={isMinimized ? 'Agrandir' : 'Réduire'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
                {/* Offline alert banner if offline */}
                {!effectiveOnline && (
                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="leading-tight text-[11px]">
                      Mode hors-ligne : vous pouvez poser vos questions en toute tranquillité.
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-[#ac2356] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                        A
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        msg.role === 'user'
                          ? 'bg-[#ac2356] text-white rounded-tr-xs'
                          : 'bg-white text-[#111c2d] border border-[#e2e8f0] rounded-tl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Verified Web Sources Cards */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                          <span className="text-[10px] font-extrabold text-[#006a61] flex items-center gap-1">
                            <Globe className="w-3 h-3 text-[#006a61]" />
                            <span>En savoir plus :</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {msg.sources.slice(0, 3).map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e6fffa] hover:bg-[#b2f5ea] text-[#006a61] text-[10px] font-semibold border border-[#81e6d9] transition-colors"
                              >
                                <span className="max-w-[170px] truncate">{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message bottom bar with time and fluent voice button for bot responses */}
                      <div
                        className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t ${
                          msg.role === 'user'
                            ? 'border-white/20 text-white/70'
                            : 'border-slate-100 text-[#574145]'
                        } text-[10px]`}
                      >
                        <span>{msg.timestamp}</span>

                        {msg.role === 'assistant' && (
                          <button
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                              activeSpeakingId === msg.id
                                ? 'bg-[#ccfbf1] text-[#006a61]'
                                : 'hover:bg-slate-100 text-[#006a61]'
                            }`}
                            title="Écouter la réponse à voix haute (voix courante et fluide)"
                          >
                            {activeSpeakingId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-[#006a61]" />
                                <span>Arrêter la voix</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-[#006a61]" />
                                <span>Écouter (voix fluide)</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 items-center text-xs text-[#574145] animate-pulse">
                    <div className="w-7 h-7 rounded-full bg-[#ac2356] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      A
                    </div>
                    <div className="bg-white border border-[#dee8ff] rounded-2xl px-3.5 py-2 rounded-tl-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#ac2356] animate-spin" />
                      <span>AnOnTché prépare votre réponse...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Chips */}
              <div className="p-2.5 bg-white border-t border-[#dee8ff] overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-[#574145] uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
                  <HelpCircle className="w-3 h-3 text-[#ac2356]" />
                  <span>Suggestions :</span>
                </span>
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSendMessage(sug)}
                    className="px-2.5 py-1 rounded-full bg-[#f0f3ff] hover:bg-[#ffd9e0] hover:text-[#8f0341] border border-[#dee8ff] text-[#111c2d] text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="p-3 bg-white border-t border-[#dee8ff] shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Posez votre question en toute intimité..."
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 rounded-full border border-[#dee8ff] focus:border-[#ac2356] focus:ring-2 focus:ring-[#ffd9e0] text-xs outline-none bg-slate-50/50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="w-9 h-9 rounded-full bg-[#ac2356] hover:bg-[#8f0341] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-xs"
                    title="Envoyer la question"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>

                {/* Medical Disclaimer Note */}
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#574145]/80 px-1 leading-tight">
                  <AlertCircle className="w-3 h-3 text-[#ac2356] shrink-0" />
                  <span>
                    Outil éducatif et préventif. Ne remplace pas une consultation médicale avec un professionnel de santé.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
