-- Script pour créer la structure de base de données
-- À exécuter dans le SQL Editor de Supabase

-- 1. Créer la table user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  photo TEXT,
  role VARCHAR(50) DEFAULT 'coureur' CHECK (role IN ('admin', 'coureur')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activer RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Les admins peuvent tout modifier
CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Créer un trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, nom, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', 'Utilisateur'),
    'coureur'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attacher le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Créer un admin de test (optionnel)
-- Tu peux maintenant t'inscrire avec cpg-admin@gmail.com via l'interface
-- et ensuite exécuter cette requête pour le promouvoir admin :

-- UPDATE public.user_profiles 
-- SET role = 'admin', nom = 'Cepegra Admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'cpg-admin@gmail.com'
-- );
