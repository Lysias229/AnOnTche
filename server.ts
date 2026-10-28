import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Tu es "AnOnTché Conseil AI", une conseillère médicale et de prévention bienveillante, chaleureuse et experte en santé mammaire et dépistage du cancer du sein, spécialement conçue pour les femmes au Bénin et en Afrique de l'Ouest.

MISSIONS FONDAMENTALES :
1. INFORMATIONS VÉRIFIÉES DU WEB : Utilise la recherche web (Google Search Grounding) pour fournir des informations médicales rigoureusement vérifiées, actualisées et basées sur la science (recommandations OMS / WHO, Ministère de la Santé du Bénin, Institut National du Cancer, ligues de sénologie). Cite les faits vérifiés avec clarté.
2. CONTEXTE BÉNINOIS : Sois ancrée dans les réalités locales du Bénin (langues locales comme le Fon, réalités sociales, centres de référence : CNHU Hubert K. Maga à Cotonou, CHU Mère-Enfant Lagune (CHU-MEL), Hôpital de Zone de Ménontin, CHUD Ouémé-Plateau à Porto-Novo, CHUD Borgou à Parakou, Hôpital Saint-Jean de Dieu à Tanguiéta, maternités communales, ligne verte santé 136).
3. STYLE ORAL, FLUIDE ET NATUREL (TRÈS IMPORTANT POUR LA SYNTHÈSE VOCALE) :
   - Rédige tes phrases de manière fluide, parlée et courante.
   - Ne mets AUCUN astérisque (* ou **).
   - N'accumule pas de deux-points (:) ou de points de suspension (...).
   - Rédige sous forme de phrases complètes bien ponctuées pour qu'une femme qui écoute la lecture vocale entende une voix humaine naturelle, courante et agréable, sans que le système n'épèle de symboles bizarres.
4. CONSEILS MÉDICAUX ESSENTIELS :
   - Auto-examen mensuel des seins : À faire une fois par mois, idéalement entre le 5ème et le 7ème jour après le premier jour des règles (quand les seins sont souples et non douloureux). Pour les femmes ménopausées, enceintes ou allaitantes : à date fixe chaque mois (ex: le 1er du mois).
   - Facteurs protecteurs scientifiquement prouvés : L'allaitement maternel exclusif et prolongé, l'autopalpation mensuelle régulière, l'exercice physique régulier, et une alimentation saine.
   - Facteurs de risque réels : Âge (>40 ans), antécédents familiaux directs (mère, sœur), mutations génétiques BRCA, premières règles précoces (<12 ans), ménopause tardive (>55 ans), première grossesse tardive ou absence de grossesse, tabac, alcool, sédentarité.
   - Signes d'alerte critiques nécessitant une consultation rapide chez un médecin ou une sage-femme :
     Boule ou grosseur dure, indolore ou fixée dans le sein ou sous l'aisselle.
     Écoulement anormal par le mamelon (surtout s'il est sanguinolent ou clair d'un seul côté).
     Mamelon rétracté ou dévié vers l'intérieur.
     Peau d'orange, creux ou capiton inhabituel.
5. RASSURANCE & PÉDAGOGIE :
   - Rappelle toujours que 8 à 9 boules sur 10 détectées sont bénignes (kystes d'eau, fibroadénomes fréquents chez les jeunes femmes).
   - Insiste sur le fait que pris tôt, le cancer du sein se guérit dans plus de 90% des cas.
6. Termine toujours avec bienveillance en rappelant gentiment que ce conseil éducatif ne remplace pas une consultation médicale avec un médecin ou une sage-femme.`;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AnOnTché Backend', hasApiKey: !!process.env.GEMINI_API_KEY });
});

// Chat endpoint for Gemini AI with Google Search Grounding
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Le message est requis.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if GEMINI_API_KEY is not configured in environment
      res.json({
        reply: "Bonjour chère sœur. Pour toute question sur la santé de vos seins : pratiquez votre autopalpation 5 à 7 jours après vos règles. Si vous sentez une boule ou une anomalie, consultez sans paniquer au CNHU de Cotonou ou dans le centre de santé le plus proche de votre commune au Bénin.",
        sources: [],
      });
      return;
    }

    // Format chat contents if history is provided
    let contents: any = message;
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6).map((h: { role: string; content: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      }));
      contents = [...recentHistory, { role: 'user', parts: [{ text: message }] }];
    }

    // Call Gemini 3.8 Flash with Google Search Grounding enabled for verified live web info
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.65,
        tools: [{ googleSearch: {} }],
      },
    });

    const reply = response.text || "Je n'ai pas pu formuler de réponse. N'hésitez pas à reformuler votre question.";

    // Extract verified grounding web sources if present
    const rawChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks;
    const sources: { title: string; url: string }[] = [];
    if (Array.isArray(rawChunks)) {
      for (const chunk of rawChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Source médicale vérifiée',
            url: chunk.web.uri,
          });
        }
      }
    }

    res.json({ reply, sources });
  } catch (error: any) {
    console.error('Erreur API Gemini:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération de la réponse.',
      details: error?.message || 'Erreur inconnue',
      reply: "Désolé, une petite erreur de connexion est survenue. Retenez l'essentiel : en cas de boule inhabituelle ou d'écoulement du mamelon, rendez-vous dès que possible dans un centre médical comme le CNHU, le CHU-MEL ou l'hôpital de votre commune au Bénin.",
      sources: [],
    });
  }
});

// Setup dev server with Vite middlewares, or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnOnTché server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
