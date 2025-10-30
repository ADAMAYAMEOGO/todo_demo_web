<template>
  <div class="todo-list-container">
    <div class="list-header">
      <h2 class="list-title">
        <span class="emoji">📝</span>
        Mes Tâches
        <span class="count-badge">{{ todos.length }}</span>
      </h2>
      
      <div class="header-actions">
        <button @click="showKanban = true" class="kanban-btn">
          <span class="emoji">🎯</span>
          Vue Kanban
        </button>
        
        <label class="drag-toggle">
          <input
            v-model="dragEnabled"
            type="checkbox"
            class="checkbox"
          />
          <span class="checkbox-text">
            <span class="emoji">🖱️</span>
            Réorganiser
          </span>
        </label>
        
        <button
          v-if="hasCompleted"
          @click="handleDeleteCompleted"
          class="delete-completed-btn"
        >
          <span class="emoji">🗑️</span>
          Supprimer terminées
        </button>
      </div>
    </div>

    <!-- Kanban View -->
    <KanbanView
      v-if="showKanban"
      :todos="todos"
      @update="handleKanbanUpdate"
      @edit="handleEdit"
      @close="showKanban = false"
    />

    <div v-if="loading && todos.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <div v-else-if="todos.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>Aucune tâche</h3>
      <p>Ajoutez votre première tâche ci-dessus !</p>
    </div>

    <draggable
      v-else-if="!showKanban"
      v-model="localTodos"
      :disabled="!dragEnabled"
      @end="handleDragEnd"
      tag="div"
      class="todo-list"
      :class="{ 'drag-enabled': dragEnabled }"
      item-key="id"
      :animation="200"
      ghost-class="ghost"
      handle=".drag-handle"
    >
      <template #item="{ element }">
        <TodoItem
          :todo="element"
          :drag-enabled="dragEnabled"
          @toggle="handleToggle"
          @delete="handleDelete"
          @update="handleUpdate"
          @toggle-favorite="handleToggleFavorite"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'
import KanbanView from './KanbanView.vue'
import draggable from 'vuedraggable'

const store = useTodoStore()
const todos = computed(() => store.todos)
const loading = computed(() => store.loading)
const hasCompleted = computed(() => todos.value.some(t => t.completed))
const dragEnabled = ref(false)
const showKanban = ref(false)

const localTodos = computed({
  get: () => todos.value,
  set: (value) => {
    // This will be updated when drag ends
  }
})

async function handleDragEnd(event) {
  if (dragEnabled.value) {
    await store.reorderTodos(localTodos.value)
  }
}

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

async function handleKanbanUpdate(updatedTodos) {
  // Update all todos with their new completion status
  for (const todo of updatedTodos) {
    if (todo.completed !== todos.value.find(t => t.id === todo.id)?.completed) {
      await store.updateTodo(todo.id, { completed: todo.completed })
    }
  }
}

function handleEdit(todo) {
  // Implement edit functionality or emit to parent
  console.log('Edit todo:', todo)
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
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 2px 10px var(--shadow);
  flex-wrap: wrap;
  gap: 1rem;
}

.dark-mode .list-header {
  border: 1px solid var(--border);
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.drag-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--light);
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition);
}

.drag-toggle:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.drag-toggle .checkbox-text {
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.drag-toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.kanban-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--secondary);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
}

.kanban-btn:hover {
  background: #d946a6;
  transform: translateY(-2px);
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
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow);
}

.dark-mode .loading-state,
.dark-mode .empty-state {
  border: 1px solid var(--border);
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

.todo-list.drag-enabled {
  cursor: move;
}

.todo-list .ghost {
  opacity: 0.4;
  background: var(--primary-light);
  transform: rotate(2deg);
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .delete-completed-btn,
  .drag-toggle {
    justify-content: center;
  }
}
</style>
