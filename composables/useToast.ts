type ToastType = 'success' | 'error' | 'info' | 'warning'
type ToastItem = { id: number; type: ToastType; title: string; message?: string; timeout?: number }
// Nuxt auto-imports useState, mais pour TS on peut déclarer sa signature minimale
declare function useState<T>(key: string, init: () => T): { value: T }

export const useToast = () => {
  const toasts = useState<ToastItem[]>('toasts', () => [])
  let counter = 0

  const normalizeText = (text?: string) => (text ?? '').toString().normalize('NFC')

  const push = (type: ToastType, title: string, message?: string, timeout = 3000) => {
    const id = ++counter
    toasts.value.push({ id, type, title: normalizeText(title), message: message ? normalizeText(message) : undefined, timeout })
    if (timeout > 0) setTimeout(() => remove(id), timeout)
  }

  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    push,
    remove,
    success: (title: string, message?: string, timeout?: number) => push('success', title, message, timeout),
    error: (title: string, message?: string, timeout?: number) => push('error', title, message, timeout),
    info: (title: string, message?: string, timeout?: number) => push('info', title, message, timeout),
    warning: (title: string, message?: string, timeout?: number) => push('warning', title, message, timeout)
  }
}


