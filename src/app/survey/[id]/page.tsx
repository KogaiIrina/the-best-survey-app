'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Survey {
  id: number;
  responses: {
    id: number;
    answer: string;
    question: {
      id: number;
      title: string;
      description: string;
    }
  }[]
}

export default function SurveyResponsePage() {
  const params = useParams();
  const surveyId = params.id as string;
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${surveyId}`);

        if(!response.ok) {
          throw new Error('Failed to fetch survey');
        }

        const data = await response.json();
        setSurvey(data);
      } catch (err) {
        setError(`Error fetching survey: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) {
      fetchSurvey();
    }
  }, [surveyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !survey) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-500"> {error || 'Survey is not found'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Survey Responses</h2>
      <div className="space-y-4">
        {survey.responses.map((response) => (
          <div key={response.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{response.question.title}</h3>
            {response.question.description && (
              <p className="text-gray-600 mb-2">{response.question.description  }</p>
            )}
            <p className="text-gray-600">{response.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
  
}
