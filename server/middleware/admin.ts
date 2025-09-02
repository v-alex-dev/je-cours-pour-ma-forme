import { createSupabaseClient } from '../utils/supabase'

// Server middleware pour protéger les routes API admin
export default defineEventHandler(async (event) => {
  // Uniquement pour les routes /api/admin/*
  if (!event.node.req.url?.startsWith('/api/admin/')) {
    return
  }

  // Vérifier le token d'authentification
  const authorization = getHeader(event, 'authorization')
  if (!authorization?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification requis'
    })
  }

  const token = authorization.substring(7)
  
  try {
    // Vérifier le token avec Supabase
    const supabase = createSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      })
    }

    // Vérifier si l'utilisateur est admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès refusé - droits administrateur requis'
      })
    }

    // Ajouter l'utilisateur au contexte
    event.context.user = user
    event.context.userProfile = profile
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 401,
      statusMessage: 'Erreur d\'authentification'
    })
  }
})
