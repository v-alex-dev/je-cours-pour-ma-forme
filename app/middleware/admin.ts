import { useAdminStore } from '@/store/adminStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const adminStore = useAdminStore()
  if (!adminStore.user || !adminStore.isAdmin) {
    return navigateTo('/login')
  }
})
