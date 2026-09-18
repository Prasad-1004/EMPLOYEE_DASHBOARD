'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema } from '@/lib/validators/auth';
import { signupUser } from '@/actions/auth-actions';
import { z } from 'zod';

type FormData = z.infer<typeof SignupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const res = await signupUser(data);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/employee/attendance');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Employee Account</h2>
      {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register('name')}
          type="text"
          className="mt-1 block w-full p-2 border rounded-md"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full p-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password')}
          type="password"
          className="mt-1 block w-full p-2 border rounded-md"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </button>
    </form>
  );
}