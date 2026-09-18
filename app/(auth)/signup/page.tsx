import { SignupForm } from '@/components/forms/signup-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <SignupForm />
      <p className="mt-4 text-sm text-gray-600">
        Already registered? <Link href="/login" className="text-blue-600 underline">Sign In</Link>
      </p>
    </div>
  );
}