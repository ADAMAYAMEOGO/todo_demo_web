import { onMounted, onUnmounted } from 'vue'

export function useKeyboardShortcuts(callbacks) {
  function handleKeyDown(event) {
    // Prevent shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.tagName === 'SELECT') {
      return
    }

    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey

    // N - New Todo
    if (key === 'n' && !ctrl && !shift) {
      event.preventDefault()
      callbacks.onNewTodo?.()
    }

    // / - Focus Search
    if (key === '/' && !ctrl && !shift) {
      event.preventDefault()
      callbacks.onFocusSearch?.()
    }

    // D - Toggle Dashboard
    if (key === 'd' && !ctrl && !shift) {
      event.preventDefault()
      callbacks.onToggleDashboard?.()
    }

    // R - Toggle Reorder Mode
    if (key === 'r' && !ctrl && !shift) {
      event.preventDefault()
      callbacks.onToggleReorder?.()
    }

    // T - Toggle Theme
    if (key === 't' && !ctrl && !shift) {
      event.preventDefault()
      callbacks.onToggleTheme?.()
    }

    // Escape - Close Modals
    if (key === 'escape') {
      event.preventDefault()
      callbacks.onEscape?.()
    }

    // Ctrl/Cmd + K - Command palette (future feature)
    if (key === 'k' && ctrl) {
      event.preventDefault()
      callbacks.onCommandPalette?.()
    }

    // ? - Show shortcuts help
    if (key === '?' && shift) {
      event.preventDefault()
      callbacks.onShowHelp?.()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}
