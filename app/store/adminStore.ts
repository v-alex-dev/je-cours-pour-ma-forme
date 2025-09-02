import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
}

interface UserProfile {
  id: string
  nom: string
  photo?: string
  role: 'admin' | 'coureur'
  created_at: string
  updated_at: string
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isAdmin: false,
    user: null as User | null,
    profile: null as UserProfile | null,
    session: null as any,
    token: null as string | null, // Ajout du token
    isLoading: false,
    error: null as string | null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user && state.isAdmin,
    userName: (state) => state.profile?.nom || state.user?.email || '',
  },
  
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null
      try {
        const data = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        }) as any
        this.user = data.user
        this.profile = data.profile
        this.session = data.session
        this.token = data.session?.access_token || null // Stockage du token uniquement en mémoire
        this.isAdmin = data.profile.role === 'admin'
        return { success: true }
      } catch (error: any) {
        this.error = error.data?.message || 'Erreur de connexion'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
  }
},

async logout() {
  this.isLoading = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
        this.user = null
        this.profile = null
        this.session = null
        this.token = null
        this.isAdmin = false
        this.error = null
        await navigateTo('/admin/login')
      } catch (error: any) {
        console.error('Erreur lors de la déconnexion:', error)
      } finally {
        this.isLoading = false
      }
      }
    },
    
    clearError() {
      if(this.error !== null) {
        this.error = null
      } 
  },
})