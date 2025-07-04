"use client"

import { Button } from "@/components/Button"
import { cx, focusRing } from "@/lib/utils"
import { ChevronsUpDown } from "lucide-react"
import { useSession } from "next-auth/react"

import { DropdownUserProfile } from "./DropdownUserProfile"

export function UserProfile() {
  const { data: session } = useSession()

  // Create initials from first and last name, fallback to username or email
  const getInitials = () => {
    if (session?.user.firstName && session?.user.lastName) {
      return `${session.user.firstName[0]}${session.user.lastName[0]}`.toUpperCase()
    }
    if (session?.user.username) {
      return session.user.username.slice(0, 2).toUpperCase()
    }
    if (session?.user.email) {
      return session.user.email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  // Create display name
  const getDisplayName = () => {
    if (session?.user.firstName && session?.user.lastName) {
      return `${session.user.firstName} ${session.user.lastName}`
    }
    if (session?.user.username) {
      return session.user.username
    }
    if (session?.user.email) {
      return session.user.email
    }
    return "User"
  }

  if (!session) {
    return null
  }

  return (
    <DropdownUserProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          "group flex w-full items-center justify-between rounded-md px-1 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200/50 data-[state=open]:bg-gray-200/50 hover:dark:bg-gray-800/50 data-[state=open]:dark:bg-gray-900",
          focusRing,
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            aria-hidden="true"
          >
            {getInitials()}
          </span>
          <span>{getDisplayName()}</span>
        </span>
        <ChevronsUpDown
          className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
          aria-hidden="true"
        />
      </Button>
    </DropdownUserProfile>
  )
}
