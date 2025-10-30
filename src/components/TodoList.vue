<template>
  <div class="todo-list-container">
    <div class="list-header">
      <h2 class="list-title">
        <span class="emoji">📝</span>
        Mes Tâches
        <span class="count-badge">{{ todos.length }}</span>
      </h2>
      
      <button
        v-if="hasCompleted"
        @click="handleDeleteCompleted"
        class="delete-completed-btn"
      >
        <span class="emoji">🗑️</span>
        Supprimer terminées
      </button>
    </div>

    <div v-if="loading && todos.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <div v-else-if="todos.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>Aucune tâche</h3>
      <p>Ajoutez votre première tâche ci-dessus !</p>
    </div>

    <TransitionGroup
      v-else
      name="list"
      tag="div"
      class="todo-list"
    >
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="handleToggle"
        @delete="handleDelete"
        @update="handleUpdate"
        @toggle-favorite="handleToggleFavorite"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'

const store = useTodoStore()
const todos = computed(() => store.todos)
const loading = computed(() => store.loading)
const hasCompleted = computed(() => todos.value.some(t => t.completed))

async function handleToggle(id) {
  await store.toggleTodo(id)
}

async function handleDelete(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    await store.deleteTodo(id)
  }
}

async function handleUpdate(id, updates) {
  await store.updateTodo(id, updates)
}

async function handleToggleFavorite(id) {
  await store.toggleFavorite(id)
}

async function handleDeleteCompleted() {
  if (confirm('Supprimer toutes les tâches terminées ?')) {
    await store.deleteCompleted()
  }
}
</script>

<style scoped>
.todo-list-container {
  animation: fadeIn 0.7s ease;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.list-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count-badge {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  animation: pulse 2s ease infinite;
}

.delete-completed-btn {
  padding: 0.625rem 1.25rem;
  background: var(--danger);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.delete-completed-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease infinite;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-light);
  font-size: 1.1rem;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .delete-completed-btn {
    justify-content: center;
  }
}
</style>
