<template>
  <Transition name="fade">
    <div v-if="showInstallPrompt" class="install-prompt">
      <div class="install-content">
        <div class="install-header">
          <span class="install-icon">📱</span>
          <h3>Installer l'application</h3>
        </div>
        <p>Installez Todo App pour un accès rapide et une meilleure expérience !</p>
        <div class="install-actions">
          <button @click="dismissPrompt" class="dismiss-btn">
            Plus tard
          </button>
          <button @click="installApp" class="install-btn">
            <span class="emoji">✨</span>
            Installer
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
let deferredPrompt = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    
    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (!dismissed) {
      showInstallPrompt.value = true
    }
  })

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed')
    showInstallPrompt.value = false
  })
})

async function installApp() {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  
  console.log(`User response to the install prompt: ${outcome}`)
  deferredPrompt = null
  showInstallPrompt.value = false
}

function dismissPrompt() {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', 'true')
  
  // Show again in 7 days
  setTimeout(() => {
    localStorage.removeItem('pwa-install-dismissed')
  }, 7 * 24 * 60 * 60 * 1000)
}
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideIn 0.5s ease;
}

.install-content {
  background: var(--card-bg);
  border: 2px solid var(--primary);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px var(--shadow-lg);
  max-width: 400px;
  width: calc(100vw - 4rem);
}

.install-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.install-icon {
  font-size: 2rem;
  animation: bounce 1s ease infinite;
}

.install-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.install-content p {
  color: var(--text-light);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.install-actions {
  display: flex;
  gap: 0.75rem;
}

.dismiss-btn,
.install-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.95rem;
}

.dismiss-btn {
  background: var(--light);
  color: var(--text);
}

.dismiss-btn:hover {
  background: var(--light-dark);
  transform: translateY(-2px);
}

.install-btn {
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.install-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .install-prompt {
    bottom: 1rem;
  }
  
  .install-content {
    padding: 1.25rem;
  }
}
</style>
