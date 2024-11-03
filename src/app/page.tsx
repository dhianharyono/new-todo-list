'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      router.push('/login');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <></>
  );
}
