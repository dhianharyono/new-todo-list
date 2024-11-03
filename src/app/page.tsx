'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        Go to Dashboard
      </Link>
    </div>
  );
}
