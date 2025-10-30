<template>
  <div class="app-container">
    <LoginForm v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    
    <template v-else>
      <ThemeToggle />
      <InstallPrompt />
      <UserMenu />
      
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
          <TodoForm @created="onTodoCreated" />
          <Filters />
          <TodoList />
        </div>
      </main>

      <Transition name="fade">
        <div v-if="error" class="error-toast" @click="error = null">
          <span class="emoji">⚠️</span>
          {{ error }}
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTodoStore } from './stores/todoStore'
import { useAuthStore } from './stores/authStore'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import Filters from './components/Filters.vue'
import StatsBar from './components/StatsBar.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import LoginForm from './components/LoginForm.vue'
import UserMenu from './components/UserMenu.vue'

const todoStore = useTodoStore()
const authStore = useAuthStore()
const stats = computed(() => todoStore.stats)
const error = computed(() => todoStore.error)
const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  await authStore.checkAuth()
  if (authStore.isAuthenticated) {
    await todoStore.fetchTodos()
    await todoStore.fetchStats()
  }
})

async function handleLoginSuccess() {
  await todoStore.fetchTodos()
  await todoStore.fetchStats()
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

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }
  
  .header-content {
    padding: 1.5rem;
  }
}
</style>
