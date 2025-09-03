
import { createSupabaseClient } from '../../utils/supabase';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { email, password, nom, photo } = body;

  if (!email || !password || !nom) {
    return {
      success: false,
      error: 'Champs requis manquants (email, password, nom)'
    };
  }


  const supabase = createSupabaseClient();

  // Création de l'utilisateur dans Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nom }
    }
  });

  // Log technique côté serveur (console Nuxt)
  // eslint-disable-next-line no-console
  console.log('register.post.ts → signUpData:', signUpData);
  // eslint-disable-next-line no-console
  console.log('register.post.ts → signUpError:', signUpError);

  if (signUpError || !signUpData?.user) {
    return {
      success: false,
      error: signUpError?.message || 'Erreur lors de la création du compte.'
    };
  }

  // Création du profil utilisateur dans user_profiles
/*  const { error: profileError } = await supabase.from('user_profiles').insert({
    id: signUpData.user.id,
    nom,
    photo: photo || null
  });

  if (profileError) {
    return {
      success: false,
      error: profileError.message
    };
  }*/

  return {
    success: true,
    data: {
      user: signUpData.user,
    }
  };
});
