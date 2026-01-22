import { useState } from 'react'
import { ToastProps } from '../components/ui/toast'

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (props: Omit<ToastProps, 'onDismiss'>) => {
    const toastWithDismiss = {
      ...props,
      onDismiss: () => setToast(null)
    }
    setToast(toastWithDismiss)
  }

  return {
    toast,
    showToast
  }
}