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
import { strapiAPI, DisabilityCard, STRAPI_API_URL } from '@/lib/strapi'
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          setFilePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
  }

  const onSubmit = async (data: DisabilityCardForm) => {
    try {
      setLoading(true)
      setError(null)
      
      // Set the JWT token for API calls
      if (session?.jwt) {
        strapiAPI.setToken(session.jwt)
      }
      
      let cardResponse
      
      if (mode === 'create') {
        cardResponse = await strapiAPI.createDisabilityCard({
          ...data,
          cardStatus: 'pending',
        })
      } else if (mode === 'edit' && cardId) {
        cardResponse = await strapiAPI.updateDisabilityCard(cardId, data)
      }
      
      // Upload file if selected
      if (selectedFile && cardResponse?.data) {
        await strapiAPI.uploadFile(
          selectedFile,
          'api::disability-card.disability-card',
          cardResponse.data.id.toString(),
          'file'
        )
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

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Card Document
          </label>
          <div className="space-y-3">
            <Input
              id="file"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500">
              Upload an image or document of your disability card (PDF, DOC, DOCX, or image files)
            </p>
            
            {/* Show existing file in edit mode */}
            {initialData?.file && !selectedFile && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Current file: {initialData.file.name}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Uploaded file is attached to this card
                    </p>
                  </div>
                  <a
                    href={STRAPI_API_URL + initialData.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                  >
                    View File
                  </a>
                </div>
              </div>
            )}
            
            {/* Show file preview for new uploads */}
            {filePreview && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                <div className="flex justify-center">
                  <img
                    src={filePreview}
                    alt="File preview"
                    className="max-w-full max-h-48 object-contain rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>
              </div>
            )}
            
            {/* Show file name for non-image files */}
            {selectedFile && !filePreview && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-700">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
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