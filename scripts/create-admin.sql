-- Script pour créer un compte administrateur de test
-- À exécuter dans le SQL Editor de Supabase

-- 1. Créer un utilisateur admin via Supabase Auth
-- (Ceci doit être fait via l'interface d'inscription ou programmatiquement)
-- Email: admin@test.com
-- Mot de passe: Admin123!

-- 2. Une fois l'utilisateur créé, mettre à jour son rôle en admin
-- Remplacez 'USER_ID_HERE' par l'ID réel de l'utilisateur créé
UPDATE user_profiles 
SET role = 'admin', 
    nom = 'Cepegra'
WHERE id = 'USER_ID_HERE';

-- Ou si vous connaissez l'email :
UPDATE user_profiles 
SET role = 'admin', 
    nom = 'Cepegra'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'cpg-admin@gmail.com'
);

-- Vérifier que l'utilisateur admin a été créé correctement
SELECT 
  up.*,
  au.email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.role = 'admin';
