<template>
  <div
    class="todo-item"
    :class="{
      completed: todo.completed,
      favorite: todo.favorite,
      urgent: todo.priority === 'urgent',
      overdue: isOverdue
    }"
  >
    <div class="todo-main">
      <div class="todo-checkbox">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="$emit('toggle', todo.id)"
          class="checkbox-input"
        />
        <span class="checkmark"></span>
      </div>

      <div class="todo-content" @click="toggleExpanded">
        <div class="todo-header-row">
          <h3 class="todo-title">
            {{ todo.title }}
          </h3>
          <div class="todo-badges">
            <span
              class="priority-badge"
              :class="`priority-${todo.priority}`"
            >
              {{ priorityEmoji(todo.priority) }}
              {{ priorityLabel(todo.priority) }}
            </span>
            <span
              class="category-badge"
              :class="`category-${todo.category}`"
            >
              {{ categoryEmoji(todo.category) }}
              {{ categoryLabel(todo.category) }}
            </span>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="expanded" class="todo-details">
            <p v-if="todo.description" class="todo-description">
              {{ todo.description }}
            </p>
            
            <div class="todo-meta">
              <div v-if="todo.due_date" class="meta-item">
                <span class="emoji">📅</span>
                <span>Échéance: {{ formatDate(todo.due_date) }}</span>
              </div>
              <div class="meta-item">
                <span class="emoji">🕐</span>
                <span>Créé: {{ formatDate(todo.created_at) }}</span>
              </div>
              <div v-if="todo.tags" class="meta-item tags">
                <span class="emoji">🏷️</span>
                <div class="tag-list">
                  <span
                    v-for="tag in getTags(todo.tags)"
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="todo-actions">
      <button
        @click="$emit('toggle-favorite', todo.id)"
        class="action-btn favorite-btn"
        :class="{ active: todo.favorite }"
        title="Favori"
      >
        <span class="emoji">{{ todo.favorite ? '⭐' : '☆' }}</span>
      </button>
      
      <button
        @click="startEdit"
        class="action-btn edit-btn"
        title="Modifier"
      >
        <span class="emoji">✏️</span>
      </button>
      
      <button
        @click="$emit('delete', todo.id)"
        class="action-btn delete-btn"
        title="Supprimer"
      >
        <span class="emoji">🗑️</span>
      </button>
    </div>

    <!-- Edit Modal -->
    <Transition name="fade">
      <div v-if="editing" class="edit-modal" @click.self="cancelEdit">
        <div class="edit-content">
          <h3 class="edit-title">Modifier la tâche</h3>
          
          <div class="edit-form">
            <input
              v-model="editForm.title"
              type="text"
              placeholder="Titre"
              class="edit-input"
            />
            
            <textarea
              v-model="editForm.description"
              placeholder="Description"
              class="edit-input"
              rows="3"
            ></textarea>
            
            <select v-model="editForm.priority" class="edit-input">
              <option value="low">🟢 Basse</option>
              <option value="medium">🟡 Moyenne</option>
              <option value="high">🟠 Haute</option>
              <option value="urgent">🔴 Urgente</option>
            </select>
            
            <select v-model="editForm.category" class="edit-input">
              <option value="work">💼 Travail</option>
              <option value="personal">👤 Personnel</option>
              <option value="shopping">🛒 Courses</option>
              <option value="health">❤️ Santé</option>
              <option value="education">📚 Éducation</option>
              <option value="other">📌 Autre</option>
            </select>
            
            <input
              v-model="editForm.due_date"
              type="datetime-local"
              class="edit-input"
            />
            
            <input
              v-model="editForm.tags"
              type="text"
              placeholder="Tags"
              class="edit-input"
            />
            
            <div class="edit-actions">
              <button @click="cancelEdit" class="cancel-btn">
                Annuler
              </button>
              <button @click="saveEdit" class="save-btn">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'delete', 'update', 'toggle-favorite'])

const expanded = ref(false)
const editing = ref(false)
const editForm = ref({})

const isOverdue = computed(() => {
  if (!props.todo.due_date || props.todo.completed) return false
  return new Date(props.todo.due_date) < new Date()
})

function toggleExpanded() {
  expanded.value = !expanded.value
}

function startEdit() {
  editForm.value = {
    title: props.todo.title,
    description: props.todo.description || '',
    priority: props.todo.priority,
    category: props.todo.category,
    due_date: props.todo.due_date ? props.todo.due_date.slice(0, 16) : '',
    tags: props.todo.tags || ''
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

function saveEdit() {
  emit('update', props.todo.id, {
    ...editForm.value,
    due_date: editForm.value.due_date || null
  })
  editing.value = false
}

function priorityEmoji(priority) {
  const emojis = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    urgent: '🔴'
  }
  return emojis[priority] || '⚪'
}

function priorityLabel(priority) {
  const labels = {
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
    urgent: 'Urgente'
  }
  return labels[priority] || priority
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

function categoryLabel(category) {
  const labels = {
    work: 'Travail',
    personal: 'Personnel',
    shopping: 'Courses',
    health: 'Santé',
    education: 'Éducation',
    other: 'Autre'
  }
  return labels[category] || category
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTags(tagsString) {
  return tagsString.split(',').map(t => t.trim()).filter(t => t)
}
</script>

<style scoped>
.todo-item {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: var(--transition);
  border-left: 4px solid var(--primary);
  animation: slideIn 0.3s ease;
}

.todo-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateX(5px);
}

.todo-item.completed {
  opacity: 0.7;
  border-left-color: var(--success);
}

.todo-item.favorite {
  border-left-color: var(--secondary);
  background: linear-gradient(135deg, white 0%, #fef3f8 100%);
}

.todo-item.urgent {
  border-left-color: var(--danger);
  animation: pulse 2s ease infinite;
}

.todo-item.overdue {
  background: linear-gradient(135deg, white 0%, #fef2f2 100%);
}

.todo-main {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.todo-checkbox {
  position: relative;
  flex-shrink: 0;
}

.checkbox-input {
  width: 24px;
  height: 24px;
  opacity: 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border: 2px solid var(--primary);
  border-radius: 6px;
  background: white;
  transition: var(--transition);
  pointer-events: none;
}

.checkbox-input:checked ~ .checkmark {
  background: var(--primary);
  transform: scale(1.1);
}

.checkbox-input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
}

.todo-content {
  flex: 1;
  cursor: pointer;
}

.todo-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.todo-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: var(--text-light);
}

.todo-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.priority-badge,
.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.priority-low { background: #d1fae5; color: #065f46; }
.priority-medium { background: #fef3c7; color: #92400e; }
.priority-high { background: #fed7aa; color: #9a3412; }
.priority-urgent { background: #fee2e2; color: #991b1b; }

.category-badge {
  background: var(--light);
  color: var(--text);
}

.todo-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.todo-description {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.todo-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.meta-item.tags {
  flex-wrap: wrap;
}

.tag-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--primary-light);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  background: var(--light);
  font-size: 1.1rem;
}

.action-btn:hover {
  transform: translateY(-2px) scale(1.1);
}

.favorite-btn.active {
  background: var(--secondary);
  animation: bounce 0.5s ease;
}

.edit-btn:hover {
  background: var(--primary);
}

.delete-btn:hover {
  background: var(--danger);
}

/* Edit Modal */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.edit-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: scaleIn 0.3s var(--bounce);
}

.edit-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 1rem;
  transition: var(--transition);
}

.edit-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.edit-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.cancel-btn {
  background: var(--light);
  color: var(--text);
}

.cancel-btn:hover {
  background: var(--light-dark);
}

.save-btn {
  background: var(--primary);
  color: white;
}

.save-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .todo-header-row {
    flex-direction: column;
  }
  
  .todo-actions {
    justify-content: center;
  }
}
</style>
