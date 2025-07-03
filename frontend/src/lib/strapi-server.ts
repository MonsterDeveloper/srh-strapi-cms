import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import {
  StrapiResponse,
  DisabilityCard,
  Event,
  Ticket,
  User
} from './strapi-types'

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'

class StrapiServerAPI {
  private baseURL: string

  constructor() {
    this.baseURL = STRAPI_API_URL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<StrapiResponse<T>> {
    const session = await getServerSession(authOptions)
    
    if (!session?.jwt) {
      throw new Error('Unauthorized: No JWT token found')
    }

    const url = `${this.baseURL}/api${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.jwt}`,
    }

    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    const response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-store', // Ensure fresh data for server components
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
    type: string
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

export const strapiServerAPI = new StrapiServerAPI()

// Re-export types for convenience
export type { StrapiResponse, DisabilityCard, Event, Ticket, User, Location, Organizer } from './strapi-types' 