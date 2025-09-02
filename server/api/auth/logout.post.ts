import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.SUPABASE_URL as string,
    config.public.SUPABASE_ANON_KEY as string
  )

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la déconnexion'
      })
    }

    return { message: 'Déconnexion réussie' }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la déconnexion'
    })
  }
})
