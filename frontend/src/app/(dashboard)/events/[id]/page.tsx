import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { authOptions } from '@/lib/auth'
import { strapiServerAPI } from '@/lib/strapi-server'
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

import type { Event, DisabilityCard } from '@/lib/strapi-types'

interface EventDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const resolvedParams = await params
  const session = await getServerSession(authOptions)
  
  if (!session?.jwt) {
    notFound()
  }

  let event: Event;
  let disabilityCards: DisabilityCard[] = []
  let error = null

  try {
    const eventResponse = await strapiServerAPI.getEvent(resolvedParams.id)
    event = eventResponse.data
  } catch (err) {
    console.error('Failed to fetch event:', err)
    notFound()
  }

  // Fetch disability cards if user is authenticated
  if (session?.user?.id) {
    try {
      const cardsResponse = await strapiServerAPI.getDisabilityCards(Number(session.user.id))
      disabilityCards = cardsResponse.data
    } catch (err) {
      console.error('Failed to fetch disability cards:', err)
    }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const availableTickets = event.tickets || []

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Button asChild variant="secondary">
        <Link href="/events">
          <RiArrowLeftLine className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
      </Button>

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
                    <div className="font-medium">Start Time</div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(event.startTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RiTimeLine className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">End Time</div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(event.endTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RiMapPinLine className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
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
                    <div className="font-medium">Organizer</div>
                    <div className="text-sm text-gray-600">
                      {event.organizer.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <div>
                  <span className="font-medium">Capacity:</span> {event.maxCap}
                </div>
                {event.website && (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <RiGlobalLine className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Book Ticket</h3>
            
            {!session ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Please sign in to book tickets
                </p>
                <Button asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
              </div>
            ) : (
              <TicketBookingForm 
                event={event} 
                disabilityCards={disabilityCards}
                userToken={session.jwt}
              />
            )}
          </Card>

          {availableTickets.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Available Tickets</h3>
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
                        <div className="text-sm text-gray-600">Zone: {ticket.zone}</div>
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