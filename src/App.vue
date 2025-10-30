<template>
  <div class="app-container">
    <LoginForm v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    
    <template v-else>
      <ThemeToggle ref="themeToggleRef" />
      <InstallPrompt />
      <UserMenu />
      
      <button @click="showHelp = true" class="help-button" title="Raccourcis clavier (?)">
        <span class="emoji">❓</span>
      </button>
      
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">
            <span class="emoji">✨</span>
            Ma Todo List
            <span class="emoji">✨</span>
          </h1>
          <p class="app-subtitle">Gérez vos tâches avec style</p>
        </div>
        <StatsBar v-if="stats" :stats="stats" />
      </header>

      <main class="app-main">
        <div class="todo-container">
          <Dashboard ref="dashboardRef" v-if="stats" :stats="stats" />
          <TodoForm ref="todoFormRef" @created="onTodoCreated" />
          <Filters ref="filtersRef" />
          <TodoList ref="todoListRef" />
        </div>
      </main>
      
      <AchievementsPanel />
      <CelebrationToast
        :message="celebrationMessage"
        :newAchievement="celebrationAchievement"
        :isAllComplete="isAllComplete"
      />

      <Transition name="fade">
        <div v-if="error" class="error-toast" @click="error = null">
          <span class="emoji">⚠️</span>
          {{ error }}
        </div>
      </Transition>
      
      <ShortcutsHelp :show="showHelp" @close="showHelp = false" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTodoStore } from './stores/todoStore'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import Filters from './components/Filters.vue'
import StatsBar from './components/StatsBar.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import LoginForm from './components/LoginForm.vue'
import UserMenu from './components/UserMenu.vue'
import Dashboard from './components/Dashboard.vue'
import ShortcutsHelp from './components/ShortcutsHelp.vue'
import AchievementsPanel from './components/AchievementsPanel.vue'
import CelebrationToast from './components/CelebrationToast.vue'

const todoStore = useTodoStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const stats = computed(() => todoStore.stats)
const error = computed(() => todoStore.error)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const showHelp = ref(false)
const dashboardRef = ref(null)
const todoFormRef = ref(null)
const filtersRef = ref(null)
const todoListRef = ref(null)

// Celebration state
const celebrationMessage = ref('')
const celebrationAchievement = ref(null)
const isAllComplete = ref(false)

// Celebration callback
function handleCelebration({ message, newAchievement, isAllComplete: allComplete }) {
  celebrationMessage.value = message
  celebrationAchievement.value = newAchievement
  isAllComplete.value = allComplete
  
  // Reset after display
  setTimeout(() => {
    celebrationMessage.value = ''
    celebrationAchievement.value = null
    isAllComplete.value = false
  }, allComplete ? 5000 : 3000)
}

// Setup keyboard shortcuts
useKeyboardShortcuts({
  onNewTodo: () => {
    todoFormRef.value?.$el.querySelector('input[type="text"]')?.focus()
  },
  onFocusSearch: () => {
    filtersRef.value?.$el.querySelector('input[type="text"]')?.focus()
  },
  onToggleDashboard: () => {
    dashboardRef.value?.toggleDashboard()
  },
  onToggleReorder: () => {
    const dragToggle = todoListRef.value?.$el.querySelector('input[type="checkbox"]')
    if (dragToggle) dragToggle.click()
  },
  onToggleTheme: () => {
    themeStore.toggleTheme()
  },
  onShowHelp: () => {
    showHelp.value = true
  },
  onEscape: () => {
    showHelp.value = false
  }
})

onMounted(async () => {
  await authStore.checkAuth()
  if (authStore.isAuthenticated) {
    await todoStore.fetchTodos()
    await todoStore.fetchStats()
    // Set celebration callback
    todoStore.setCelebrationCallback(handleCelebration)
  }
})

async function handleLoginSuccess() {
  await todoStore.fetchTodos()
  await todoStore.fetchStats()
  // Set celebration callback
  todoStore.setCelebrationCallback(handleCelebration)
}

function onTodoCreated() {
  // Animation or feedback
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  animation: fadeIn 0.5s ease;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: slideIn 0.6s ease;
}

.header-content {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px var(--shadow);
  margin-bottom: 2rem;
  transition: var(--transition);
}

.dark-mode .header-content {
  border: 1px solid var(--border);
}

.header-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.app-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  animation: bounce 2s ease infinite;
}

.app-subtitle {
  color: var(--text-light);
  font-size: 1.2rem;
}

.emoji {
  display: inline-block;
  animation: bounce 1s ease infinite;
}

.emoji:nth-child(2) {
  animation-delay: 0.2s;
}

.app-main {
  animation: fadeIn 0.8s ease 0.2s both;
}

.todo-container {
  max-width: 900px;
  margin: 0 auto;
}

.error-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--danger);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
  cursor: pointer;
  animation: slideIn 0.3s ease;
  font-weight: 600;
  z-index: 1000;
}

.error-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(239, 68, 68, 0.4);
}

.help-button {
  position: fixed;
  bottom: 2rem;
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
  z-index: 99;
  transition: var(--transition);
  animation: fadeIn 0.5s ease;
}

.help-button:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 8px 20px var(--shadow-lg);
  border-color: var(--primary);
}

.help-button .emoji {
  font-size: 1.8rem;
  animation: bounce 2s ease infinite;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }
  
  .header-content {
    padding: 1.5rem;
  }
  
  .help-button {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
  }
  
  .help-button .emoji {
    font-size: 1.5rem;
  }
}
</style>
