'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Event } from '@/lib/strapi-server'
import { EventSearch } from './EventSearch'
import { RiCalendarEventLine, RiMapPinLine, RiTicketLine } from '@remixicon/react'

interface EventsListProps {
  initialEvents: Event[]
}

export function EventsList({ initialEvents }: EventsListProps) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents)

  const handleFilteredEventsChange = useCallback((events: Event[]) => {
    setFilteredEvents(events)
  }, [])

  const getEventTypeColor = (eventType: Event['eventType']) => {
    switch (eventType) {
      case 'movie': return 'blue'
      case 'concert': return 'purple'
      case 'exhibition': return 'green'
      case 'theater': return 'red'
      case 'workshop': return 'yellow'
      case 'conference': return 'gray'
    }
  }

  const getEventTypeLabel = (eventType: Event['eventType']) => {
    return eventType.charAt(0).toUpperCase() + eventType.slice(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <EventSearch 
        events={initialEvents} 
        onFilteredEventsChange={handleFilteredEventsChange} 
      />

      {filteredEvents.length === 0 ? (
        <Card className="p-8 text-center">
          <RiCalendarEventLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search terms or check back later for upcoming events
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Badge color={getEventTypeColor(event.eventType)}>
                    {getEventTypeLabel(event.eventType)}
                  </Badge>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatDate(event.startTime)}</div>
                    <div>{formatTime(event.startTime)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <RiMapPinLine className="h-4 w-4 flex-shrink-0" />
                    <span>{event.location.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiTicketLine className="h-4 w-4 flex-shrink-0" />
                    <span>{event.maxCap} capacity</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href={`/events/${event.documentId}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 