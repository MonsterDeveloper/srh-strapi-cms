import {
  StrapiResponse,
  DisabilityCard,
  Event,
  Ticket,
  User
} from './strapi-types'

export const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'

class StrapiAPI {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = STRAPI_API_URL
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<StrapiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    if (response.status === 204) {
      return {
        data: null as unknown as T,
        meta: {}
      }
    }

    return response.json()
  }

  // Auth methods
  async login(identifier: string, password: string) {
    const response = await fetch(`${this.baseURL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    this.setToken(data.jwt)
    return data
  }

  async register(userData: {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
  }) {
    const response = await fetch(`${this.baseURL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }

    const data = await response.json()
    this.setToken(data.jwt)
    return data
  }

  // Disability Cards
  async getDisabilityCards(userId?: number): Promise<StrapiResponse<DisabilityCard[]>> {
    const filters = userId ? `?filters[user][id][$eq]=${userId}&populate=file` : '?populate=file'
    return this.request<DisabilityCard[]>(`/disability-cards${filters}`)
  }

  async getDisabilityCard(id: string): Promise<StrapiResponse<DisabilityCard>> {
    return this.request<DisabilityCard>(`/disability-cards/${id}?populate=file`)
  }

  async createDisabilityCard(data: Partial<DisabilityCard>): Promise<StrapiResponse<DisabilityCard>> {
    return this.request<DisabilityCard>('/disability-cards', {
      method: 'POST',
      body: JSON.stringify({ data }),
    })
  }

  async updateDisabilityCard(id: string, data: Partial<DisabilityCard>): Promise<StrapiResponse<DisabilityCard>> {
    return this.request<DisabilityCard>(`/disability-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    })
  }

  async deleteDisabilityCard(id: string): Promise<void> {
    await this.request(`/disability-cards/${id}`, {
      method: 'DELETE',
    })
  }

  // Events
  async getEvents(page = 1, pageSize = 25): Promise<StrapiResponse<Event[]>> {
    return this.request<Event[]>(`/events?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`)
  }

  async getEvent(id: string): Promise<StrapiResponse<Event>> {
    return this.request<Event>(`/events/${id}?populate=*`)
  }

  // Tickets
  async createTicket(data: {
    event: string
    disabilityCard?: string
  }): Promise<StrapiResponse<Ticket>> {
    return this.request<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify({ data }),
    })
  }

  async getUserTickets(userId: number): Promise<StrapiResponse<Ticket[]>> {
    return this.request<Ticket[]>(`/tickets?filters[user][id][$eq]=${userId}&populate=*`)
  }

  // File upload
  async uploadFile(file: File, ref?: string, refId?: string, field?: string): Promise<StrapiResponse<any>> {
    const formData = new FormData()
    formData.append('files', file)
    
    if (ref) formData.append('ref', ref)
    if (refId) formData.append('refId', refId)
    if (field) formData.append('field', field)

    const url = `${this.baseURL}/api/upload`
    const headers: Record<string, string> = {}

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // User profile
  async updateUserProfile(data: Partial<User>): Promise<StrapiResponse<User>> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getUserProfile(): Promise<StrapiResponse<User>> {
    return this.request<User>('/users/me')
  }
}

export const strapiAPI = new StrapiAPI()

// Re-export types for convenience
export type { StrapiResponse, DisabilityCard, Event, Ticket, User, Location, Organizer } from './strapi-types'