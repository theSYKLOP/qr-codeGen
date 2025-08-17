<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.type}`"
      >
        <span class="toast__icon">
          <FontAwesomeIcon :icon="iconFor(t.type)" />
        </span>
        <div class="toast__content">
          <p class="toast__title">{{ titleFor(t) }}</p>
          <p v-if="t.message" class="toast__message">{{ t.message }}</p>
        </div>
        <button class="toast__close" @click="remove(t.id)">
          <FontAwesomeIcon icon="fa-times" />
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
 </template>

<script setup>
defineOptions({ name: 'AppToast' })
const { toasts, remove } = useToast()

const iconFor = (type) => {
  switch (type) {
    case 'success': return 'fa-check-circle'
    case 'error': return 'fa-times-circle'
    case 'warning': return 'fa-exclamation-triangle'
    default: return 'fa-info-circle'
  }
}

const titleFor = (t) => {
  // Compat: accepte soit {message}, soit {title,message}
  if (t.title) return t.title
  switch (t.type) {
    case 'success': return 'Succès'
    case 'error': return 'Erreur'
    case 'warning': return 'Attention'
    default: return 'Information'
  }
}
</script>

<style scoped>
.toast-container { position: fixed; top: var(--space-6); right: var(--space-6); display: grid; gap: var(--space-3); z-index: 12000; }
.toast {
  display: grid; grid-template-columns: auto 1fr auto; gap: var(--space-3); align-items: start;
  padding: var(--space-3) var(--space-6); min-width: 280px; max-width: 380px;
  border-radius: 14px; color: #0b1220; background: #ffffffd9; backdrop-filter: blur(8px);
  box-shadow: 0 8px 30px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.08);
  border: 1px solid rgba(0,0,0,.06);
  /* Forcer une police compatible latin étendu pour afficher correctement les accents */
  font-family: 'Segoe UI', 'Noto Sans', Arial, system-ui, -apple-system, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !important;
}
.toast__icon { font-size: var(--font-size-lg); opacity: .95; color: inherit; }
.toast__title { margin: 0; font-weight: 700; line-height: 1.2; color: inherit; font-family: inherit !important; }
.toast__message { margin: var(--space-1) 0 0; opacity: .85; line-height: 1.4; color: inherit; font-family: inherit !important; }
.toast__close { background: transparent; border: none; color: inherit; font-size: 16px; cursor: pointer; opacity: .6; }
.toast__close:hover { opacity: 1; }

/* Accent par type via bordure et icône */
.toast--success { border-left: 4px solid #10b981; }
.toast--error { border-left: 4px solid #ef4444; }
.toast--info { border-left: 4px solid #2563eb; }
.toast--warning { border-left: 4px solid #f59e0b; }

.toast-enter-active, .toast-leave-active { transition: all .2s ease-out; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }
</style>


