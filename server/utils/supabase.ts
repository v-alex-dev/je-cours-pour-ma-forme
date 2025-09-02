import { createClient } from '@supabase/supabase-js'

// Client côté serveur
export const createSupabaseClient = () => {
  const config = useRuntimeConfig()
  return createClient(
    config.public.SUPABASE_URL as string,
    config.public.SUPABASE_ANON_KEY as string
  )
}

// Types pour TypeScript
export interface UserProfile {
  id: string
  nom: string
  photo?: string
  role: 'admin' | 'coureur'
  created_at: string
  updated_at: string
}

export interface Saison {
  id: number
  nom: string
  description?: string
}

export interface Semaine {
  id: number
  numero: number
  saison_id: number
  saison?: Saison
}

export interface Etape {
  id: number
  nom: string
  semaine_id: number
  semaine?: Semaine
}

export interface Exercice {
  id: number
  nom: string
  description?: string
  duree?: number
}

export interface Progression {
  id: number
  user_id: string
  saison_id?: number
  semaine_id?: number
  etape_id?: number
  exercice_id?: number
  status: 'not_started' | 'in_progress' | 'completed'
  date: string
}

// Fonction utilitaire pour les erreurs
export const handleSupabaseError = (error: any) => {
  console.error('Erreur Supabase:', error)
  return {
    error: true,
    message: error.message || 'Erreur de base de données'
  }
}
