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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({...prev, [questionId]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (loading || !questions.length) {
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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
        <p className="text-center text-gray-600">Loading survey questions...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
        <p className="text-center text-gray-600">No questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;


  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full" style={{width: `${progress}%`}}></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          value={responses[currentQuestion?.id] || ''}
          onChange={(value) => handleResponseChange(currentQuestion?.id, value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        {
          currentQuestionIndex === questions.length -1 ? (
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="py-2 px-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          )
        }
      </div>
    </form>
  )
  
  
}
