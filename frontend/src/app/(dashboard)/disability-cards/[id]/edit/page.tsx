import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { strapiServerAPI } from '@/lib/strapi-server'
import { DisabilityCardForm } from '@/components/ui/disability-cards/DisabilityCardForm'
import { Button } from '@/components/Button'
import { redirect, notFound } from 'next/navigation'

interface EditDisabilityCardPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditDisabilityCardPage({ params }: EditDisabilityCardPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  let card = null
  let error: string | null = null
    const resolvedParams = await params

  try {
    const response = await strapiServerAPI.getDisabilityCard(resolvedParams.id)
    card = response.data
  } catch (err) {
    console.error('Failed to fetch disability card:', err)
    notFound()
  }

  if (!card) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Disability Card</h1>
        <p className="text-gray-600 mt-1">
          Update your disability card information.
        </p>
      </div>

      <DisabilityCardForm 
        mode="edit" 
        initialData={card}
        cardId={resolvedParams.id}
      />
    </div>
  )
}