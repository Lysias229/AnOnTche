/**
 * Nettoie et transforme le texte écrit en un texte parlé naturel et fluide
 * pour la synthèse vocale (Web SpeechSynthesis).
 * 
 * Évite formellement que le moteur vocal ne prononce les caractères typographiques :
 * - Pas de prononciation des astérisques "*", "**", "#"
 * - Pas de prononciation des deux-points ":" (remplacés par une courte pause respiratoire)
 * - Pas de "point-point-point" pour les points de suspension "..."
 * - Pas de prononciation des puces "•", des tirets ou des slashs
 * - Suppression des emojis qui sont parfois épelés par les voix mobiles
 * - Transformation des listes "1.", "2." en transitions orales fluides ("Premièrement", "Deuxièmement", etc.)
 */
export function sanitizeTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Supprimer les URLs et liens
  text = text.replace(/https?:\/\/\S+/gi, '');

  // 2. Supprimer les balises et le formatage markdown (gras, italique, barré, titres)
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '$1'); // gras et italique
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');     // gras
  text = text.replace(/\*(.*?)\*/g, '$1');         // italique ou astérisque isolé
  text = text.replace(/_{1,2}(.*?)_{1,2}/g, '$1'); // souligné
  text = text.replace(/^#{1,6}\s+/gm, '');         // titres markdown

  // 3. Supprimer les blocs de code et citations markdown
  text = text.replace(/`{1,3}[^`]*`{1,3}/g, '');
  text = text.replace(/^\s*>\s*/gm, '');

  // 4. Supprimer les emojis (les voix les lisent souvent textuellement)
  text = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // 5. Remplacer les puces de listes par un simple espace
  text = text.replace(/^\s*[\u2022\u2023\u25E6\u2043\u2219\*\-\+]\s+/gm, ' ');
  text = text.replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, ' ');

  // 6. Remplacer les listes numérotées par une articulation orale naturelle
  text = text.replace(/^\s*1[\.\)]\s+/gm, 'Premièrement, ');
  text = text.replace(/^\s*2[\.\)]\s+/gm, 'Deuxièmement, ');
  text = text.replace(/^\s*3[\.\)]\s+/gm, 'Troisièmement, ');
  text = text.replace(/^\s*4[\.\)]\s+/gm, 'Quatrièmement, ');
  text = text.replace(/^\s*5[\.\)]\s+/gm, 'Cinquièmement, ');
  text = text.replace(/^\s*(\d+)[\.\)]\s+/gm, 'Point $1, ');

  // 7. Traiter les deux-points ":" pour éviter que la voix ne dise "deux-points"
  // Avant un saut de ligne ou un espace -> remplacer par une pause naturelle (virgule ou point)
  text = text.replace(/:\s*(\r\n|\n|\r)/g, '. ');
  text = text.replace(/:\s+/g, ', ');
  text = text.replace(/:/g, ', ');

  // 8. Remplacer les points de suspension "..." par un point unique
  text = text.replace(/\.{2,}/g, '. ');

  // 9. Supprimer les symboles parasites : astérisques, dièses, barres, crochets, tildes
  text = text.replace(/[\*\#\~\|\^\/\\_]/g, ' ');
  text = text.replace(/[\[\]\{\}\<\>]/g, ' ');

  // 10. Nettoyer les répétitions de ponctuation comme "?!", ",,", ".."
  text = text.replace(/([,\.\?!;])\1+/g, '$1');
  text = text.replace(/,\s*\./g, '.');
  text = text.replace(/;\s*/g, ', ');

  // 11. Transformer les retours à la ligne en pauses respiratoires (points)
  text = text.replace(/(\r\n|\n|\r)+/g, '. ');

  // 12. Supprimer les doubles espaces
  text = text.replace(/\s+/g, ' ').trim();

  // 13. Assurer un espacement régulier après la ponctuation
  text = text.replace(/\s*([,\.\?!])\s*/g, '$1 ');

  return text.trim();
}
