'use client';

import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('strapi-sign-up', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        redirect: false,
      });

      if (result?.error) {
        setError('Registration failed. Please check your information and try again.');
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
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create new account
          </h3>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Fill in your information to get started.
          </p>
          
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
        
        <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <Input
                type="text"
                id="firstName"
                autoComplete="given-name"
                placeholder="First Name"
                className="mt-2"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            
            <div>
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <Input
                type="text"
                id="lastName"
                autoComplete="family-name"
                placeholder="Last Name"
                className="mt-2"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            
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
                autoComplete="email"
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
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                autoComplete="tel"
                placeholder="+1 (555) 123-4567"
                className="mt-2"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phoneNumber.message}
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
                autoComplete="new-password"
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
            
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm Password"
                className="mt-2"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full whitespace-nowrap rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </Card>
        
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/sign-in"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}