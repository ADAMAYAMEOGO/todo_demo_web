<template>
  <div class="achievements-panel">
    <button @click="showPanel = !showPanel" class="achievements-trigger">
      <span class="emoji">🏆</span>
      <span class="achievements-count">{{ earnedCount }}/{{ totalCount }}</span>
    </button>

    <transition name="slide">
      <div v-if="showPanel" class="achievements-modal">
        <div class="modal-header">
          <h2>
            <span class="emoji">🏆</span>
            Accomplissements
          </h2>
          <button @click="showPanel = false" class="close-btn">✕</button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ currentStreak }}</div>
            <div class="stat-label">Série actuelle</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-value">{{ longestStreak }}</div>
            <div class="stat-label">Meilleure série</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ totalCompleted }}</div>
            <div class="stat-label">Tâches complétées</div>
          </div>
        </div>

        <div class="achievements-list">
          <div
            v-for="achievement in availableAchievements"
            :key="achievement.id"
            class="achievement-item"
            :class="{ earned: isEarned(achievement.id), locked: !isEarned(achievement.id) }"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-info">
              <h3>{{ achievement.name }}</h3>
              <p>{{ achievement.description }}</p>
              <span v-if="isEarned(achievement.id)" class="earned-date">
                Obtenu le {{ formatDate(getAchievement(achievement.id)?.earnedAt) }}
              </span>
            </div>
            <div v-if="isEarned(achievement.id)" class="earned-badge">✓</div>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="showPanel" class="overlay" @click="showPanel = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGamification } from '../composables/useGamification'

const { currentStreak, longestStreak, totalCompleted, achievements, availableAchievements } = useGamification()
const showPanel = ref(false)

const earnedCount = computed(() => achievements.value.length)
const totalCount = computed(() => availableAchievements.length)

function isEarned(id) {
  return achievements.value.some(a => a.id === id)
}

function getAchievement(id) {
  return achievements.value.find(a => a.id === id)
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.achievements-panel {
  position: relative;
}

.achievements-trigger {
  position: fixed;
  bottom: 120px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: var(--transition);
  z-index: 999;
}

.achievements-trigger:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.5);
}

.achievements-trigger .emoji {
  font-size: 1.5rem;
}

.achievements-count {
  font-size: 0.7rem;
  font-weight: 700;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.achievements-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 20px 60px var(--shadow-lg);
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dark-mode .achievements-modal {
  border: 1px solid var(--border);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: var(--text);
  font-size: 1.5rem;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--light);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--text-light);
  transition: var(--transition);
}

.dark-mode .close-btn {
  background: var(--dark-light);
}

.close-btn:hover {
  background: var(--danger);
  color: white;
  transform: rotate(90deg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.stat-card {
  background: var(--light);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}

.dark-mode .stat-card {
  background: var(--dark-light);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-light);
  font-weight: 500;
}

.achievements-list {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  transition: var(--transition);
  background: var(--light);
}

.dark-mode .achievement-item {
  background: var(--dark-light);
}

.achievement-item.earned {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 2px solid var(--success);
}

.achievement-item.locked {
  opacity: 0.5;
}

.achievement-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  border-radius: 12px;
}

.dark-mode .achievement-icon {
  background: var(--bg);
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text);
  font-size: 1.1rem;
}

.achievement-info p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.earned-date {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--success);
  font-weight: 600;
}

.earned-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translate(-50%, -45%);
}

.slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -55%);
}

@media (max-width: 640px) {
  .achievements-modal {
    width: 95%;
    max-height: 90vh;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 1rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .achievement-icon {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
}
</style>
