import SignIn from '@/components/ui/auth/SignIn';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Welcome Back',
  description: 'Sign in to your account to access the dashboard',
};

export default function SignInPage() {
  return (
    <SignIn />
  );
}