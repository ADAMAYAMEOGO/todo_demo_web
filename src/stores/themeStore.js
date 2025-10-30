import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Load from localStorage or default to light
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  // Watch for changes and persist
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    updateTheme()
  })

  function updateTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  // Initialize theme on load
  updateTheme()

  return {
    isDark,
    toggleTheme
  }
})
