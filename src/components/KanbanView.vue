<template>
  <div class="kanban-container">
    <div class="kanban-header">
      <h2 class="kanban-title">
        <span class="emoji">🎯</span>
        Vue Kanban
      </h2>
      <button @click="$emit('close')" class="close-kanban-btn">
        <span class="emoji">📋</span>
        Vue liste
      </button>
    </div>

    <div class="kanban-board">
      <!-- To Do Column -->
      <div class="kanban-column">
        <div class="column-header todo-header">
          <span class="emoji">📝</span>
          <h3>À faire</h3>
          <span class="count-badge">{{ todoItems.length }}</span>
        </div>
        <draggable
          v-model="todoItems"
          group="todos"
          @end="handleDragEnd"
          class="kanban-list"
          item-key="id"
          :animation="200"
        >
          <template #item="{ element }">
            <div class="kanban-card" @click="$emit('edit', element)">
              <div class="card-priority" :class="`priority-${element.priority}`"></div>
              <h4 class="card-title">{{ element.title }}</h4>
              <p v-if="element.description" class="card-desc">{{ element.description }}</p>
              <div class="card-footer">
                <span class="card-category">{{ categoryEmoji(element.category) }}</span>
                <span v-if="element.favorite" class="card-favorite">⭐</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- In Progress Column -->
      <div class="kanban-column">
        <div class="column-header progress-header">
          <span class="emoji">⏳</span>
          <h3>En cours</h3>
          <span class="count-badge">{{ inProgressItems.length }}</span>
        </div>
        <draggable
          v-model="inProgressItems"
          group="todos"
          @end="handleDragEnd"
          class="kanban-list"
          item-key="id"
          :animation="200"
        >
          <template #item="{ element }">
            <div class="kanban-card" @click="$emit('edit', element)">
              <div class="card-priority" :class="`priority-${element.priority}`"></div>
              <h4 class="card-title">{{ element.title }}</h4>
              <p v-if="element.description" class="card-desc">{{ element.description }}</p>
              <div class="card-footer">
                <span class="card-category">{{ categoryEmoji(element.category) }}</span>
                <span v-if="element.favorite" class="card-favorite">⭐</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Done Column -->
      <div class="kanban-column">
        <div class="column-header done-header">
          <span class="emoji">✅</span>
          <h3>Terminé</h3>
          <span class="count-badge">{{ doneItems.length }}</span>
        </div>
        <draggable
          v-model="doneItems"
          group="todos"
          @end="handleDragEnd"
          class="kanban-list"
          item-key="id"
          :animation="200"
        >
          <template #item="{ element }">
            <div class="kanban-card completed" @click="$emit('edit', element)">
              <div class="card-priority" :class="`priority-${element.priority}`"></div>
              <h4 class="card-title">{{ element.title }}</h4>
              <p v-if="element.description" class="card-desc">{{ element.description }}</p>
              <div class="card-footer">
                <span class="card-category">{{ categoryEmoji(element.category) }}</span>
                <span v-if="element.favorite" class="card-favorite">⭐</span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update', 'edit', 'close'])

// Separate todos into columns
const todoItems = ref([])
const inProgressItems = ref([])
const doneItems = ref([])

// Initialize columns
function updateColumns() {
  todoItems.value = props.todos.filter(t => !t.completed && t.priority !== 'urgent')
  inProgressItems.value = props.todos.filter(t => !t.completed && t.priority === 'urgent')
  doneItems.value = props.todos.filter(t => t.completed)
}

watch(() => props.todos, updateColumns, { immediate: true, deep: true })

function handleDragEnd() {
  // Emit updated todos
  const allTodos = [
    ...todoItems.value.map(t => ({ ...t, completed: false })),
    ...inProgressItems.value.map(t => ({ ...t, completed: false })),
    ...doneItems.value.map(t => ({ ...t, completed: true }))
  ]
  emit('update', allTodos)
}

function categoryEmoji(category) {
  const emojis = {
    work: '💼',
    personal: '👤',
    shopping: '🛒',
    health: '❤️',
    education: '📚',
    other: '📌'
  }
  return emojis[category] || '📌'
}
</script>

<style scoped>
.kanban-container {
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease;
}

.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 2px 10px var(--shadow);
}

.dark-mode .kanban-header {
  border: 1px solid var(--border);
}

.kanban-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.close-kanban-btn {
  padding: 0.625rem 1.25rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-kanban-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  min-height: 500px;
}

.kanban-column {
  background: var(--light);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.dark-mode .kanban-column {
  background: var(--dark-light);
  border: 1px solid var(--border);
}

.column-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.column-header h3 {
  flex: 1;
  font-size: 1.1rem;
  margin: 0;
}

.todo-header {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.progress-header {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.done-header {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.count-badge {
  background: currentColor;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
}

.kanban-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  min-height: 100px;
}

.kanban-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 2px 8px var(--shadow);
  position: relative;
  overflow: hidden;
}

.dark-mode .kanban-card {
  border: 1px solid var(--border);
}

.kanban-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px var(--shadow-lg);
}

.kanban-card.completed {
  opacity: 0.7;
}

.card-priority {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.priority-low { background: #10b981; }
.priority-medium { background: #f59e0b; }
.priority-high { background: #f97316; }
.priority-urgent { background: #ef4444; }

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.5rem 0;
  padding-left: 0.75rem;
}

.card-desc {
  font-size: 0.85rem;
  color: var(--text-light);
  margin: 0 0 0.75rem 0;
  padding-left: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.75rem;
}

.card-category {
  font-size: 1.2rem;
}

.card-favorite {
  font-size: 1rem;
}

@media (max-width: 1024px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>
