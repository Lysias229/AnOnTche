import React, { useState } from 'react';
import { NavigationTab, UserProfile } from '../types';
import { Heart, Lock, Unlock, EyeOff, Download, X, Smartphone, Share2 } from 'lucide-react';
import { AnOnTcheText } from './BreastOIcon';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  brandVariant?: 'anontche' | 'rubanrose';
  userProfile: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onLockNow?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  userProfile,
  onOpenAuthModal,
  onOpenProfileModal,
  onLockNow,
}) => {
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  const handleInstall = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome !== 'accepted') {
        setShowInstallModal(true);
      }
    } else {
      setActivePlatform(isIOS ? 'ios' : 'android');
      setShowInstallModal(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e7eeff] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Titre */}
          <button
            onClick={() => onSelectTab('accueil')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ac2356] to-[#cd3e6e] flex items-center justify-center text-white shadow-md shadow-[#ac2356]/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#111c2d] flex items-center">
                  <AnOnTcheText iconClassName="w-[0.95em] h-[0.95em] mx-[0.5px] text-[#ac2356]" />
                  <span className="text-[#006a61] bg-[#e6fffa] px-1.5 py-0.5 rounded text-xs font-bold ml-1.5">BÉNIN</span>
                </span>
              </div>
              <p className="text-xs text-[#574145] font-medium hidden sm:block">
                Santé du sein & Prévention active
              </p>
            </div>
          </button>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {(['accueil', 'guide', 'risques', 'jeu', 'centres', 'suivi'] as NavigationTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => onSelectTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === tab
                    ? 'bg-[#cd3e6e] text-white shadow-sm'
                    : 'text-[#574145] hover:text-[#111c2d] hover:bg-[#f0f3ff]'
                }`}
              >
                {tab === 'accueil' && 'Accueil'}
                {tab === 'guide' && 'Guide Palpation'}
                {tab === 'risques' && 'Facteurs de Risque'}
                {tab === 'jeu' && '<Jeu>'}
                {tab === 'centres' && 'Centres Bénin'}
                {tab === 'suivi' && 'Mon Suivi'}
              </button>
            ))}
          </nav>

          {/* Boutons Droite : Installer + Espace Privé */}
          <div className="flex items-center gap-2">
            {!isInstalled && (
              <button
                onClick={handleInstall}
                title="Installer AnOnTché sur votre écran d'accueil"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#006a61] hover:bg-[#005049] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Installer l'app</span>
                <span className="sm:hidden">Installer</span>
              </button>
            )}

            {userProfile?.isAuthenticated ? (
              userProfile.isLocked ? (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] border border-[#fca5a5] text-xs font-bold cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span>Verrouillé</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  {onLockNow && (
                    <button
                      onClick={onLockNow}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#be123c] border border-[#fecdd3] text-xs font-bold cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-[#e11d48]" />
                      <span>Discrétion</span>
                    </button>
                  )}
                  <button
                    onClick={onOpenProfileModal}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f3ff] hover:bg-[#ffd9e0] text-[#111c2d] border border-[#dee8ff] cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#ac2356] text-white flex items-center justify-center text-xs font-bold">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffd9e0] hover:bg-[#ffb1c2] text-[#8f0341] text-xs font-bold cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Mon Espace</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Mobile */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none pt-1">
          {(['accueil', 'guide', 'risques', 'jeu', 'centres', 'suivi'] as NavigationTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onSelectTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                currentTab === tab ? 'bg-[#cd3e6e] text-white' : 'bg-[#f0f3ff] text-[#574145]'
              }`}
            >
              {tab === 'accueil' && 'Accueil'}
              {tab === 'guide' && 'Guide'}
              {tab === 'risques' && 'Risques'}
              {tab === 'jeu' && '<Jeu>'}
              {tab === 'centres' && 'Centres'}
              {tab === 'suivi' && 'Suivi'}
            </button>
          ))}
        </div>
      </div>

      {/* Mini-guide si le navigateur nécessite un clic manuel (iPhone ou ancien Chrome) */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-[#dee8ff] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#dee8ff]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ffd9e0] text-[#ac2356] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-[#111c2d]">Installer AnOnTché</h3>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-7 h-7 rounded-full bg-[#f0f3ff] text-[#574145] hover:text-black flex items-center justify-center font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex p-1 bg-[#f0f3ff] rounded-xl gap-1 text-xs font-bold">
              <button
                onClick={() => setActivePlatform('android')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activePlatform === 'android' ? 'bg-white text-[#006a61] shadow-2xs' : 'text-[#574145]'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setActivePlatform('ios')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activePlatform === 'ios' ? 'bg-white text-[#ac2356] shadow-2xs' : 'text-[#574145]'
                }`}
              >
                iPhone
              </button>
            </div>

            {activePlatform === 'android' ? (
              <div className="space-y-2 text-xs text-[#574145]">
                <p>1. Touchez les <strong>3 points verticaux (⋮)</strong> en haut à droite de Chrome.</p>
                <p>2. Choisissez <strong>« Installer l'application »</strong>.</p>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-[#574145]">
                <p>1. Dans Safari, touchez le bouton <strong>Partager</strong> <Share2 className="w-3 h-3 inline text-[#ac2356]" /> en bas.</p>
                <p>2. Faites défiler et touchez <strong>« Sur l'écran d'accueil »</strong> ➕.</p>
              </div>
            )}

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2 rounded-full bg-[#ac2356] text-white font-bold text-xs hover:bg-[#8f0341] cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </header>
  );
};