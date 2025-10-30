import apiClient from './axios'

export const todoApi = {
  // Get all todos with filters
  async getTodos(params = {}) {
    const response = await apiClient.get('/todos', { params })
    return response.data
  },

  // Get todo by ID
  async getTodo(id) {
    const response = await apiClient.get(`/todos/${id}`)
    return response.data
  },

  // Create todo
  async createTodo(todo) {
    const response = await apiClient.post('/todos', todo)
    return response.data
  },

  // Update todo
  async updateTodo(id, todo) {
    const response = await apiClient.patch(`/todos/${id}`, todo)
    return response.data
  },

  // Delete todo
  async deleteTodo(id) {
    const response = await apiClient.delete(`/todos/${id}`)
    return response.data
  },

  // Toggle completion
  async toggleTodo(id) {
    const response = await apiClient.post(`/todos/${id}/toggle`)
    return response.data
  },

  // Toggle favorite
  async toggleFavorite(id) {
    const response = await apiClient.post(`/todos/${id}/favorite`)
    return response.data
  },

  // Get statistics
  async getStats() {
    const response = await apiClient.get('/todos/stats')
    return response.data
  },

  // Delete completed todos
  async deleteCompleted() {
    const response = await apiClient.delete('/todos')
    return response.data
  },

  // Reorder todos
  async reorderTodos(todoIds) {
    const response = await apiClient.post('/todos/reorder', todoIds)
    return response.data
  }
}
