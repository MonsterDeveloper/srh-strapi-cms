'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { SelectWithOptions as Select } from '@/components/Select'
import { updateUserProfile } from '@/app/(dashboard)/account/actions'
import { User } from '@/lib/strapi-types'
import { RiSettings3Line } from '@remixicon/react'

interface ProfileFormProps {
  userProfile: User
}

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
]

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [primaryLanguage, setPrimaryLanguage] = useState(userProfile.primaryLanguage || '')
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    // Add the current language selection to form data
    formData.set('primaryLanguage', primaryLanguage)
    
    startTransition(async () => {
      try {
        const result = await updateUserProfile(formData)
        
        if (result.success) {
          setMessage({ type: 'success', text: result.message })
          // Refresh the page to show updated session data
          router.refresh()
        } else {
          setMessage({ type: 'error', text: result.message })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'An unexpected error occurred' })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {message && (
        <div className={`px-4 py-3 rounded border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={userProfile.firstName || ''}
            placeholder="Enter your first name"
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={userProfile.lastName || ''}
            placeholder="Enter your last name"
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          defaultValue={userProfile.phoneNumber || ''}
          placeholder="Enter your phone number"
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth
        </label>
        <Input
          id="birthday"
          name="birthday"
          type="date"
          defaultValue={userProfile.birthday?.split('T')[0] || ''}
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="primaryLanguage" className="block text-sm font-medium text-gray-700 mb-2">
          Primary Language
        </label>
        <Select
          options={languageOptions}
          placeholder="Select your primary language"
          value={primaryLanguage}
          onValueChange={setPrimaryLanguage}
          disabled={isPending}
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <RiSettings3Line className="h-4 w-4" />
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
} 