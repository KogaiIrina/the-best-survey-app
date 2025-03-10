'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SurveyForm from './components/SurveyForm';
import LoginPrompt from './components/LoginPrompt';
import Link from 'next/link';

type Survey = {
  id: number;
  userId: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  responses: Response[];
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userSurvey, setUserSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setLoading(true);
      fetch(`/api/surveys?userId=${session.user.id}`)
      .then(res => {
        if(!res.ok) {
          throw new Error('Failed to fetch surveys');
        }
        return res.json();
      })
      .then(data => {
        setUserSurvey(data ? data : null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching surveys:', err);
        setLoading(false);
      });
    }
  }, [status, session]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (status === 'unauthenticated') {
    return <LoginPrompt />;
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {!userSurvey ? "Create a new survey" : "Your Survey"}
          </h1>
          <button
            onClick={() => router.push("api/auth/signout")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">Loading your survey data...</p>
          </div>
        ) : userSurvey ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Your Survey Responses</h2>
            <div className="border-t border-gray-200 pt-4">
              <p className="mb-2">Survey #{userSurvey.id}</p>
              <p className="mb-4 text-gray-600">Created on: {new Date(userSurvey.createdAt).toLocaleDateString()}</p>
              <Link 
                href={`/survey/${userSurvey.id}`}
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                View Responses
              </Link>
            </div>
          </div>
        ) : (
          // Show survey form for authenticated users who haven't completed a survey
          <SurveyForm userId={parseInt(session?.user?.id || '0')} />
        )}
      </div>
    </main>
  )
}
