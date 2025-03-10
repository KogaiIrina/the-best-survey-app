import React from 'react';

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    description: string;
    inputType: string;
    options: string | null;
  }
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionCard({ question, value, onChange }: QuestionCardProps) {

  const options = question.options ? JSON.parse(question.options) : [];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">{question.title}</h2>
      {question.description && (
        <p className="text-sm text-gray-600 mb-4">{question.description}</p>
      )}
      {question.inputType === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      )}
      {question.inputType === 'select' && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          >
            {options.map((option: { label: string; value: string }) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
      )}
    </div>
  )
}



