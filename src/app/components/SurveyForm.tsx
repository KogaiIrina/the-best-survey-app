'use client'

import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

type Question = {
  id: number;
  title: string;
  description: string;
  inputType: string;
  options: string | null;
}


export default function SurveyForm() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [surveyId, setSurveyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('api/questions');
        const data = await response.json();
        setQuestions(data)
        const initialResponses: {[key: number]: string} = {};
        data.forEach((question: Question) => {
          initialResponses[question.id] = '';
        });
        setResponses(initialResponses);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);




  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({...prev, [questionId]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (loading) {
      return <div>Loading...</div>
    }

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer,
      }));

      const response = await fetch('api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: formattedResponses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      const data = await response.json();
      setSurveyId(data.id);
      setSubmitted(true);

    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted && surveyId) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Thank you for your feedback!
        </h2>
        <p className="mb-4">Your responses have been recorded</p>
        <a href={`/survey/${surveyId}`} className="text-blue-500 hover:text-blue-600">
          View your responses
        </a>
      </div>
    )
  }


  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={responses[question.id] || ''}
          onChange={(value) => handleResponseChange(question.id, value)}
        />
      ))}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
  
  
}
