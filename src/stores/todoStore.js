import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { todoApi } from '../api/todos'
import { useGamification } from '../composables/useGamification'

export const useTodoStore = defineStore('todo', () => {
  const { onTaskCompleted, onAllTasksComplete } = useGamification()
  
  // Celebration callback
  const celebrationCallback = ref(null)
  
  // State
  const todos = ref([])
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Filters
  const filters = ref({
    search: '',
    completed: null,
    priority: null,
    category: null,
    favorite: null,
    sort_by: 'created_at',
    order: 'desc'
  })

  // Computed
  const filteredTodos = computed(() => {
    return todos.value
  })

  const completedCount = computed(() => {
    return todos.value.filter(t => t.completed).length
  })

  const pendingCount = computed(() => {
    return todos.value.filter(t => !t.completed).length
  })

  // Actions
  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== null && v !== '')
      )
      todos.value = await todoApi.getTodos(cleanFilters)
    } catch (err) {
      error.value = err.message
      console.error('Error fetching todos:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      stats.value = await todoApi.getStats()
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  async function createTodo(todo) {
    loading.value = true
    error.value = null
    try {
      const newTodo = await todoApi.createTodo(todo)
      todos.value.unshift(newTodo)
      await fetchStats()
      return newTodo
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTodo(id, updates) {
    loading.value = true
    error.value = null
    try {
      const updated = await todoApi.updateTodo(id, updates)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = updated
      }
      await fetchStats()
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTodo(id) {
    loading.value = true
    error.value = null
    try {
      await todoApi.deleteTodo(id)
      todos.value = todos.value.filter(t => t.id !== id)
      await fetchStats()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleTodo(id) {
    try {
      const todo = todos.value.find(t => t.id === id)
      if (!todo) return
      
      const wasCompleted = todo.completed
      const updated = await todoApi.toggleTodo(id)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = updated
        
        // Check if task was just completed
        if (!wasCompleted && updated.completed) {
          const result = onTaskCompleted()
          
          // Check if all tasks are now complete
          const allComplete = todos.value.length > 0 && todos.value.every(t => t.completed)
          if (allComplete) {
            const allCompleteResult = onAllTasksComplete()
            if (celebrationCallback.value) {
              celebrationCallback.value({
                ...allCompleteResult,
                isAllComplete: true
              })
            }
          } else {
            if (celebrationCallback.value) {
              celebrationCallback.value({
                message: result.message,
                newAchievement: result.newAchievements[0],
                isAllComplete: false
              })
            }
          }
        }
      }
      await fetchStats()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  function setCelebrationCallback(callback) {
    celebrationCallback.value = callback
  }

  async function toggleFavorite(id) {
    try {
      const updated = await todoApi.toggleFavorite(id)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = updated
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function deleteCompleted() {
    loading.value = true
    error.value = null
    try {
      await todoApi.deleteCompleted()
      todos.value = todos.value.filter(t => !t.completed)
      await fetchStats()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reorderTodos(newOrder) {
    try {
      const todoIds = newOrder.map(t => t.id)
      await todoApi.reorderTodos(todoIds)
      todos.value = newOrder
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  function setFilter(key, value) {
    filters.value[key] = value
    fetchTodos()
  }

  function clearFilters() {
    filters.value = {
      search: '',
      completed: null,
      priority: null,
      category: null,
      favorite: null,
      sort_by: 'created_at',
      order: 'desc'
    }
    fetchTodos()
  }

  return {
    // State
    todos,
    stats,
    loading,
    error,
    filters,
    
    // Computed
    filteredTodos,
    completedCount,
    pendingCount,
    
    // Actions
    fetchTodos,
    fetchStats,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    toggleFavorite,
    deleteCompleted,
    reorderTodos,
    setFilter,
    clearFilters,
    setCelebrationCallback
  }
})
