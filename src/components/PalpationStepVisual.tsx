import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Video, Image } from 'lucide-react';

interface PalpationStepVisualProps {
  stepNumber: 1 | 2 | 3;
  photoUrl: string;
  photoAlt: string;
  stepTitle: string;
  effectiveOnline: boolean;
}

export const PalpationStepVisual: React.FC<PalpationStepVisualProps> = ({
  stepNumber,
  photoUrl,
  photoAlt,
  stepTitle,
  effectiveOnline,
}) => {
  // Manual override allows user to toggle photo/video
  const [manualViewMode, setManualViewMode] = useState<'auto' | 'video' | 'photo'>('auto');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const animFrameRef = useRef<number | null>(null);

  // If effectiveOnline is false, auto mode resolves to photo. If true, resolves to video.
  const activeMode =
    manualViewMode === 'auto'
      ? effectiveOnline
        ? 'video'
        : 'photo'
      : manualViewMode;

  // Video looping animation state
  useEffect(() => {
    if (activeMode !== 'video' || !isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let start = performance.now();
    const duration = 6000 / playbackSpeed; // 6s loop

    const stepLoop = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = (elapsed % duration) / duration;
      setVideoProgress(progress);
      animFrameRef.current = requestAnimationFrame(stepLoop);
    };

    animFrameRef.current = requestAnimationFrame(stepLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeMode, isPlaying, playbackSpeed]);

  const handleRestart = () => {
    setVideoProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-2">
      {/* Visual Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#dee8ff] aspect-[4/3] bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] shadow-inner select-none group">
        {activeMode === 'video' ? (
          /* ================= VIDEO DEMONSTRATION ================= */
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-950">
            {/* Step specific SVG animated video canvas */}
            <div className="relative w-full h-full flex items-center justify-center p-2">
              {stepNumber === 1 && (
                /* Step 1: Animated visual check in front of mirror */
                <svg viewBox="0 0 400 300" className="w-full h-full max-h-[260px]">
                  {/* Background Mirror Frame */}
                  <rect x="50" y="20" width="300" height="250" rx="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" />
                  <rect x="60" y="30" width="280" height="230" rx="12" fill="#0f172a" />
                  
                  {/* Mirror Reflection Sheen */}
                  <path d="M 70 35 L 200 35 L 120 250 L 70 250 Z" fill="white" opacity="0.04" />

                  {/* Silhouette Body */}
                  <g transform="translate(200, 150)">
                    {/* Head & Neck */}
                    <circle cx="0" cy="-75" r="22" fill="#fda4af" opacity="0.85" />
                    <rect x="-8" y="-55" width="16" height="18" rx="4" fill="#fb7185" />

                    {/* Torso */}
                    <path
                      d="M -45 -35 C -55 10, -45 50, -35 90 L 35 90 C 45 50, 55 10, 45 -35 Z"
                      fill="#f43f5e"
                      opacity="0.8"
                    />

                    {/* Breasts */}
                    <path d="M -35 -15 C -40 18, -10 22, -6 -15 Z" fill="#fb7185" />
                    <circle cx="-20" cy="5" r="3.5" fill="#be123c" />
                    <path d="M 6 -15 C 10 22, 40 18, 35 -15 Z" fill="#fb7185" />
                    <circle cx="20" cy="5" r="3.5" fill="#be123c" />

                    {/* Animated Arms: Cycles between 3 postures: 0-0.33 arms down, 0.33-0.66 arms raised, 0.66-1.0 hands on hips */}
                    {videoProgress < 0.33 ? (
                      /* Posture A: Bras le long du corps */
                      <g className="transition-all duration-300">
                        <path d="M -45 -35 Q -60 20 -55 70" stroke="#fda4af" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <path d="M 45 -35 Q 60 20 55 70" stroke="#fda4af" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <text x="0" y="80" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                          Bras le long du corps
                        </text>
                      </g>
                    ) : videoProgress < 0.66 ? (
                      /* Posture B: Bras levés au ciel */
                      <g className="transition-all duration-300">
                        <path d="M -45 -35 Q -70 -70 -40 -95" stroke="#fda4af" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <path d="M 45 -35 Q 70 -70 40 -95" stroke="#fda4af" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <text x="0" y="80" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                          Bras levés au-dessus de la tête
                        </text>
                      </g>
                    ) : (
                      /* Posture C: Mains sur les hanches (contraction pectorale) */
                      <g className="transition-all duration-300">
                        <path d="M -45 -35 Q -75 0 -42 40" stroke="#fda4af" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <path d="M 45 -35 Q 75 0 42 40" stroke="#fda4af" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <text x="0" y="80" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                          Mains sur les hanches
                        </text>
                      </g>
                    )}

                    {/* Scan indicator line moving vertically */}
                    <line
                      x1="-70"
                      y1={-35 + (videoProgress % 0.33) * 3 * 100}
                      x2="70"
                      y2={-35 + (videoProgress % 0.33) * 3 * 100}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      opacity="0.8"
                    />
                  </g>
                </svg>
              )}

              {stepNumber === 2 && (
                /* Step 2: Animated palpation under shower / standing with 3 fingers in circles */
                <svg viewBox="0 0 400 300" className="w-full h-full max-h-[260px]">
                  <rect width="400" height="300" fill="#0f172a" />
                  
                  {/* Concentric Guide Paths */}
                  <g transform="translate(190, 140)">
                    <circle cx="0" cy="0" r="85" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle cx="0" cy="0" r="55" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                    
                    {/* Breast Silhouette */}
                    <circle cx="0" cy="0" r="90" fill="#f43f5e" opacity="0.3" />
                    <circle cx="0" cy="0" r="90" fill="none" stroke="#fb7185" strokeWidth="3" />
                    
                    {/* Areola & Nipple */}
                    <circle cx="0" cy="0" r="22" fill="#be123c" opacity="0.7" />
                    <circle cx="0" cy="0" r="8" fill="#881337" />

                    {/* Axilla (Armpit) Zone upper right */}
                    <path d="M 60 -60 Q 110 -100 130 -60" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="110" y="-80" fill="#38bdf8" fontSize="10" fontWeight="bold">Zone aisselle</text>

                    {/* Calculating 3 Fingers Position along a Spiral path from outer to center */}
                    {(() => {
                      const angle = videoProgress * Math.PI * 6; // 3 full loops
                      const radius = 80 - videoProgress * 65; // from radius 80 to 15
                      const fx = Math.cos(angle) * radius;
                      const fy = Math.sin(angle) * radius;

                      return (
                        <g transform={`translate(${fx}, ${fy})`}>
                          {/* Ripple wave showing palpation pressure */}
                          <circle cx="0" cy="0" r="14" fill="#38bdf8" opacity="0.4" />
                          <circle cx="0" cy="0" r="8" fill="#38bdf8" opacity="0.8" />

                          {/* Hand with 3 Flat Fingers (Index, Middle, Ring) */}
                          <g transform="translate(0, 0)">
                            <rect x="-12" y="-5" width="7" height="24" rx="3.5" fill="#fde047" stroke="#854d0e" strokeWidth="1" />
                            <rect x="-3" y="-8" width="7" height="27" rx="3.5" fill="#fde047" stroke="#854d0e" strokeWidth="1" />
                            <rect x="6" y="-5" width="7" height="24" rx="3.5" fill="#fde047" stroke="#854d0e" strokeWidth="1" />
                            <path d="M -14 16 C -14 26, 14 26, 14 16 Z" fill="#fde047" />
                          </g>

                          <text x="18" y="5" fill="#ffffff" fontSize="9" fontWeight="bold">
                            Pulpe des 3 doigts
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                </svg>
              )}

              {stepNumber === 3 && (
                /* Step 3: Animated palpation lying on back with pillow */
                <svg viewBox="0 0 400 300" className="w-full h-full max-h-[260px]">
                  <rect width="400" height="300" fill="#0f172a" />

                  {/* Bed Surface */}
                  <line x1="30" y1="210" x2="370" y2="210" stroke="#334155" strokeWidth="3" />

                  {/* Wedge Pillow under shoulder */}
                  <polygon points="120,210 180,185 180,210" fill="#38bdf8" opacity="0.7" />
                  <text x="145" y="225" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    Coussin fin sous l'omoplate
                  </text>

                  {/* Body in Supine (Lying) Position */}
                  <g transform="translate(60, 110)">
                    {/* Head resting on bed */}
                    <circle cx="20" cy="70" r="18" fill="#fda4af" />
                    
                    {/* Raised arm behind head */}
                    <path d="M 35 75 Q 45 40 25 35" stroke="#fda4af" strokeWidth="10" strokeLinecap="round" fill="none" />

                    {/* Torso flattened on back */}
                    <path d="M 35 85 L 200 85 Q 220 95 240 100" stroke="#f43f5e" strokeWidth="16" strokeLinecap="round" fill="none" />

                    {/* Flattened Breast Profile */}
                    <path d="M 85 75 Q 120 40 155 75 Z" fill="#fb7185" />
                    <circle cx="120" cy="52" r="4" fill="#881337" />

                    {/* Vertical Strip Scanning Hand Motion */}
                    {(() => {
                      const cycle = (videoProgress * 2) % 1;
                      const pingPong = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2;
                      const hx = 90 + pingPong * 55;
                      
                      const pressure = videoProgress < 0.33 ? 'Pression douce' : videoProgress < 0.66 ? 'Pression moyenne' : 'Pression profonde';
                      const hy = videoProgress < 0.33 ? 46 : videoProgress < 0.66 ? 53 : 60;

                      return (
                        <g transform={`translate(${hx}, ${hy})`}>
                          <line x1="0" y1="-14" x2="0" y2="0" stroke="#fde047" strokeWidth="3" />
                          <circle cx="0" cy="0" r="9" fill="#fde047" opacity="0.6" />

                          <rect x="-8" y="-2" width="16" height="8" rx="4" fill="#fde047" stroke="#a16207" strokeWidth="1" />

                          <text x="14" y="-5" fill="#fde047" fontSize="10" fontWeight="bold">
                            {pressure}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                </svg>
              )}
            </div>

            {/* Video Controls Overlay Bar */}
            <div className="bg-black/75 backdrop-blur-sm px-3 py-2 flex items-center justify-between gap-2 border-t border-white/10 text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-7 h-7 rounded-full bg-[#ac2356] hover:bg-[#8f0341] flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                  title={isPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <button
                  onClick={handleRestart}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
                  title="Rejouer"
                >
                  <RotateCcw className="w-3 h-3 text-slate-300" />
                </button>
                <span className="text-[10px] font-bold text-slate-300">
                  {Math.floor(videoProgress * 6)}s / 6s
                </span>
              </div>

              {/* Progress Slider Bar */}
              <div className="flex-1 mx-2 bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#38bdf8] h-full transition-all duration-100"
                  style={{ width: `${videoProgress * 100}%` }}
                />
              </div>

              {/* Speed toggle */}
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 0.5 : 1)}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-slate-200 cursor-pointer"
                title="Vitesse"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>
        ) : (
          /* ================= PHOTO ================= */
          <div className="relative w-full h-full">
            <img
              src={photoUrl}
              alt={photoAlt}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Clean Switcher Strip: just Vidéo or Schéma without dev commentary */}
      <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px]">
        <div className="inline-flex rounded-lg p-0.5 bg-[#dee8ff]/60 border border-[#dee8ff]">
          <button
            onClick={() => setManualViewMode('video')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMode === 'video'
                ? 'bg-white text-[#111c2d] shadow-2xs'
                : 'text-[#574145] hover:text-[#111c2d]'
            }`}
          >
            <Video className="w-3 h-3 text-[#ac2356]" />
            <span>Vidéo</span>
          </button>
          <button
            onClick={() => setManualViewMode('photo')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMode === 'photo'
                ? 'bg-white text-[#111c2d] shadow-2xs'
                : 'text-[#574145] hover:text-[#111c2d]'
            }`}
          >
            <Image className="w-3 h-3 text-[#006a61]" />
            <span>Schéma</span>
          </button>
        </div>
      </div>
    </div>
  );
};
