'use client';

import { Input } from '@/components/Input';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('strapi-sign-in', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h3 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome Back
          </h3>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your credentials to access your account.
          </p>
          
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="john@company.com"
                className="mt-2"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                className="mt-2"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full whitespace-nowrap rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Forgot your password?{' '}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Reset password
            </a>
          </p>
          
          <p className="mt-7 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}