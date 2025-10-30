import { ref, computed, watch } from 'vue'
import confetti from 'canvas-confetti'

const currentStreak = ref(0)
const longestStreak = ref(0)
const totalCompleted = ref(0)
const lastCompletedDate = ref(null)
const achievements = ref([])

// Load from localStorage
function loadGamificationData() {
  try {
    const data = localStorage.getItem('gamification')
    if (data) {
      const parsed = JSON.parse(data)
      currentStreak.value = parsed.currentStreak || 0
      longestStreak.value = parsed.longestStreak || 0
      totalCompleted.value = parsed.totalCompleted || 0
      lastCompletedDate.value = parsed.lastCompletedDate
      achievements.value = parsed.achievements || []
    }
  } catch (e) {
    console.error('Error loading gamification data:', e)
  }
}

// Save to localStorage
function saveGamificationData() {
  try {
    localStorage.setItem('gamification', JSON.stringify({
      currentStreak: currentStreak.value,
      longestStreak: longestStreak.value,
      totalCompleted: totalCompleted.value,
      lastCompletedDate: lastCompletedDate.value,
      achievements: achievements.value
    }))
  } catch (e) {
    console.error('Error saving gamification data:', e)
  }
}

// Check if same day
function isSameDay(date1, date2) {
  if (!date1 || !date2) return false
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

// Check if consecutive days
function isConsecutiveDay(date1, date2) {
  if (!date1 || !date2) return false
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

export function useGamification() {
  // Initialize on first load
  loadGamificationData()

  // Available achievements
  const availableAchievements = [
    { id: 'first-task', name: 'Premier pas', description: 'Compléter votre première tâche', icon: '🎯', requirement: 1 },
    { id: 'streak-3', name: 'Régularité', description: '3 jours consécutifs', icon: '🔥', requirement: 3 },
    { id: 'streak-7', name: 'Hebdomadaire', description: '7 jours consécutifs', icon: '📅', requirement: 7 },
    { id: 'streak-30', name: 'Champion', description: '30 jours consécutifs', icon: '🏆', requirement: 30 },
    { id: 'completed-10', name: 'Productif', description: '10 tâches complétées', icon: '⚡', requirement: 10 },
    { id: 'completed-50', name: 'Expert', description: '50 tâches complétées', icon: '🌟', requirement: 50 },
    { id: 'completed-100', name: 'Maître', description: '100 tâches complétées', icon: '👑', requirement: 100 },
    { id: 'all-complete', name: 'Perfectionniste', description: 'Toutes les tâches terminées', icon: '💯', requirement: 'all' }
  ]

  // Check for new achievements
  function checkAchievements() {
    const newAchievements = []
    
    availableAchievements.forEach(achievement => {
      if (achievements.value.some(a => a.id === achievement.id)) return
      
      let earned = false
      if (achievement.id === 'first-task' && totalCompleted.value >= 1) earned = true
      if (achievement.id === 'streak-3' && currentStreak.value >= 3) earned = true
      if (achievement.id === 'streak-7' && currentStreak.value >= 7) earned = true
      if (achievement.id === 'streak-30' && currentStreak.value >= 30) earned = true
      if (achievement.id === 'completed-10' && totalCompleted.value >= 10) earned = true
      if (achievement.id === 'completed-50' && totalCompleted.value >= 50) earned = true
      if (achievement.id === 'completed-100' && totalCompleted.value >= 100) earned = true
      
      if (earned) {
        newAchievements.push(achievement)
        achievements.value.push({
          ...achievement,
          earnedAt: new Date().toISOString()
        })
      }
    })
    
    return newAchievements
  }

  // Motivational messages
  const motivationalMessages = [
    "Excellent travail ! 🎉",
    "Vous êtes en feu ! 🔥",
    "Incroyable performance ! 🌟",
    "Continue comme ça ! 💪",
    "Magnifique ! ✨",
    "Tu es unstoppable ! 🚀",
    "Bravo champion ! 🏆",
    "Quelle productivité ! ⚡"
  ]

  function getRandomMessage() {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  }

  // Confetti variations
  function fireConfetti() {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }))
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }))
    }, 250)
  }

  function fireSimpleConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  function fireEpicConfetti() {
    const count = 200
    const defaults = {
      origin: { y: 0.7 }
    }

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }))
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55
    })
    fire(0.2, {
      spread: 60
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    })
  }

  // Track task completion
  function onTaskCompleted() {
    const today = new Date().toISOString().split('T')[0]
    
    // Update total completed
    totalCompleted.value++
    
    // Update streak
    if (!lastCompletedDate.value || isSameDay(lastCompletedDate.value, today)) {
      // Same day, just update date
      lastCompletedDate.value = today
    } else if (isConsecutiveDay(lastCompletedDate.value, today)) {
      // Consecutive day, increment streak
      currentStreak.value++
      lastCompletedDate.value = today
      
      if (currentStreak.value > longestStreak.value) {
        longestStreak.value = currentStreak.value
      }
    } else {
      // Streak broken
      currentStreak.value = 1
      lastCompletedDate.value = today
    }
    
    // Check for new achievements
    const newAchievements = checkAchievements()
    
    // Save data
    saveGamificationData()
    
    // Fire confetti
    fireSimpleConfetti()
    
    return {
      message: getRandomMessage(),
      newAchievements
    }
  }

  // Celebrate all tasks complete
  function onAllTasksComplete() {
    // Check for achievement
    const achievement = availableAchievements.find(a => a.id === 'all-complete')
    if (achievement && !achievements.value.some(a => a.id === 'all-complete')) {
      achievements.value.push({
        ...achievement,
        earnedAt: new Date().toISOString()
      })
      saveGamificationData()
    }
    
    // Epic confetti
    fireEpicConfetti()
    
    return {
      message: "🎉 Toutes les tâches terminées ! Tu es incroyable ! 🌟",
      achievement: achievement
    }
  }

  return {
    currentStreak: computed(() => currentStreak.value),
    longestStreak: computed(() => longestStreak.value),
    totalCompleted: computed(() => totalCompleted.value),
    achievements: computed(() => achievements.value),
    availableAchievements,
    onTaskCompleted,
    onAllTasksComplete,
    fireConfetti,
    fireSimpleConfetti,
    fireEpicConfetti
  }
}
