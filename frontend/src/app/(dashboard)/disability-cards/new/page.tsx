import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DisabilityCardForm } from '@/components/ui/disability-cards/DisabilityCardForm'
import { redirect } from 'next/navigation'

export default async function NewDisabilityCardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Disability Card</h1>
        <p className="text-gray-600 mt-1">
          Add your disability card information to access accessibility features.
        </p>
      </div>

      <DisabilityCardForm mode="create" />
    </div>
  )
}