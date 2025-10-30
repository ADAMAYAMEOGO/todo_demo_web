<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">
          <span class="emoji">✨</span>
          Todo App
        </h1>
        <p class="login-subtitle">Connectez-vous pour continuer</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <span class="emoji">📧</span>
            Email
          </label>
          <input
            id="username"
            v-model="username"
            type="email"
            placeholder="demo@todo.app"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <span class="emoji">🔒</span>
            Mot de passe
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="form-input"
            required
          />
        </div>

        <Transition name="fade">
          <div v-if="authStore.error" class="error-message">
            <span class="emoji">⚠️</span>
            {{ authStore.error }}
          </div>
        </Transition>

        <button
          type="submit"
          class="login-btn"
          :disabled="authStore.loading"
        >
          <span v-if="!authStore.loading">
            <span class="emoji">🚀</span>
            Se connecter
          </span>
          <span v-else class="spinner"></span>
        </button>

        <div class="demo-info">
          <p class="demo-title">
            <span class="emoji">💡</span>
            Comptes de démonstration
          </p>
          <div class="demo-accounts">
            <div class="demo-account">
              <strong>User:</strong> demo@todo.app / demo123
            </div>
            <div class="demo-account">
              <strong>Admin:</strong> admin@todo.app / admin123
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const username = ref('demo@todo.app')
const password = ref('demo123')

const emit = defineEmits(['login-success'])

async function handleLogin() {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    emit('login-success')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
}

.login-card {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 3rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px var(--shadow-lg);
  animation: scaleIn 0.5s var(--bounce);
}

.dark-mode .login-card {
  border: 1px solid var(--border);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  transition: var(--transition);
  background: var(--light);
}

.form-input:focus {
  border-color: var(--primary);
  background: var(--card-bg);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.error-message {
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger);
  border-radius: 10px;
  color: var(--danger);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-info {
  margin-top: 1rem;
  padding: 1.5rem;
  background: var(--light);
  border-radius: 12px;
  border: 2px dashed var(--border);
}

.demo-title {
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-accounts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-account {
  font-size: 0.9rem;
  color: var(--text-light);
  font-family: 'Courier New', monospace;
}

.demo-account strong {
  color: var(--text);
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
  }
  
  .login-title {
    font-size: 2rem;
  }
}
</style>
