import SignUp from '@/components/ui/auth/SignUp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Create an Account',
  description: 'Create an account to access the dashboard',
};

export default function SignUpPage() {
  return <SignUp />;
}