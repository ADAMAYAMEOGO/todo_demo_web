<template>
  <div class="dashboard-container">
    <button @click="toggleDashboard" class="dashboard-toggle">
      <span class="emoji">{{ showDashboard ? '📊' : '📊' }}</span>
      {{ showDashboard ? 'Masquer Stats' : 'Afficher Stats' }}
    </button>

    <Transition name="slide">
      <div v-if="showDashboard && stats" class="dashboard-content">
        <h2 class="dashboard-title">
          <span class="emoji">📊</span>
          Tableau de bord
        </h2>

        <div class="charts-grid">
          <!-- Pie Chart - Completion Status -->
          <div class="chart-card">
            <h3 class="chart-title">État d'avancement</h3>
            <Pie :data="completionData" :options="chartOptions" />
          </div>

          <!-- Bar Chart - Priority Distribution -->
          <div class="chart-card">
            <h3 class="chart-title">Répartition par priorité</h3>
            <Bar :data="priorityData" :options="chartOptions" />
          </div>

          <!-- Doughnut Chart - Category Distribution -->
          <div class="chart-card">
            <h3 class="chart-title">Répartition par catégorie</h3>
            <Doughnut :data="categoryData" :options="chartOptions" />
          </div>

          <!-- Line Chart - Completion Trend (mock data) -->
          <div class="chart-card">
            <h3 class="chart-title">Tendance de productivité</h3>
            <Line :data="trendData" :options="lineChartOptions" />
          </div>
        </div>

        <div class="insights">
          <div class="insight-card">
            <span class="insight-emoji">🎯</span>
            <div class="insight-content">
              <strong>Taux de complétion</strong>
              <p>{{ completionRate }}%</p>
            </div>
          </div>

          <div class="insight-card" v-if="mostUsedCategory">
            <span class="insight-emoji">📁</span>
            <div class="insight-content">
              <strong>Catégorie favorite</strong>
              <p>{{ categoryLabel(mostUsedCategory) }}</p>
            </div>
          </div>

          <div class="insight-card" v-if="stats.overdue > 0">
            <span class="insight-emoji">⚠️</span>
            <div class="insight-content">
              <strong>Attention</strong>
              <p>{{ stats.overdue }} tâche(s) en retard</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Pie, Bar, Doughnut, Line } from 'vue-chartjs'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const showDashboard = ref(false)

function toggleDashboard() {
  showDashboard.value = !showDashboard.value
}

const completionRate = computed(() => {
  if (props.stats.total === 0) return 0
  return Math.round((props.stats.completed / props.stats.total) * 100)
})

const mostUsedCategory = computed(() => {
  const categories = props.stats.by_category
  const max = Math.max(...Object.values(categories))
  return Object.keys(categories).find(key => categories[key] === max)
})

const completionData = computed(() => ({
  labels: ['Terminées', 'En cours'],
  datasets: [{
    data: [props.stats.completed, props.stats.pending],
    backgroundColor: ['#10b981', '#f59e0b'],
    borderWidth: 0,
    hoverOffset: 10
  }]
}))

const priorityData = computed(() => ({
  labels: ['Basse', 'Moyenne', 'Haute', 'Urgente'],
  datasets: [{
    label: 'Nombre de tâches',
    data: [
      props.stats.by_priority.low || 0,
      props.stats.by_priority.medium || 0,
      props.stats.by_priority.high || 0,
      props.stats.by_priority.urgent || 0
    ],
    backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
    borderWidth: 0
  }]
}))

const categoryData = computed(() => ({
  labels: ['Travail', 'Personnel', 'Courses', 'Santé', 'Éducation', 'Autre'],
  datasets: [{
    data: [
      props.stats.by_category.work || 0,
      props.stats.by_category.personal || 0,
      props.stats.by_category.shopping || 0,
      props.stats.by_category.health || 0,
      props.stats.by_category.education || 0,
      props.stats.by_category.other || 0
    ],
    backgroundColor: ['#6366f1', '#ec4899', '#8b5cf6', '#ef4444', '#3b82f6', '#64748b'],
    borderWidth: 0,
    hoverOffset: 10
  }]
}))

const trendData = computed(() => ({
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [{
    label: 'Tâches complétées',
    data: [12, 19, 15, 25, 22, 18, 24], // Mock data
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    tension: 0.4,
    fill: true,
    pointRadius: 5,
    pointHoverRadius: 7
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        font: {
          size: 12
        }
      }
    }
  },
  animation: {
    animateScale: true,
    animateRotate: true
  }
}

const lineChartOptions = {
  ...chartOptions,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5
      }
    }
  }
}

function categoryLabel(cat) {
  const labels = {
    work: '💼 Travail',
    personal: '👤 Personnel',
    shopping: '🛒 Courses',
    health: '❤️ Santé',
    education: '📚 Éducation',
    other: '📌 Autre'
  }
  return labels[cat] || cat
}
</script>

<style scoped>
.dashboard-container {
  margin-bottom: 2rem;
}

.dashboard-toggle {
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.dashboard-toggle:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.dashboard-content {
  margin-top: 1.5rem;
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px var(--shadow);
}

.dark-mode .dashboard-content {
  border: 1px solid var(--border);
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: var(--light);
  padding: 1.5rem;
  border-radius: 16px;
  transition: var(--transition);
}

.dark-mode .chart-card {
  background: var(--dark-light);
  border: 1px solid var(--border);
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px var(--shadow);
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 1rem;
  text-align: center;
}

.insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.insight-card {
  background: var(--light);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
}

.dark-mode .insight-card {
  background: var(--dark-light);
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow);
}

.insight-emoji {
  font-size: 2rem;
}

.insight-content strong {
  display: block;
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insight-content p {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-content {
    padding: 1.5rem;
  }
}
</style>
