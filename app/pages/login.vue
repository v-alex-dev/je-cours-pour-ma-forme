<template>
  <div class="admin-bg flex items-center justify-center p-6">
    <div class="glass-card w-full max-w-md p-8 space-y-6">
      <!-- Logo et titre -->
      <div class="text-center space-y-4">
        <img 
          src="/logo.png" 
          alt="Je cours pour ma forme" 
          class="h-20 w-auto mx-auto"
        />
        <div>
          <h1 class="text-2xl font-bold gradient-text">
            Administration CMS
          </h1>
          <p class="text-white/80 text-sm mt-2">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>
      </div>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Champ email -->
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-white/90">
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            :class="[
              'glass-input w-full px-4 py-3 text-white placeholder-white/60',
              emailError && 'error-border'
            ]"
            placeholder="admin@exemple.com"
            :disabled="state.pending"
          />
          <p v-if="emailError" class="error-text text-xs">
            {{ emailError }}
          </p>
        </div>

        <!-- Champ mot de passe -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-white/90">
            Mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              :type="state.showPassword ? 'text' : 'password'"
              required
              :class="[
                'glass-input w-full px-4 py-3 pr-12 text-white placeholder-white/60',
                passwordError && 'error-border'
              ]"
              placeholder="••••••••"
              :disabled="state.pending"
            />
            <button
              type="button"
              @click="state.showPassword = !state.showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              :disabled="state.pending"
            >
              <Icon 
                :name="state.showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
                class="h-5 w-5" 
              />
            </button>
          </div>
          <p v-if="passwordError" class="error-text text-xs">
            {{ passwordError }}
          </p>
        </div>

        <!-- Message d'erreur général -->
        <div v-if="state.error" class="error-text text-sm text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          {{ state.error }}
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          :disabled="state.pending || !isFormValid"
          class="glass-button w-full py-3 px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="state.pending" class="flex items-center justify-center space-x-2">
            <Icon name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
            <span>Connexion...</span>
          </span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <!-- Informations supplémentaires -->
      <div class="text-center text-xs text-white/60 space-y-1">
        <p>Accès réservé aux administrateurs</p>
        <p class="font-mono">v1.0.0 - CMS Je cours pour ma forme</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAdminStore } from '@/store/adminStore'

definePageMeta({ layout: false })

const adminStore = useAdminStore()

const emailError = ref('')
const passwordError = ref('')

const formData = reactive({
  email: '',
  password: ''
})

const state = reactive({
  showPassword: false,
  pending: false,
  error: ''
})

const isFormValid = computed(() => {
  return formData.email.length > 0 &&
    formData.password.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
})

// Redirection si déjà connecté (client)
if (adminStore.isAuthenticated) {
  await navigateTo('/dashboard')
}

const handleLogin = async () => {
  state.error = ''
  emailError.value = ''
  passwordError.value = ''
  state.pending = true
  // Validation simple
  if (!formData.email) {
    emailError.value = 'Email requis'
    state.pending = false
    return
  }
  if (!formData.password) {
    passwordError.value = 'Mot de passe requis'
    state.pending = false
    return
  }
  try {
    const result = await adminStore.login(formData.email, formData.password)
    if (result.success && adminStore.isAdmin) {
      await navigateTo('/dashboard')
    } else {
      state.error = adminStore.error || 'Accès refusé'
    }
  } catch (err) {
    state.error = err?.data?.message || 'Erreur de connexion'
  } finally {
    state.pending = false
  }
}
</script> 