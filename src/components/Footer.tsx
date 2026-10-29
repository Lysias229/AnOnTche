import React from 'react';
import { AlertCircle, PhoneCall, ShieldCheck, FileText, Lock } from 'lucide-react';
import { AnOnTcheText } from './BreastOIcon';
import { LegalTabType } from './LegalTermsModal';

interface FooterProps {
  onOpenLegalModal?: (tab: LegalTabType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal }) => {
  return (
    <footer className="mt-16 border-t border-[#dee8ff] bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        {/* Medical disclaimer pill */}
        <button
          onClick={() => onOpenLegalModal && onOpenLegalModal('medical')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold uppercase tracking-wider hover:bg-[#ffcdcb] transition-colors cursor-pointer"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Avertissement Médical Légal Obligatoire</span>
        </button>

        <p className="text-xs sm:text-sm text-[#574145] leading-relaxed max-w-2xl mx-auto">
          Cette application est un support de sensibilisation et d'éducation sanitaire communautaire. Elle ne constitue en aucun cas un
          dispositif de diagnostic ni une consultation médicale. En cas d'anomalie ou de doute, consultez immédiatement
          un professionnel de santé au Bénin.
        </p>

        {/* Legal & Privacy Links */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#574145]">
          <button
            onClick={() => onOpenLegalModal && onOpenLegalModal('confidentialite')}
            className="inline-flex items-center gap-1.5 hover:text-[#ac2356] font-semibold transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#006a61]" />
            <span>Politique de Confidentialité (APDP Bénin)</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <button
            onClick={() => onOpenLegalModal && onOpenLegalModal('cgu')}
            className="inline-flex items-center gap-1.5 hover:text-[#ac2356] font-semibold transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#ac2356]" />
            <span>Conditions d'Utilisation (CGU)</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">•</span>

          <button
            onClick={() => onOpenLegalModal && onOpenLegalModal('medical')}
            className="inline-flex items-center gap-1.5 hover:text-[#ba1a1a] font-semibold transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ba1a1a]" />
            <span>Avertissement & Déontologie</span>
          </button>
        </div>

        {/* Bottom Credits & Emergency hotline */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#574145] border-t border-[#f0f3ff]">
          <span className="font-semibold text-[#111c2d] inline-flex items-center gap-1">
            <AnOnTcheText iconClassName="w-[1em] h-[1em] text-[#ac2356]" /> — Santé du Sein
          </span>
          <span>© 2024-2026 République du Bénin</span>
          <a
            href="tel:136"
            className="inline-flex items-center gap-1.5 font-bold text-[#ac2356] hover:underline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Numéro Vert Santé : 136 (Gratuit)
          </a>
        </div>
      </div>
    </footer>
  );
};