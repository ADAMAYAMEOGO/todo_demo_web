<template>
  <transition name="toast">
    <div v-if="show" class="celebration-toast" :class="{ 'all-complete': isAllComplete }">
      <div class="toast-content">
        <div class="toast-icon">{{ isAllComplete ? '🎉' : '✨' }}</div>
        <div class="toast-text">
          <h3>{{ message }}</h3>
          <p v-if="newAchievement">
            🏆 Nouveau : {{ newAchievement.name }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  newAchievement: Object,
  isAllComplete: {
    type: Boolean,
    default: false
  }
})

const show = ref(false)

watch(() => props.message, (newVal) => {
  if (newVal) {
    show.value = true
    setTimeout(() => {
      show.value = false
    }, props.isAllComplete ? 5000 : 3000)
  }
})
</script>

<style scoped>
.celebration-toast {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
  min-width: 300px;
  max-width: 400px;
}

.celebration-toast.all-complete {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
  animation: pulse 0.5s ease infinite alternate;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toast-icon {
  font-size: 2.5rem;
  animation: bounce 0.6s ease infinite;
}

.toast-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.toast-text p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.95;
}

.toast-enter-active {
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100px) scale(0.8);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
  }
  100% {
    box-shadow: 0 10px 40px rgba(245, 158, 11, 0.6), 0 0 30px rgba(245, 158, 11, 0.3);
  }
}

@media (max-width: 640px) {
  .celebration-toast {
    top: 70px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
