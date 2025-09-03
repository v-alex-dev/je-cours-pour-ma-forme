// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true , updateCheck:false},
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    }
  },
  nitro:{
    routeRules:{
      '/api/**': { cors: true }
    }
  },
  modules: ['@nuxt/icon', '@nuxt/fonts', '@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  }
})