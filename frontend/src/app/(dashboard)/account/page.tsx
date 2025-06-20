import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { ProfileForm } from '@/components/ui/account/ProfileForm'
import { authOptions } from '@/lib/auth'
import { strapiServerAPI, User } from '@/lib/strapi-server'
import { RiUserLine, RiGlobalLine, RiSettings3Line } from '@remixicon/react'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.jwt) {
    redirect('/auth/sign-in')
  }

  // Fetch user profile using server-side API with JWT
  let userProfile: User;
  
  try {
    const response = await strapiServerAPI.getUserProfile()
    userProfile = response as unknown as User;
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    // You could redirect to an error page or show a fallback
    throw new Error('Failed to load user profile')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <RiUserLine className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Profile Information</h2>
          </div>

          <ProfileForm userProfile={userProfile} />
        </Card>

        {/* Account Information (Read-only) */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <RiGlobalLine className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="text-gray-900 font-medium dark:text-gray-300">
                {userProfile.username || session.user.username || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="text-gray-900 font-medium dark:text-gray-300">
                {userProfile.email || session.user.email || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <div className="text-gray-600 dark:text-gray-300">
                {userProfile.createdAt 
                  ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'
                }
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button 
              variant="outline" 
              href="/disability-cards"
              className="flex items-center justify-center gap-2"
            >
              <RiUserLine className="h-4 w-4" />
              Manage Disability Cards
            </Button>
            <Button 
              variant="outline" 
              href="/events"
              className="flex items-center justify-center gap-2"
            >
              <RiSettings3Line className="h-4 w-4" />
              View Events
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}