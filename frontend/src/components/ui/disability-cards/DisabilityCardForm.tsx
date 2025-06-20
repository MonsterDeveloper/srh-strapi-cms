'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { SelectWithOptions as Select } from '@/components/Select'
import { strapiAPI, DisabilityCard } from '@/lib/strapi'
import { disabilityTypeOptions } from '@/lib/disability-card-utils'

const disabilityCardSchema = z.object({
  type: z.enum(['mobility', 'visual', 'hearing', 'cognitive', 'chronic_illness', 'mental_health', 'temporary']),
  number: z.string().min(1, 'Card number is required'),
  issuingCard: z.string().min(1, 'Issuing organization is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
})

type DisabilityCardForm = z.infer<typeof disabilityCardSchema>

interface DisabilityCardFormProps {
  initialData?: DisabilityCard
  mode: 'create' | 'edit'
  cardId?: string
}

export function DisabilityCardForm({ initialData, mode, cardId }: DisabilityCardFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DisabilityCardForm>({
    resolver: zodResolver(disabilityCardSchema),
    defaultValues: initialData ? {
      type: initialData.type,
      number: initialData.number,
      issuingCard: initialData.issuingCard,
      expiryDate: initialData.expiryDate?.split('T')[0], // Format date for input
    } : undefined,
  })

  const onSubmit = async (data: DisabilityCardForm) => {
    try {
      setLoading(true)
      setError(null)
      
      // Set the JWT token for API calls
      if (session?.jwt) {
        strapiAPI.setToken(session.jwt)
      }
      
      if (mode === 'create') {
        await strapiAPI.createDisabilityCard({
          ...data,
          cardStatus: 'pending',
        })
      } else if (mode === 'edit' && cardId) {
        await strapiAPI.updateDisabilityCard(cardId, data)
      }
      
      router.push('/disability-cards')
    } catch (err) {
      setError(`Failed to ${mode} disability card`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Disability Type *
          </label>
          <Select
            options={disabilityTypeOptions}
            placeholder="Select disability type"
            value={initialData?.type}
            onValueChange={(value) => setValue('type', value as any)}
          />
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <Input
            id="number"
            {...register('number')}
            placeholder="Enter your card number"
            error={errors.number?.message}
          />
        </div>

        <div>
          <label htmlFor="issuingCard" className="block text-sm font-medium text-gray-700 mb-2">
            Issuing Organization *
          </label>
          <Input
            id="issuingCard"
            {...register('issuingCard')}
            placeholder="Enter the issuing organization"
            error={errors.issuingCard?.message}
          />
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date *
          </label>
          <Input
            id="expiryDate"
            type="date"
            {...register('expiryDate')}
            error={errors.expiryDate?.message}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? `${mode === 'create' ? 'Creating' : 'Updating'}...` : `${mode === 'create' ? 'Create' : 'Update'} Card`}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
} 