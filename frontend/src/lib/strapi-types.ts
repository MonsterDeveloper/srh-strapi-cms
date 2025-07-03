export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface DisabilityCard {
  id: number
  documentId: string
  type: 'mobility' | 'visual' | 'hearing' | 'cognitive' | 'chronic_illness' | 'mental_health' | 'temporary'
  cardStatus: 'active' | 'expired' | 'pending' | 'suspended'
  number: string
  expiryDate: string
  issuingCard: string
  file?: {
    id: number
    documentId: string
    name: string
    alternativeText?: string
    caption?: string
    width?: number
    height?: number
    formats?: any
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl?: string
    provider: string
    provider_metadata?: any
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: number
  documentId: string
  name: string
  description: string
  startTime: string
  endTime: string
  maxCap: number
  website?: string
  eventType: 'movie' | 'concert' | 'exhibition' | 'theater' | 'workshop' | 'conference'
  location: Location
  organizer: Organizer
  tickets: Ticket[]
  createdAt: string
  updatedAt: string
}

export interface Ticket {
  id: number
  documentId: string
  name: string
  price: number
  type: 'regular' | 'student' | 'senior' | 'accessibility' | 'companion'
  format: 'physical' | 'digital' | 'mobile'
  refundPolicy?: string
  zone?: string
  seat?: string
  event: Event
  createdAt: string
  updatedAt: string
}

export interface Location {
  id: number
  documentId: string
  name: string
  address: string
  capacity: number
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: string
  updatedAt: string
}

export interface Organizer {
  id: number
  documentId: string
  name: string
  email: string
  phoneNumber?: string
  website?: string
  type: 'individual' | 'company' | 'organization' | 'government'
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  documentId: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  birthday?: string
  phoneNumber?: string
  primaryLanguage?: string
  createdAt: string
  updatedAt: string
} 