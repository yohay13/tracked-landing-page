'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { analytics, EVENTS } from '@/lib/analytics';
import { quizQuestions } from '@/lib/quiz-data';
import { useCart } from '@/context/CartContext';
import { track as weaverTrack } from '@weaver/sdk';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string);
  const { quizAnswers, setQuizAnswer } = useCart();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = quizQuestions.find((q) => q.id === step);
  const totalSteps = quizQuestions.length;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (!question) {
      router.push('/quiz/1');
      return;
    }

    analytics.pageView(`Quiz Step ${step}`);
    analytics.track(EVENTS.QUIZ_STEP_VIEWED, {
      step,
      totalSteps,
      question: question.question,
    });
    weaverTrack(EVENTS.QUIZ_STEP_VIEWED, {
      step,
      totalSteps,
      question: question.question,
    });

    // Restore previous answer if exists
    if (quizAnswers[step]) {
      setSelectedOption(quizAnswers[step]);
    }
  }, [step, question, totalSteps, quizAnswers, router]);

  if (!question) {
    return null;
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setQuizAnswer(step, option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    analytics.track(EVENTS.QUIZ_STEP_COMPLETED, {
      step,
      answer: selectedOption,
    });
    weaverTrack(EVENTS.QUIZ_STEP_COMPLETED, {
      step,
      answer: selectedOption,
    });

    if (step < totalSteps) {
      router.push(`/quiz/${step + 1}`);
    } else {
      analytics.track(EVENTS.QUIZ_COMPLETED, {
        answers: quizAnswers,
        totalSteps,
      });
      weaverTrack(EVENTS.QUIZ_COMPLETED, {
        answers: quizAnswers,
        totalSteps,
      });
      router.push('/plans');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/quiz/${step - 1}`);
    } else {
      analytics.track(EVENTS.QUIZ_ABANDONED, {
        abandonedAtStep: step,
      });
      weaverTrack(EVENTS.QUIZ_ABANDONED, {
        abandonedAtStep: step,
      });
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <span className="text-gray-500">
            Step {step} of {totalSteps}
          </span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  selectedOption === option
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-blue-300 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className={`w-full mt-8 py-4 rounded-lg font-semibold transition ${
              selectedOption
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step < totalSteps ? 'Continue' : 'See My Personalized Plan'}
          </button>
        </div>
      </div>
    </main>
  );
}
