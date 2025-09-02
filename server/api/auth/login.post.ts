import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.SUPABASE_URL as string,
    config.public.SUPABASE_ANON_KEY as string
  )
  const { email, password } = await readBody(event)

  try {
    // Connexion avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }

    // Récupérer le profil utilisateur pour vérifier le rôle
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, nom, role')
      .eq('id', authData.user.id)
      .single()

    console.log('Profile query result:', { profile, profileError })

    // Si pas de profil trouvé, créer un profil coureur par défaut
    if (profileError) {
      console.log('Erreur profil:', profileError)
      
      // Essayer de créer le profil s'il n'existe pas
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          nom: authData.user.email?.split('@')[0] || 'Utilisateur',
          role: 'coureur'
        })
        .select()
        .single()

      if (createError) {
        console.log('Erreur création profil:', createError)
        // Fallback: utiliser les données auth
        return {
          message: 'Connexion réussie',
          user: {
            id: authData.user.id,
            email: authData.user.email,
            nom: authData.user.email?.split('@')[0] || 'Utilisateur',
            role: 'coureur'
          },
          token: authData.session.access_token
        }
      }

      return {
        message: 'Connexion réussie',
        user: {
          id: newProfile.id,
          email: authData.user.email,
          nom: newProfile.nom,
          role: newProfile.role
        },
        token: authData.session.access_token
      }
    }

    // Vérifier si l'utilisateur est admin
    if (profile.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès non autorisé. Droits administrateur requis.'
      })
    }

    return {
      user: authData.user,
      profile,
      session: authData.session
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la connexion'
    })
  }
})
