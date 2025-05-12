'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/components/layout/AuthLayout';
import Link from 'next/link';
import { TextField } from '@/components/common/Fields';
import { Button } from '@/components/Button';

export default function SignUpPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate the input
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    // Send the request to your sign-up API route
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();
    setIsLoading(false);
    if (res.ok) {
      toast.success('Account created successfully!');
      router.push('/auth/login');
    } else {
      toast.error(data.message || 'Error creating account');
    }
  };

  return (
    <AuthLayout
      title="Sign up to account"
      subtitle={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="text-cyan-600">
            Login
          </Link>{' '}
          for a better experience.
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <TextField
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            autoComplete="name"
            required
          />
          <TextField
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="Email address"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="Password"
            required
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-cyan-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <button
          disabled={isLoading}
          type="submit" color="cyan" className="cursor-pointer mt-8 w-full bg-black text-white py-2 rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-medium">
          {isLoading ? "Loading..." : "Create Account"}
        </button>
      </form>
      <div className="mt-10">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center"
          >
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm/6 font-medium">
            <span className="bg-white px-6 text-gray-900">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <a
            href="#"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            <span className="text-sm/6 font-semibold">Google</span>
          </a>
        </div>
      </div>
    </AuthLayout>


  );
}
