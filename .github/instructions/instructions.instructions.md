---
applyTo: "**"
---

## Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

## applyTo: '\*\*'

# 📘 Project Context – INGRWF-12 (CMS + API Nuxt 4)

## 🎯 Contexte

Ce projet vise à digitaliser un programme d’initiation à la course à pied.  
Il se compose de plusieurs modules :

- **CMS + API (Nuxt 4)** → Partie administrateur (gestion CRUD, export, suivi).
- **Application coureur** → (hors scope ici).

👉 Le périmètre de ce dépôt : **CMS + API**.

---

## 🔧 Stack technique

- **Framework** : Nuxt 4 (SSR activé).
- **Gestion d’état** : Pinia.
- **Requêtes API** : `useFetch()` (jamais `fetch` natif).
- **Backend** : Supabase (`supabase-js`), utilisé pour Auth + DB.
- **Styles** : TailwindCSS (fichier `assets/css/main.css`), thème glassmorphism sobre avec accents couleur logo (`/public`).
- **Déploiement** :
  - Client → Netlify
  - Backend/API → Hostinger (CI/CD).

---

## 📂 Structure attendue

assets/css/main.css # Styles globaux
components/ # UI components
layouts/ # Layouts (admin, auth…)
middleware/ # Middleware client (auth navigation)
pages/admin/ # Pages CMS admin
server/
├─ api/ # Endpoints Nuxt API (REST)
│ ├─ auth/ # Authentification
│ ├─ saisons/ # Gestion saisons
│ ├─ semaines/ # Gestion semaines
│ ├─ etapes/ # Gestion étapes
│ └─ exercices/ # Gestion exercices
├─ middleware/ # Middlewares server-side (auth, role-check)
stores/ # Pinia stores
public/ # Logos, assets statiques

markdown
Copier le code

---

## 🔑 Règles de développement

1. **Toujours utiliser `useFetch()`** dans les call api
2. **Jamais supprimer un fichier si erreur** → signaler l’erreur.
3. **Code toujours compatible SSR.**
4. **Pinia obligatoire** pour gérer état, getters et actions (API calls inclus).
5. **Endpoints API** (`server/api/*`) :
   - Toujours utiliser `supabase-js`.
   - Retourner un format standard :
     ```json
     { "success": true|false, "data"?: any, "error"?: string }
     ```
6. **Middleware** :
   - Côté `server/middleware` → vérifications server-side (auth/roles).
   - Côté `middleware/` → navigation côté client.
7. **Style UI** : Glassmorphism → fonds floutés, transparence douce, couleurs sobres + accents logo.

---

## 📌 Fonctionnalités principales

### Authentification

- Login/Logout (admin et coureur).
- Middleware auth obligatoire sur `/admin/*`.

### CRUD Formation

- Gestion `saisons`, `semaines`, `etapes`, `exercices`.
- Admin CRUD via UI CMS.

### Gestion des coureurs

- CRUD `user_profiles`.
- Suivi progression (table `progression`).

### Exports

- Admin → JSON (tous coureurs + progression).
- Coureur → CSV (sa progression).

---
