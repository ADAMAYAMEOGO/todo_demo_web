<template>
  <div class="stats-bar">
    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">Total</div>
      </div>
    </div>

    <div class="stat-card success">
      <div class="stat-icon">✅</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.completed }}</div>
        <div class="stat-label">Terminées</div>
      </div>
    </div>

    <div class="stat-card warning">
      <div class="stat-icon">⏳</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.pending }}</div>
        <div class="stat-label">En cours</div>
      </div>
    </div>

    <div class="stat-card danger" v-if="stats.overdue > 0">
      <div class="stat-icon">🔥</div>
      <div class="stat-content">
        <div class="stat-value">{{ stats.overdue }}</div>
        <div class="stat-label">En retard</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
  border-left: 4px solid var(--primary);
  animation: scaleIn 0.5s var(--bounce);
}

.dark-mode .stat-card {
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
}

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}

.stat-card:nth-child(4) {
  animation-delay: 0.4s;
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 20px var(--shadow-lg);
}

.stat-card.success {
  border-left-color: var(--success);
}

.stat-card.warning {
  border-left-color: var(--warning);
}

.stat-card.danger {
  border-left-color: var(--danger);
  animation: shake 0.5s ease;
}

.stat-icon {
  font-size: 2.5rem;
  animation: bounce 2s ease infinite;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-light);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
