import Link from 'next/link'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { RiArrowLeftLine } from '@remixicon/react'

export default function EventNotFound() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button asChild variant="secondary">
        <Link href="/events">
          <RiArrowLeftLine className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
      </Button>
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
        <p className="text-gray-500">
          The event you're looking for doesn't exist or has been removed.
        </p>
      </Card>
    </div>
  )
} 