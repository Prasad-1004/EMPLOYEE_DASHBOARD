'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/validators/auth';
import { loginUser } from '@/actions/auth-actions';
import { z } from 'zod';

type FormData = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const res = await loginUser(data);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
      {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password')}
          type="password"
          className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Sign In'}
      </button>
    </form>
  );
}