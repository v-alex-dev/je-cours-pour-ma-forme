<template>
  <div class="admin-bg">
    <!-- Header -->
    <header class="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" class="h-8 w-auto" />
            <h1 class="text-xl font-bold gradient-text">Dashboard CMS</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-white/80">{{ user.email }}</span>
            <button 
              @click="handleLogout"
              class="glass-button px-4 py-2"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Statistiques -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold gradient-text mb-4">Statistiques</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-white/80">
              <span>Utilisateurs totaux</span>
              <span class="font-bold">{{ stats.totalUsers || 0 }}</span>
            </div>
            <div class="flex justify-between text-white/80">
              <span>Courses cette semaine</span>
              <span class="font-bold">{{ stats.weeklyRuns || 0 }}</span>
            </div>
            <div class="flex justify-between text-white/80">
              <span>Distance totale (km)</span>
              <span class="font-bold">{{ stats.totalDistance || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Gestion des utilisateurs -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold gradient-text mb-4">Utilisateurs</h3>
          <div class="space-y-3">
            <NuxtLink 
              to="/admin/users"
              class="block glass-button mb-2 p-3 text-center"
            >
              Gérer les utilisateurs
            </NuxtLink>
            <NuxtLink 
              to="/admin/users/new"
              class="block glass-button p-3 text-center"
              style="background: linear-gradient(135deg, var(--primary-green), var(--secondary-green)); color: var(--accent-blue);"
            >
              Ajouter un utilisateur
            </NuxtLink>
          </div>
        </div>

        <!-- Gestion du contenu -->
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold gradient-text mb-4">Contenu</h3>
          <div class="space-y-3">
            <NuxtLink 
              to="/admin/content"
              class="block glass-button mb-2 p-3 text-center"
            >
              Gérer le contenu
            </NuxtLink>
            <NuxtLink 
              to="/admin/courses"
              class="block glass-button p-3 text-center"
              style="background: linear-gradient(135deg, var(--primary-green), var(--secondary-green)); color: var(--accent-blue);"
            >
              Gérer les courses
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Tableau des dernières activités -->
      <div class="mt-8 glass-card">
        <div class="p-6 border-b border-white/20">
          <h3 class="text-lg font-semibold gradient-text">Dernières activités</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-white/5">
              <tr class="text-white/80 text-sm">
                <th class="text-left p-4">Utilisateur</th>
                <th class="text-left p-4">Action</th>
                <th class="text-left p-4">Date</th>
                <th class="text-left p-4">Distance (km)</th>
              </tr>
            </thead>
            <tbody class="text-white/90">
              <tr v-for="activity in recentActivities" :key="activity.id" class="border-t border-white/10">
                <td class="p-4">{{ activity.userName || '-' }}</td>
                <td class="p-4">{{ activity.action || '-' }}</td>
                <td class="p-4">{{ formatDate(activity.date) }}</td>
                <td class="p-4">{{ activity.distance || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>
        
   

<script setup>
// Récupération des données côté serveur avec vérification admin
const { data: user } = await useFetch('/api/auth/me')
const { data: stats } = await useFetch('/api/admin/stats', {
  default: () => ({ totalUsers: 0, weeklyRuns: 0, totalDistance: 0 })
})
const { data: recentActivities } = await useFetch('/api/admin/activities', {
  query: { limit: 10 },
  default: () => []
})

// Redirection si pas d'utilisateur ou pas admin
if (!user.value || user.value.role !== 'admin') {
  await navigateTo('/login')
}

// Gestion de la déconnexion
const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Utilitaire pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
