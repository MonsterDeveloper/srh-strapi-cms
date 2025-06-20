'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'
import { strapiAPI } from '@/lib/strapi'
import { Event, DisabilityCard, Ticket } from '@/lib/strapi-server'

const ticketSchema = z.object({
  disabilityCard: z.string().optional(),
})

type TicketForm = z.infer<typeof ticketSchema>

interface TicketBookingFormProps {
  event: Event
  disabilityCards: DisabilityCard[]
  userToken: string
}

export function TicketBookingForm({ event, disabilityCards, userToken }: TicketBookingFormProps) {
  const router = useRouter()
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
  })


  const onSubmit = async (data: TicketForm) => {
    try {
      setBookingLoading(true)
      setError(null)

      // Set the token for the API call
      strapiAPI.setToken(userToken)

      await strapiAPI.createTicket({
        event: event.documentId,
        disabilityCard: data.disabilityCard,
      })

      setBookingSuccess(true)
    } catch (err) {
      setError('Failed to book ticket')
      console.error(err)
    } finally {
      setBookingLoading(false)
    }
  }

  if (bookingSuccess) {
    return (
      <div className="text-center">
        <div className="text-green-600 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Successful!</h3>
        <p className="text-gray-500 mb-4">
          Your ticket for "{event.name}" has been booked successfully.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/tickets">View My Tickets</Link>
          </Button>
          <Button variant="secondary" onClick={() => router.push('/events')}>
            Browse More Events
          </Button>
        </div>
      </div>
    )
  }

  const disabilityCardOptions = disabilityCards
    .filter(card => card.cardStatus === 'active')


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      

<div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disability Card
          </label>
          {disabilityCardOptions.length > 0 ? (
            <Select onValueChange={(value) => setValue('disabilityCard', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select disability card" />
              </SelectTrigger>
              <SelectContent>
                {disabilityCardOptions.map(card => (
                  <SelectItem key={card.documentId} value={card.documentId}>
                    {card.type.replace('_', ' ')} Card - {card.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded">
              You need an active disability card for accessibility tickets.{' '}
              <Link href="/disability-cards/new" className="text-blue-600 hover:text-blue-700">
                Add one here
              </Link>
            </div>
          )}
        </div>

      <Button
        type="submit"
        disabled={bookingLoading || disabilityCardOptions.length === 0}
        className="w-full"
        isLoading={bookingLoading}
        loadingText="Booking..."
      >
        Book Ticket
      </Button>
    </form>
  )
} 