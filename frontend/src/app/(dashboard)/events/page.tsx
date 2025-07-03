import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { strapiServerAPI, type Event } from '@/lib/strapi-server'
import { EventsPageClient } from '@/components/ui/events/EventsPageClient'

interface EventsPageProps {
  searchParams: Promise<{
    locale?: string
  }>
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const session = await getServerSession(authOptions)
  const resolvedSearchParams = await searchParams
  
  if (!session?.jwt) {
    redirect('/auth/sign-in')
  }

  const locale = resolvedSearchParams.locale || 'en'
  let events: Event[] = []
  let error = null

  try {
    const response = await strapiServerAPI.getEvents(1, 25, locale)
    console.log(response)
    events = response.data
  } catch (err) {
    error = 'Failed to fetch events'
    console.error(err)
  }

  return (
    <EventsPageClient 
      initialEvents={events} 
      initialLocale={locale}
      initialError={error}
      userToken={session.jwt}
    />
  )
}