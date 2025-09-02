
import { createSupabaseClient } from '../utils/supabase'

// Server middleware pour vérifier les tokens sur toutes les routes API
export default defineEventHandler(async (event) => {
  // Ignorer les routes publiques
  const url = event.node.req.url || ''
  
  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/public',
    '/api/_nuxt_icon' // Ajout pour laisser passer les icônes Nuxt
  ]
  
  // Si c'est une route publique, passer
  if (publicRoutes.some(route => url.startsWith(route))) {
    return
  }
  
  // Si ce n'est pas une route API, passer
  if (!url.startsWith('/api/')) {
    return
  }
  
  // Pour toutes les autres routes API, vérifier le token
  const authorization = getHeader(event, 'authorization')
  
  if (!authorization?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification requis'
    })
  }

  const token = authorization.substring(7)
  
  try {
    const userData = await verifySupabaseToken(token)
    // Ajouter les données utilisateur au contexte
    event.context.user = userData.user
    event.context.userRole = userData.role
  } catch (error) {
    throw error
  }
})

export const verifySupabaseToken = async (token: string) => {
  const supabase = createSupabaseClient()
  
  try {
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      })
    }

    // Récupérer le profil pour avoir le rôle
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return {
      user,
      role: profile?.role
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide'
    })
  }
}

export const extractUserFromEvent = async (event: any) => {
  const authorization = getHeader(event, 'authorization')
  
  if (!authorization?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant'
    })
  }

  const token = authorization.substring(7)
  return await verifySupabaseToken(token)
}