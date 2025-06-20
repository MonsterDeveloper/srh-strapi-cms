import { DisabilityCard } from './strapi-types'

export function getStatusColor(status: DisabilityCard['cardStatus']) {
  switch (status) {
    case 'active': return 'emerald'
    case 'expired': return 'red'
    case 'pending': return 'yellow'
    case 'suspended': return 'gray'
    default: return 'gray'
  }
}

export function getTypeLabel(type: DisabilityCard['type']) {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export const disabilityTypeOptions = [
  { value: 'mobility', label: 'Mobility' },
  { value: 'visual', label: 'Visual' },
  { value: 'hearing', label: 'Hearing' },
  { value: 'cognitive', label: 'Cognitive' },
  { value: 'chronic_illness', label: 'Chronic Illness' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'temporary', label: 'Temporary' },
] 