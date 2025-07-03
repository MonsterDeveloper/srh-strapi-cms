import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { strapiServerAPI } from '@/lib/strapi-server'
import { EventDetailsClient } from '@/components/ui/events/EventDetailsClient'
import type { Event, DisabilityCard } from '@/lib/strapi-types'

interface EventDetailsPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    locale?: string
  }>
}

export default async function EventDetailsPage({ params, searchParams }: EventDetailsPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const session = await getServerSession(authOptions)
  
  if (!session?.jwt) {
    notFound()
  }

  const locale = resolvedSearchParams.locale || 'en'
  let event: Event;
  let disabilityCards: DisabilityCard[] = []
  let error = null

  try {
    const eventResponse = await strapiServerAPI.getEvent(resolvedParams.id, locale)
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

  return (
    <EventDetailsClient 
      initialEvent={event}
      initialLocale={locale}
      initialError={error}
      userToken={session.jwt}
      eventId={resolvedParams.id}
      disabilityCards={disabilityCards}
    />
  )
}