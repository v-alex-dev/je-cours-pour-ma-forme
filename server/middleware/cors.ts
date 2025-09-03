// Middleware CORS universel pour Nuxt 4 API
// Place ce fichier dans server/middleware/cors.ts

export default defineEventHandler((event) => {
  // Autorise l'origine de ton app front (à adapter si besoin)
  setHeader(event, 'Access-Control-Allow-Origin', '*');
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
  setHeader(event, 'Access-Control-Allow-Credentials', 'true');

  // Répondre OK aux requêtes preflight (OPTIONS)
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 200;
    event.node.res.end();
    return;
  }
});
