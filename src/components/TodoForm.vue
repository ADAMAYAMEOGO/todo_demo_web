<template>
  <div class="todo-form-container">
    <form @submit.prevent="handleSubmit" class="todo-form">
      <div class="form-header">
        <h2 class="form-title">
          <span class="emoji">➕</span>
          Nouvelle Tâche
        </h2>
      </div>

      <div class="form-grid">
        <div class="form-group full-width">
          <input
            v-model="form.title"
            type="text"
            placeholder="Titre de la tâche..."
            class="input-field"
            required
            maxlength="200"
          />
        </div>

        <div class="form-group full-width">
          <textarea
            v-model="form.description"
            placeholder="Description (optionnelle)..."
            class="input-field textarea"
            rows="2"
          ></textarea>
        </div>

        <div class="form-group">
          <select v-model="form.priority" class="input-field select">
            <option value="low">🟢 Basse</option>
            <option value="medium">🟡 Moyenne</option>
            <option value="high">🟠 Haute</option>
            <option value="urgent">🔴 Urgente</option>
          </select>
        </div>

        <div class="form-group">
          <select v-model="form.category" class="input-field select">
            <option value="work">💼 Travail</option>
            <option value="personal">👤 Personnel</option>
            <option value="shopping">🛒 Courses</option>
            <option value="health">❤️ Santé</option>
            <option value="education">📚 Éducation</option>
            <option value="other">📌 Autre</option>
          </select>
        </div>

        <div class="form-group">
          <input
            v-model="form.due_date"
            type="datetime-local"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <input
            v-model="form.tags"
            type="text"
            placeholder="Tags (séparés par des virgules)"
            class="input-field"
          />
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="form.favorite"
              type="checkbox"
              class="checkbox"
            />
            <span class="checkbox-text">
              <span class="emoji">⭐</span>
              Favori
            </span>
          </label>
        </div>

        <div class="form-group">
          <button
            type="submit"
            class="submit-btn"
            :disabled="loading || !form.title.trim()"
          >
            <span v-if="!loading">
              <span class="emoji">✨</span>
              Ajouter
            </span>
            <span v-else class="spinner"></span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const emit = defineEmits(['created'])
const store = useTodoStore()
const loading = computed(() => store.loading)

const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  category: 'other',
  due_date: '',
  tags: '',
  favorite: false
})

async function handleSubmit() {
  try {
    const todoData = {
      ...form.value,
      due_date: form.value.due_date || null
    }
    
    await store.createTodo(todoData)
    
    // Reset form
    form.value = {
      title: '',
      description: '',
      priority: 'medium',
      category: 'other',
      due_date: '',
      tags: '',
      favorite: false
    }
    
    emit('created')
  } catch (error) {
    console.error('Error creating todo:', error)
  }
}
</script>

<style scoped>
.todo-form-container {
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease;
}

.todo-form {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.todo-form:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.form-header {
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.input-field {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  transition: var(--transition);
  background: var(--light);
}

.input-field:focus {
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.textarea {
  resize: vertical;
  min-height: 60px;
}

.select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.5rem;
}

.checkbox-group {
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.875rem;
  background: var(--light);
  border-radius: 12px;
  transition: var(--transition);
}

.checkbox-label:hover {
  background: var(--light-dark);
  transform: translateY(-2px);
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-text {
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .todo-form {
    padding: 1.5rem;
  }
}
</style>
