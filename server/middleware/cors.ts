// Middleware CORS universel pour Nuxt 4 API
// Place ce fichier dans server/middleware/cors.ts

export default defineEventHandler((event) => {
  // Origine front autorisée (adapter si besoin)
  const allowedOrigin = 'https://je-cours-pour-la-forme-app.vercel.app';
  setHeader(event, 'Access-Control-Allow-Origin', allowedOrigin);
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
