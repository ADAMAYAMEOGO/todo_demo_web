import axios from 'axios'

const API_URL = '/api'

export const todoApi = {
  // Get all todos with filters
  async getTodos(params = {}) {
    const response = await axios.get(`${API_URL}/todos`, { params })
    return response.data
  },

  // Get todo by ID
  async getTodo(id) {
    const response = await axios.get(`${API_URL}/todos/${id}`)
    return response.data
  },

  // Create todo
  async createTodo(todo) {
    const response = await axios.post(`${API_URL}/todos`, todo)
    return response.data
  },

  // Update todo
  async updateTodo(id, todo) {
    const response = await axios.patch(`${API_URL}/todos/${id}`, todo)
    return response.data
  },

  // Delete todo
  async deleteTodo(id) {
    const response = await axios.delete(`${API_URL}/todos/${id}`)
    return response.data
  },

  // Toggle completion
  async toggleTodo(id) {
    const response = await axios.post(`${API_URL}/todos/${id}/toggle`)
    return response.data
  },

  // Toggle favorite
  async toggleFavorite(id) {
    const response = await axios.post(`${API_URL}/todos/${id}/favorite`)
    return response.data
  },

  // Get statistics
  async getStats() {
    const response = await axios.get(`${API_URL}/todos/stats`)
    return response.data
  },

  // Delete completed todos
  async deleteCompleted() {
    const response = await axios.delete(`${API_URL}/todos`)
    return response.data
  },

  // Reorder todos
  async reorderTodos(todoIds) {
    const response = await axios.post(`${API_URL}/todos/reorder`, todoIds)
    return response.data
  }
}
