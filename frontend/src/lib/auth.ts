import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id:          number;
  documentId:  string;
  username:    string;
  email:       string;
  provider:    string;
  confirmed:   boolean;
  blocked:     boolean;
  createdAt:   Date;
  updatedAt:   Date;
  publishedAt: Date;
  firstName:   string | null;
  lastName:    string | null;
  birthday:    null;
  phoneNumber: null;
}

export const authOptions: NextAuthOptions = {
  secret: "super-secret",
  providers: [
    CredentialsProvider({
      name: "Strapi Sign In",
      id: "strapi-sign-in",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const response = await fetch("http://localhost:1337/api/auth/local", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            identifier: credentials?.email,
            password: credentials?.password
          })
        })
        
        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { jwt: string, user: User };

        return { ...data.user, jwt: data.jwt, id: String(data.user.id)};
      }
    }),
    CredentialsProvider({
      name: "Strapi Sign Up",
      id: "strapi-sign-up",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        phoneNumber: { label: "Phone Number", type: "text" },
      },
      async authorize(credentials, req) {
        const response = await fetch("http://localhost:1337/api/auth/local/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
            firstName: credentials?.firstName,
            lastName: credentials?.lastName,
            phoneNumber: credentials?.phoneNumber,
          })
        })

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { jwt: string, user: User };

        return { ...data.user, jwt: data.jwt, id: String(data.user.id)};
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.email = user.email
        token.username = user.username
        token.jwt = user.jwt
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string | null
        session.user.lastName = token.lastName as string | null
        session.user.email = token.email as string
        session.user.username = token.username as string
        session.jwt = token.jwt as string
      }
      return session
    }
  }
} 