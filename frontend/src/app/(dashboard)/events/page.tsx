import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { strapiServerAPI, type Event } from '@/lib/strapi-server'
import { EventsList } from '@/components/ui/events/EventsList'

export default async function EventsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.jwt) {
    redirect('/auth/sign-in')
  }

  let events: Event[] = []
  let error = null

  try {
    const response = await strapiServerAPI.getEvents(1, 25)
    events = response.data
  } catch (err) {
    error = 'Failed to fetch events'
    console.error(err)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <EventsList initialEvents={events} />
    </div>
  )
}