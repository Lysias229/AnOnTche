// Web Audio API engine for AnOnTché interactive game songs and melodies
// 100% offline-ready, zero latency, works without downloading external assets

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
}

// Play a pleasant synthesized note with harmonic richness and warm decay
function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'triangle',
  volume = 0.25
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  // Soft envelope: attack, sustain, decay
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// Percussive drum / kalimba beat for authentic African rhythm feel
function playDrumBeat(ctx: AudioContext, startTime: number, freq = 120, duration = 0.15) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  osc.frequency.exponentialRampToValueAtTime(30, startTime + duration);

  gain.gain.setValueAtTime(0.3, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// 🎵 Chanson de Victoire (Bonne réponse) : Fanfare entraînante & kalimba rythmée
export function playVictorySound(voicePraise = true) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + 0.05;

  // Rythme percussif (kalimba / tambour doux)
  playDrumBeat(ctx, now, 150, 0.12);
  playDrumBeat(ctx, now + 0.18, 180, 0.1);
  playDrumBeat(ctx, now + 0.36, 140, 0.14);
  playDrumBeat(ctx, now + 0.54, 200, 0.1);
  playDrumBeat(ctx, now + 0.72, 160, 0.2);

  // Gamme festive et triomphale (Sol, Do, Mi, Sol, Do aigu + accord final étincelant)
  // C4=261.63, E4=329.63, G4=392.00, C5=523.25, E5=659.25, G5=783.99, C6=1046.50
  playTone(ctx, 392.00, now, 0.2, 'triangle', 0.22); // Sol4
  playTone(ctx, 523.25, now + 0.16, 0.2, 'triangle', 0.24); // Do5
  playTone(ctx, 659.25, now + 0.32, 0.2, 'triangle', 0.26); // Mi5
  playTone(ctx, 783.99, now + 0.48, 0.25, 'triangle', 0.28); // Sol5
  playTone(ctx, 1046.50, now + 0.68, 0.7, 'sine', 0.3); // Do6 éclatant

  // Accord majeur festif de célébration en harmonie
  playTone(ctx, 261.63, now + 0.68, 0.8, 'triangle', 0.15); // Do4
  playTone(ctx, 329.63, now + 0.68, 0.8, 'triangle', 0.18); // Mi4
  playTone(ctx, 392.00, now + 0.68, 0.8, 'sine', 0.18); // Sol4
  playTone(ctx, 523.25, now + 0.68, 0.8, 'sine', 0.2); // Do5

  // Chant vocal d'acclamation en français
  if (voicePraise && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const phrases = [
        "Bravo ! Très bonne réponse !",
        "Excellente réponse ! AnOnTché te félicite !",
        "Superbe ! Tu maîtrises parfaitement la santé du sein !"
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      const utter = new SpeechSynthesisUtterance(randomPhrase);
      utter.lang = 'fr-FR';
      utter.rate = 1.05;
      utter.pitch = 1.15; // Ton joyeux et mélodieux
      setTimeout(() => {
        window.speechSynthesis.speak(utter);
      }, 700);
    } catch (e) {}
  }
}

// 🎶 Chanson d'Encouragement (Mauvaise réponse) : Mélodie douce, réconfortante et rythmée
export function playWrongAnswerSound(voiceCheer = true) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + 0.05;

  // Battement doux
  playDrumBeat(ctx, now, 100, 0.2);
  playDrumBeat(ctx, now + 0.28, 90, 0.25);

  // Mélodie douce et bienveillante (non punitive, réconfortante)
  // G4=392.00 -> F4=349.23 -> Eb4=311.13 -> G4=392.00 -> Bb4=466.16
  playTone(ctx, 440.00, now, 0.22, 'sine', 0.18); // La4
  playTone(ctx, 392.00, now + 0.20, 0.22, 'sine', 0.18); // Sol4
  playTone(ctx, 349.23, now + 0.40, 0.35, 'triangle', 0.16); // Fa4
  playTone(ctx, 392.00, now + 0.70, 0.5, 'sine', 0.2); // Rebond chaleureux vers Sol4

  // Encouragement vocal en français
  if (voiceCheer && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const phrases = [
        "Oups ! Pas d'inquiétude, lis l'explication et retente ta chance !",
        "Ce n'est pas la bonne réponse, mais courage ! Chaque erreur aide à apprendre !",
        "Courage ! Prends le temps de lire le conseil médical ci-dessous !"
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      const utter = new SpeechSynthesisUtterance(randomPhrase);
      utter.lang = 'fr-FR';
      utter.rate = 1.02;
      utter.pitch = 1.0;
      setTimeout(() => {
        window.speechSynthesis.speak(utter);
      }, 700);
    } catch (e) {}
  }
}

// 🏆 Grande Fanfare de Changement de Niveau (Level Up)
export function playLevelUpSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + 0.05;

  // Arpège ascendant magistral
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    playTone(ctx, freq, now + idx * 0.12, 0.3, 'triangle', 0.25);
    playDrumBeat(ctx, now + idx * 0.12, 160 + idx * 20, 0.1);
  });

  // Accord final triomphal
  const finalTime = now + notes.length * 0.12;
  playTone(ctx, 523.25, finalTime, 1.2, 'sine', 0.2);
  playTone(ctx, 659.25, finalTime, 1.2, 'sine', 0.22);
  playTone(ctx, 783.99, finalTime, 1.2, 'sine', 0.25);
  playTone(ctx, 1046.50, finalTime, 1.5, 'triangle', 0.28);

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance("Félicitations ! Tu passes au niveau supérieur ! Ton dévouement sauve des vies !");
      utter.lang = 'fr-FR';
      utter.rate = 1.05;
      utter.pitch = 1.15;
      setTimeout(() => {
        window.speechSynthesis.speak(utter);
      }, 1000);
    } catch (e) {}
  }
}
