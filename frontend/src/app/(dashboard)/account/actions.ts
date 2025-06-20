'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { strapiServerAPI } from '@/lib/strapi-server'

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  birthday: z.string().optional(),
  primaryLanguage: z.string().optional(),
})

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.jwt) {
    redirect('/auth/sign-in')
  }

  try {
    const rawData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      birthday: formData.get('birthday') as string,
      primaryLanguage: formData.get('primaryLanguage') as string,
    }

    // Validate the data
    const validatedData = profileSchema.parse(rawData)
    
    // Update profile using server API
    await strapiServerAPI.updateUserProfile(validatedData)
    
    // Revalidate the page to show updated data
    revalidatePath('/account')
    
    return { success: true, message: 'Profile updated successfully!' }
  } catch (error) {
    console.error('Failed to update profile:', error)
    return { success: false, message: 'Failed to update profile. Please try again.' }
  }
} 