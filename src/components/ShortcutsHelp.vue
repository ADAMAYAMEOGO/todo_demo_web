<template>
  <Transition name="fade">
    <div v-if="show" class="shortcuts-help" @click="$emit('close')">
      <div class="shortcuts-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <span class="emoji">⌨️</span>
            Raccourcis clavier
          </h2>
          <button @click="$emit('close')" class="close-btn">×</button>
        </div>

        <div class="shortcuts-grid">
          <div class="shortcut-item">
            <kbd>N</kbd>
            <span>Nouvelle tâche</span>
          </div>

          <div class="shortcut-item">
            <kbd>/</kbd>
            <span>Rechercher</span>
          </div>

          <div class="shortcut-item">
            <kbd>D</kbd>
            <span>Dashboard</span>
          </div>

          <div class="shortcut-item">
            <kbd>R</kbd>
            <span>Mode réorganisation</span>
          </div>

          <div class="shortcut-item">
            <kbd>T</kbd>
            <span>Changer thème</span>
          </div>

          <div class="shortcut-item">
            <kbd>Esc</kbd>
            <span>Fermer modal</span>
          </div>

          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>K</kbd>
            <span>Palette de commandes</span>
          </div>

          <div class="shortcut-item">
            <kbd>?</kbd>
            <span>Afficher l'aide</span>
          </div>
        </div>

        <p class="shortcuts-note">
          💡 Les raccourcis ne fonctionnent pas dans les champs de saisie
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.shortcuts-help {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.shortcuts-modal {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  animation: scaleIn 0.3s var(--bounce);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dark-mode .shortcuts-modal {
  border: 1px solid var(--border);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--light);
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-light);
}

.close-btn:hover {
  background: var(--danger);
  color: white;
  transform: rotate(90deg);
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--light);
  border-radius: 10px;
  transition: var(--transition);
}

.dark-mode .shortcut-item {
  background: var(--dark-light);
}

.shortcut-item:hover {
  transform: translateX(5px);
  background: var(--primary);
  color: white;
}

.shortcut-item:hover kbd {
  background: white;
  color: var(--primary);
}

kbd {
  min-width: 30px;
  padding: 0.25rem 0.5rem;
  background: white;
  border: 2px solid var(--border);
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--text);
}

.shortcut-item span {
  flex: 1;
  font-weight: 600;
  color: var(--text);
}

.shortcuts-note {
  text-align: center;
  color: var(--text-light);
  font-size: 0.9rem;
  padding: 1rem;
  background: var(--light);
  border-radius: 10px;
  margin: 0;
}

@media (max-width: 768px) {
  .shortcuts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
