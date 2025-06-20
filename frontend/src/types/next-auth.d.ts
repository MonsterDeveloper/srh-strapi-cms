import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string | null
      lastName: string | null
      username: string
    }
    jwt: string
  }

  interface User {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    username: string
    jwt: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    firstName: string | null
    lastName: string | null
    username: string
    jwt: string
  }
} 