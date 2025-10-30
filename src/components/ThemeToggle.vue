<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :title="isDark ? 'Mode clair' : 'Mode sombre'"
  >
    <Transition name="fade" mode="out-in">
      <span v-if="isDark" key="sun" class="theme-icon">☀️</span>
      <span v-else key="moon" class="theme-icon">🌙</span>
    </Transition>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

function toggleTheme() {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--card-bg);
  border: 2px solid var(--border);
  box-shadow: 0 4px 12px var(--shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: var(--transition);
  animation: fadeIn 0.5s ease;
}

.theme-toggle:hover {
  transform: translateY(-5px) rotate(20deg);
  box-shadow: 0 8px 20px var(--shadow-lg);
  border-color: var(--primary);
}

.theme-toggle:active {
  transform: translateY(-2px) rotate(20deg) scale(0.95);
}

.theme-icon {
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s ease infinite;
}

@media (max-width: 768px) {
  .theme-toggle {
    top: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
  }
  
  .theme-icon {
    font-size: 1.5rem;
  }
}
</style>
