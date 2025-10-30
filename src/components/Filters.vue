<template>
  <div class="filters-container">
    <div class="filters-card">
      <div class="filters-header">
        <h3 class="filters-title">
          <span class="emoji">🔍</span>
          Filtres & Recherche
        </h3>
        <button @click="clearFilters" class="clear-btn">
          <span class="emoji">🔄</span>
          Réinitialiser
        </button>
      </div>

      <div class="filters-grid">
        <div class="filter-group">
          <input
            v-model="searchQuery"
            @input="onSearchChange"
            type="text"
            placeholder="Rechercher..."
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <select
            v-model="filters.completed"
            @change="onFilterChange"
            class="filter-select"
          >
            <option :value="null">📋 Toutes</option>
            <option :value="false">⏳ En cours</option>
            <option :value="true">✅ Terminées</option>
          </select>
        </div>

        <div class="filter-group">
          <select
            v-model="filters.priority"
            @change="onFilterChange"
            class="filter-select"
          >
            <option :value="null">🎯 Toutes priorités</option>
            <option value="low">🟢 Basse</option>
            <option value="medium">🟡 Moyenne</option>
            <option value="high">🟠 Haute</option>
            <option value="urgent">🔴 Urgente</option>
          </select>
        </div>

        <div class="filter-group">
          <select
            v-model="filters.category"
            @change="onFilterChange"
            class="filter-select"
          >
            <option :value="null">📁 Toutes catégories</option>
            <option value="work">💼 Travail</option>
            <option value="personal">👤 Personnel</option>
            <option value="shopping">🛒 Courses</option>
            <option value="health">❤️ Santé</option>
            <option value="education">📚 Éducation</option>
            <option value="other">📌 Autre</option>
          </select>
        </div>

        <div class="filter-group">
          <select
            v-model="filters.sort_by"
            @change="onFilterChange"
            class="filter-select"
          >
            <option value="created_at">📅 Date création</option>
            <option value="updated_at">🔄 Dernière modif</option>
            <option value="due_date">⏰ Date échéance</option>
            <option value="priority">🎯 Priorité</option>
            <option value="title">🔤 Titre</option>
          </select>
        </div>

        <div class="filter-group">
          <select
            v-model="filters.order"
            @change="onFilterChange"
            class="filter-select"
          >
            <option value="desc">⬇️ Décroissant</option>
            <option value="asc">⬆️ Croissant</option>
          </select>
        </div>

        <div class="filter-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="showFavorites"
              @change="onFavoriteChange"
              type="checkbox"
              class="checkbox"
            />
            <span class="checkbox-text">⭐ Favoris uniquement</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()
const searchQuery = ref('')
const showFavorites = ref(false)
const filters = reactive({
  completed: null,
  priority: null,
  category: null,
  sort_by: 'created_at',
  order: 'desc'
})

let searchTimeout = null

function onSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setFilter('search', searchQuery.value)
  }, 300)
}

function onFilterChange() {
  Object.keys(filters).forEach(key => {
    store.setFilter(key, filters[key])
  })
}

function onFavoriteChange() {
  store.setFilter('favorite', showFavorites.value ? true : null)
}

function clearFilters() {
  searchQuery.value = ''
  showFavorites.value = false
  filters.completed = null
  filters.priority = null
  filters.category = null
  filters.sort_by = 'created_at'
  filters.order = 'desc'
  store.clearFilters()
}
</script>

<style scoped>
.filters-container {
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease;
}

.filters-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px var(--shadow);
  transition: var(--transition);
}

.dark-mode .filters-card {
  border: 1px solid var(--border);
}

.filters-card:hover {
  box-shadow: 0 8px 30px var(--shadow-lg);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: var(--light);
  color: var(--text);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.clear-btn:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: var(--transition);
  background: var(--light);
}

.filter-input:focus,
.filter-select:focus {
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.filter-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
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
  padding: 0.75rem;
  background: var(--light);
  border-radius: 10px;
  transition: var(--transition);
}

.checkbox-label:hover {
  background: var(--light-dark);
  transform: translateY(-2px);
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  font-weight: 600;
  color: var(--text);
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .clear-btn {
    justify-content: center;
  }
}
</style>
