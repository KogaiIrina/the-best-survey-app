'use client'

import { useRouter } from 'next/navigation';
import React from 'react';

const LoginPrompt: React.FC = () => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Welcome to the Survey App
      </h2>
      <p className="mb-6 text-gray-700">
        Please log in to create or view your survey responses.
      </p>
      <button
        onClick={() => router.push('/login')}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Log In
      </button>
    </div>
  );
};

export default LoginPrompt; 
