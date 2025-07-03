'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { strapiAPI, type Event } from '@/lib/strapi'
import { EventsList } from './EventsList'
import { LanguageSelector } from '@/components/ui/navigation/LanguageSelector'

interface EventsPageClientProps {
  initialEvents: Event[]
  initialLocale: string
  initialError: string | null
  userToken: string
}

export function EventsPageClient({ 
  initialEvents, 
  initialLocale, 
  initialError, 
  userToken 
}: EventsPageClientProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(false)
  const [locale, setLocale] = useState(initialLocale)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    strapiAPI.setToken(userToken)
  }, [userToken])

  const fetchEvents = async (newLocale: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await strapiAPI.getEvents(1, 25, newLocale)
      setEvents(response.data)
    } catch (err) {
      setError('Failed to fetch events')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale)
    
    // Update URL with new locale
    const params = new URLSearchParams(searchParams.toString())
    if (newLocale !== 'en') {
      params.set('locale', newLocale)
    } else {
      params.delete('locale')
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(`/events${newUrl}`)
    
    // Fetch new events
    fetchEvents(newLocale)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {locale === 'de' ? 'Veranstaltungen' : 'Events'}
        </h1>
        <LanguageSelector 
          currentLocale={locale} 
          onLocaleChange={handleLocaleChange}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && <EventsList initialEvents={events} />}
    </div>
  )
} 