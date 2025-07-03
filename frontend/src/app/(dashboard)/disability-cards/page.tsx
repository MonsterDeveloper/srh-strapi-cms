import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { strapiServerAPI } from '@/lib/strapi-server'
import { getStatusColor, getTypeLabel } from '@/lib/disability-card-utils'
import { DisabilityCardActions } from '@/components/ui/disability-cards/DisabilityCardActions'
import { RiAddLine, RiFileTextLine, RiFileDownloadLine } from '@remixicon/react'
import { redirect } from 'next/navigation'
import { STRAPI_API_URL } from '@/lib/strapi'

export default async function DisabilityCardsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  let cards: any[] = []
  let error: string | null = null

  try {
    const response = await strapiServerAPI.getDisabilityCards(Number(session.user.id))
    cards = response.data
  } catch (err) {
    error = 'Failed to fetch disability cards'
    console.error(err)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Disability Cards</h1>
        <Button href="/disability-cards/new" className="flex items-center gap-2">
          <RiAddLine className="h-4 w-4" />
          Add New Card
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {cards.length === 0 ? (
        <Card className="p-8 text-center">
          <RiFileTextLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No disability cards</h3>
          <p className="text-gray-500 mb-4">You haven't added any disability cards yet.</p>
          <Button href="/disability-cards/new">Add your first card</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cards.map((card) => (
            <Card key={card.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">
                      {getTypeLabel(card.type)} Card
                    </h3>
                    <Badge color={getStatusColor(card.cardStatus)}>
                      {card.cardStatus}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Card Number:</span> {card.number}
                    </div>
                    <div>
                      <span className="font-medium">Issuing Organization:</span> {card.issuingCard}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {new Date(card.expiryDate).toLocaleDateString()}
                    </div>
                    {card.file && (
                      <div className="flex items-center gap-2 pt-2">
                        <RiFileDownloadLine className="h-4 w-4 text-blue-500" />
                        <a
                          href={STRAPI_API_URL + card.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                        >
                          {card.file.name}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <DisabilityCardActions 
                  cardId={card.id.toString()} 
                  documentId={card.documentId} 
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}