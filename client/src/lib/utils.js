import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

export const truncate = (str, len = 50) =>
  str?.length > len ? str.slice(0, len) + '...' : (str || '')

export const generateOrderId = () =>
  `ORD-${Date.now().toString(36).toUpperCase()}`

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(date))