import { LoginForm } from '@/components/forms/login-form';
import Link from 'next/link';

// এখানে 'export default' থাকাটা বাধ্যতামূলক
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account? <Link href="/signup" className="text-blue-600 underline">Sign Up</Link>
      </p>
    </div>
  );
}