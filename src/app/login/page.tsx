'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Lead' | 'Team' | ''>('');
  const router = useRouter();

  const handleLogin = () => {
    if (
      (username === 'lead' && password === '123' && role === 'Lead') ||
      (username === 'bob' && password === '123' && role === 'Team') ||
      (username === 'alice' && password === '123' && role === 'Team')
    ) {
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username)
      router.push('/dashboard');
    } else {
      alert('Username, password, atau role salah.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-900">
      <div className="w-full max-w-md p-6 space-y-6 bg-gray-800 rounded-lg shadow-md animate-fadeIn sm:p-8">
        <h2 className="text-xl font-bold text-center text-gray-300 sm:text-2xl">Login</h2>
        <div>
          <label className="block text-gray-500">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-500">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-500">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'Lead' | 'Team')}
            className="w-full px-3 py-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white-900"
          >
            <option value="">Pilih Role</option>
            <option value="Lead">Lead</option>
            <option value="Team">Team</option>
          </select>
        </div>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}
