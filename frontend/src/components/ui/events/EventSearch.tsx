'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/Input'
import { Event } from '@/lib/strapi-server'
import { RiSearchLine } from '@remixicon/react'

interface EventSearchProps {
  events: Event[]
  onFilteredEventsChange: (filteredEvents: Event[]) => void
}

export function EventSearch({ events, onFilteredEventsChange }: EventSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (searchTerm) {
      const filtered = events.filter(event =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      onFilteredEventsChange(filtered)
    } else {
      onFilteredEventsChange(events)
    }
  }, [searchTerm, events, onFilteredEventsChange])

  return (
    <div className="relative">
      <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search events, locations, or descriptions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
  )
} 