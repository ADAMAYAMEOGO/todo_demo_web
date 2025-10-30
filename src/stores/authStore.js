import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../api/axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  async function login(username, password) {
    loading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      
      const response = await apiClient.post('/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      token.value = response.data.access_token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      // Token sera automatiquement ajouté par l'intercepteur
      
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function checkAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      // Verify token is still valid
      try {
        await apiClient.get('/users/me')
        return true
      } catch (err) {
        await logout()
        return false
      }
    }
    return false
  }

  // Initialize user from localStorage
  if (token.value && localStorage.getItem('user')) {
    user.value = JSON.parse(localStorage.getItem('user'))
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    
    // Actions
    login,
    logout,
    checkAuth
  }
})
