'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { strapiAPI, type Event, type DisabilityCard } from '@/lib/strapi'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { LanguageSelector } from '@/components/ui/navigation/LanguageSelector'
import { TicketBookingForm } from '@/components/ui/events/TicketBookingForm'
import { 
  RiCalendarEventLine, 
  RiMapPinLine, 
  RiTicketLine, 
  RiGlobalLine,
  RiArrowLeftLine,
  RiUserLine,
  RiTimeLine
} from '@remixicon/react'

interface EventDetailsClientProps {
  initialEvent: Event
  initialLocale: string
  initialError: string | null
  userToken: string
  eventId: string
  disabilityCards: DisabilityCard[]
}

export function EventDetailsClient({ 
  initialEvent, 
  initialLocale, 
  initialError, 
  userToken, 
  eventId,
  disabilityCards
}: EventDetailsClientProps) {
  const [event, setEvent] = useState<Event>(initialEvent)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(false)
  const [locale, setLocale] = useState(initialLocale)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    strapiAPI.setToken(userToken)
  }, [userToken])

  const fetchEvent = async (newLocale: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await strapiAPI.getEvent(eventId, newLocale)
      setEvent(response.data)
    } catch (err) {
      setError('Failed to fetch event')
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
    router.push(`${pathname}${newUrl}`)
    
    // Fetch new event data
    fetchEvent(newLocale)
  }

  const getEventTypeColor = (eventType: typeof event.eventType) => {
    switch (eventType) {
      case 'movie': return 'blue'
      case 'concert': return 'purple' 
      case 'exhibition': return 'green'
      case 'theater': return 'red'
      case 'workshop': return 'yellow'
      case 'conference': return 'gray'
      default: return 'gray'
    }
  }

  const getEventTypeLabel = (eventType: typeof event.eventType) => {
    return eventType.charAt(0).toUpperCase() + eventType.slice(1)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const availableTickets = event.tickets || []

  const translations = {
    en: {
      backToEvents: 'Back to Events',
      startTime: 'Start Time',
      endTime: 'End Time',
      location: 'Location',
      organizer: 'Organizer',
      capacity: 'Capacity',
      website: 'Website',
      bookTicket: 'Book Ticket',
      signInToBook: 'Please sign in to book tickets',
      signIn: 'Sign In',
      availableTickets: 'Available Tickets',
      zone: 'Zone'
    },
    de: {
      backToEvents: 'Zurück zu Veranstaltungen',
      startTime: 'Startzeit',
      endTime: 'Endzeit',
      location: 'Ort',
      organizer: 'Veranstalter',
      capacity: 'Kapazität',
      website: 'Website',
      bookTicket: 'Ticket buchen',
      signInToBook: 'Bitte melden Sie sich an, um Tickets zu buchen',
      signIn: 'Anmelden',
      availableTickets: 'Verfügbare Tickets',
      zone: 'Zone'
    }
  }

  const t = translations[locale as keyof typeof translations]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Button asChild variant="secondary">
          <Link href="/events">
            <RiArrowLeftLine className="h-4 w-4 mr-2" />
            {t.backToEvents}
          </Link>
        </Button>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
                  <Badge color={getEventTypeColor(event.eventType)}>
                    {getEventTypeLabel(event.eventType)}
                  </Badge>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <RiCalendarEventLine className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">{t.startTime}</div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(event.startTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RiTimeLine className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">{t.endTime}</div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(event.endTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RiMapPinLine className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">{t.location}</div>
                    <div className="text-sm text-gray-600">
                      {event.location.name}
                      <br />
                      {event.location.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RiUserLine className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">{t.organizer}</div>
                    <div className="text-sm text-gray-600">
                      {event.organizer.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <div>
                  <span className="font-medium">{t.capacity}:</span> {event.maxCap}
                </div>
                {event.website && (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <RiGlobalLine className="h-4 w-4" />
                    {t.website}
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t.bookTicket}</h3>
            
            <TicketBookingForm 
              event={event} 
              disabilityCards={disabilityCards}
              userToken={userToken}
            />
          </Card>

          {availableTickets.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t.availableTickets}</h3>
              <div className="space-y-3">
                {availableTickets.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{ticket.name}</div>
                      <div className="text-sm text-gray-600">
                        {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)} • {ticket.format}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${ticket.price}</div>
                      {ticket.zone && (
                        <div className="text-sm text-gray-600">{t.zone}: {ticket.zone}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 