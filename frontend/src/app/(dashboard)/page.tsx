import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  const firstName = session?.user?.firstName
  const lastName = session?.user?.lastName
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : firstName || lastName || session?.user?.email || "User"

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome, {displayName}!
          </h1>
    </div>
  )
}