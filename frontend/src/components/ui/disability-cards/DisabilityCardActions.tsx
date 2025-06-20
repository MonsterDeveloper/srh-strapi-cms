'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/Button'
import { strapiAPI } from '@/lib/strapi'
import { RiEditLine, RiDeleteBinLine } from '@remixicon/react'

interface DisabilityCardActionsProps {
  cardId: string
  documentId: string
}

export function DisabilityCardActions({ cardId, documentId }: DisabilityCardActionsProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this disability card?')) return
    
    try {
      // Set the JWT token for API calls
      if (session?.jwt) {
        strapiAPI.setToken(session.jwt)
      }
      
      await strapiAPI.deleteDisabilityCard(documentId)
      router.refresh()
    } catch (err) {
      console.error('Failed to delete disability card:', err)
      // You could add toast notifications here
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        href={`/disability-cards/${documentId}/edit`}
      >
        <RiEditLine className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        className="text-red-600 hover:text-red-700"
      >
        <RiDeleteBinLine className="h-4 w-4" />
      </Button>
    </div>
  )
} 