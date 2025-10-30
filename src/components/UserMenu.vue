<template>
  <div class="user-menu">
    <button @click="toggleMenu" class="user-button">
      <span class="emoji">👤</span>
      <span class="user-name">{{ user?.full_name || 'User' }}</span>
      <span class="emoji">{{ menuOpen ? '▲' : '▼' }}</span>
    </button>

    <Transition name="fade">
      <div v-if="menuOpen" class="menu-dropdown">
        <div class="menu-item user-info">
          <span class="emoji">📧</span>
          {{ user?.email }}
        </div>
        <div class="menu-divider"></div>
        <button @click="handleLogout" class="menu-item logout-item">
          <span class="emoji">🚪</span>
          Se déconnecter
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleLogout() {
  authStore.logout()
  menuOpen.value = false
}

function handleClickOutside(event) {
  const menu = document.querySelector('.user-menu')
  if (menu && !menu.contains(event.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-menu {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  animation: fadeIn 0.5s ease;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--card-bg);
  border: 2px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 12px var(--shadow);
  font-weight: 600;
  color: var(--text);
}

.user-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--shadow-lg);
  border-color: var(--primary);
}

.user-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 200px;
  background: var(--card-bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-lg);
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

.dark-mode .menu-dropdown {
  border-color: var(--border);
}

.menu-item {
  width: 100%;
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.95rem;
  color: var(--text);
  text-align: left;
}

.menu-item:hover {
  background: var(--light);
}

.user-info {
  cursor: default;
  font-size: 0.9rem;
  color: var(--text-light);
}

.user-info:hover {
  background: transparent;
}

.menu-divider {
  height: 1px;
  background: var(--border);
  margin: 0.25rem 0;
}

.logout-item {
  color: var(--danger);
  font-weight: 600;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 768px) {
  .user-menu {
    top: 4.5rem;
    left: 1rem;
  }
  
  .user-name {
    max-width: 100px;
  }
}
</style>
