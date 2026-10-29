import React, { useState } from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, Lock, Trash2, CheckCircle2, PhoneCall } from 'lucide-react';
import { AudioPlayButton } from './AudioPlayButton';
import { AnOnTcheText } from './BreastOIcon';

export type LegalTabType = 'confidentialite' | 'cgu' | 'medical';

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTabType;
  onClearAllData?: () => void;
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'confidentialite',
  onClearAllData,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isDataCleared, setIsDataCleared] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setShowClearConfirm(false);
      setIsDataCleared(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleConfirmClear = () => {
    if (onClearAllData) {
      onClearAllData();
      setIsDataCleared(true);
      setTimeout(() => {
        setIsDataCleared(false);
        setShowClearConfirm(false);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#dee8ff] flex flex-col">
        {/* En-tête */}
        <div className="px-5 py-4 border-b border-[#dee8ff] flex items-center justify-between bg-gradient-to-r from-[#fff5f7] to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#ffd9e0] text-[#8f0341] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#111c2d] flex items-center gap-1.5">
                <span>Mentions Légales & Protection</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ccfbf1] text-[#006a61]">
                  Bénin
                </span>
              </h2>
              <p className="text-[11px] text-[#574145]">
                Transparence, secret médical et respect de la vie privée
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0f3ff] text-[#574145] hover:text-[#111c2d] flex items-center justify-center transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-[#dee8ff] bg-[#f9f9ff] px-4 pt-2 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('confidentialite')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'confidentialite'
                ? 'border-[#ac2356] text-[#ac2356] bg-white rounded-t-xl font-extrabold shadow-2xs'
                : 'border-transparent text-[#574145] hover:text-[#111c2d]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Confidentialité & Données</span>
          </button>

          <button
            onClick={() => setActiveTab('cgu')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cgu'
                ? 'border-[#ac2356] text-[#ac2356] bg-white rounded-t-xl font-extrabold shadow-2xs'
                : 'border-transparent text-[#574145] hover:text-[#111c2d]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Conditions d'Utilisation</span>
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'medical'
                ? 'border-[#ba1a1a] text-[#ba1a1a] bg-white rounded-t-xl font-extrabold shadow-2xs'
                : 'border-transparent text-[#574145] hover:text-[#111c2d]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a]" />
            <span>Avertissement Médical Légal</span>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm text-[#574145] leading-relaxed">
          {/* Onglet Confidentialité */}
          {activeTab === 'confidentialite' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#f0fdf4] p-3 rounded-2xl border border-[#bbf7d0]">
                <div className="flex items-center gap-2 text-[#15803d]">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-bold text-xs">
                    Stockage 100% Local : Vos données ne quittent jamais votre téléphone.
                  </span>
                </div>
                <AudioPlayButton
                  id="legal-privacy-audio"
                  textFr="Politique de confidentialité. Toutes les informations que vous enregistrez sur vos règles ou votre auto-examen restent uniquement sur votre téléphone. Aucun serveur externe ne peut les voir ni les vendre. Vous pouvez effacer vos données à tout moment."
                  textFon="Acɛ towe kpo alɔkpa e e na cyɔn alɔ nǔ towe lɛ ji gbɔn e. Nǔ e a kplɔ́n bo wlan do an towe kpo sun towe kpo wu lɛ bǐ ɔ, ɖo alokan towe mɛ kɛɖɛ wɛ ye nɔ nɔ. Mɛɖé hɛn ɔ na mɔ ǎ. A hɛn ɔ a na sùnsùn ye bǐ hwenu ɖebǔ."
                  variant="compact"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  1. Principe du Stockage Local Exclusif (« Local-First »)
                </h3>
                <p>
                  L'application <AnOnTcheText iconClassName="w-[0.95em] h-[0.95em] text-[#ac2356]" /> Bénin est développée selon le principe de <strong>confidentialité dès la conception</strong>. Aucun compte obligatoire ni numéro de téléphone ne sont requis.
                </p>
                <p>
                  Les données de cycles et d'examens sont stockées uniquement dans la mémoire interne locale de votre navigateur (LocalStorage). Elles ne sont <strong>jamais transmises ni vendues</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  2. Conformité au Code du Numérique du Bénin (APDP)
                </h3>
                <p>
                  Conformément à la <strong>Loi n° 2017-20 du 20 avril 2018 portant Code du Numérique en République du Bénin</strong> :
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Aucun traceur publicitaire</strong> ni cookie de ciblage commercial.</li>
                  <li><strong>Zéro monétisation</strong> des données intimes de santé.</li>
                  <li><strong>Mode camouflage et verrouillage par code PIN</strong> pour protéger votre vie privée.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  3. Droit à l'Effacement Immédiat
                </h3>
                <p>
                  Vous pouvez réinitialiser l'application et supprimer toutes vos données enregistrées sur cet appareil à tout moment.
                </p>

                {onClearAllData && (
                  <div className="p-3.5 rounded-2xl bg-[#fff5f5] border border-[#fecdd3] space-y-2.5">
                    <span className="font-bold text-xs text-[#991b1b] flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-[#dc2626]" />
                      Effacer mes données locales de cet appareil
                    </span>
                    {!showClearConfirm ? (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-[#dc2626] text-[#dc2626] text-xs font-bold hover:bg-[#fee2e2] transition-colors cursor-pointer"
                      >
                        Réinitialiser toutes mes données
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleConfirmClear}
                          className="px-3 py-1.5 rounded-full bg-[#dc2626] text-white text-xs font-bold hover:bg-[#b91c1c] transition-colors cursor-pointer"
                        >
                          Oui, tout effacer
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                    {isDataCleared && (
                      <div className="text-xs font-bold text-[#15803d] flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                        Données effacées avec succès.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet CGU */}
          {activeTab === 'cgu' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  1. Service Public et Gratuité
                </h3>
                <p>
                  L'application <AnOnTcheText iconClassName="w-[0.95em] h-[0.95em] text-[#ac2356]" /> Bénin est une initiative de santé communautaire, gratuite et sans publicité, destinée à sensibiliser et guider les femmes au Bénin.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  2. Fonctionnement Hors-Ligne (PWA)
                </h3>
                <p>
                  L'application fonctionne même sans connexion Internet. Les fiches de palpation et les numéros d'urgence restent accessibles hors réseau sans consommer votre forfait.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  3. Annuaire Médical
                </h3>
                <p>
                  Les coordonnées des hôpitaux et centres de santé sont fournies à titre indicatif. Nous vous recommandons de composer le <strong>Numéro Vert 136</strong> pour confirmer les campagnes de dépistage en cours.
                </p>
              </div>
            </div>
          )}

          {/* Onglet Avertissement Médical */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#ffdad6]/60 border border-[#ffb4ab] space-y-2">
                <div className="flex items-center gap-2 text-[#ba1a1a]">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-black text-sm uppercase tracking-wide">
                    Avertissement Médical Légal
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#410002] leading-relaxed font-semibold">
                  Cette application est un outil éducatif de sensibilisation. Elle ne constitue en AUCUN CAS un acte médical, un diagnostic, ni un remplacement d'une consultation clinique auprès d'un médecin ou d'une sage-femme au Bénin.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  Quand consulter un professionnel de santé ?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#dee8ff]">
                    • Boule dure ou induration dans le sein ou l'aisselle
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dee8ff]">
                    • Écoulement anormal du mamelon (sang ou liquide clair)
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dee8ff]">
                    • Rétraction ou modification récente du mamelon
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dee8ff]">
                    • Peau d'orange, pli, méplat ou rougeur persistante
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#111c2d]">
                  Numéros d'Urgence et d'Orientation au Bénin
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <a
                    href="tel:136"
                    className="flex-1 p-3 rounded-2xl bg-[#ffd9e0] hover:bg-[#ffb4ab] border border-[#fecdd3] text-[#8f0341] font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-[#ac2356]" />
                      <span>Numéro Vert Santé Bénin</span>
                    </div>
                    <span className="text-base font-extrabold">136</span>
                  </a>

                  <a
                    href="tel:+22921300155"
                    className="flex-1 p-3 rounded-2xl bg-[#e7eeff] hover:bg-[#dee8ff] border border-[#cbd5e1] text-[#111c2d] font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Standard CNHU Cotonou</span>
                    <span className="text-xs font-semibold">+229 21 30 01 55</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pied de la modale */}
        <div className="px-5 py-3.5 border-t border-[#dee8ff] bg-[#f9f9ff] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[#574145] text-[11px] flex items-center gap-1.5">
            <span>© 2024-2026</span>
            <AnOnTcheText iconClassName="w-[1em] h-[1em] text-[#ac2356]" />
            <span>• Conforme APDP & Code du Numérique Bénin</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#ac2356] hover:bg-[#8f0341] text-white font-bold transition-colors cursor-pointer shadow-xs"
          >
            J'ai compris & Accepter
          </button>
        </div>
      </div>
    </div>
  );
};