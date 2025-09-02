import { createSupabaseClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'authorization')
  
  if (!authorization?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token requis'
    })
  }

  const token = authorization.substring(7)
  const supabase = createSupabaseClient()

  try {
    // Vérifier le token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      })
    }

    // Récupérer le profil
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nom, role')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email,
      nom: profile?.nom || user.email?.split('@')[0] || 'Utilisateur',
      role: profile?.role || 'coureur'
    }
  } catch (error) {
    console.error('Erreur API /me:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur'
    })
  }
})
