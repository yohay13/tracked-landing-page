'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analytics, EVENTS } from '@/lib/analytics';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    analytics.pageView('Landing');
    analytics.track(EVENTS.LANDING_PAGE_VIEWED, {
      source: 'direct',
    });
  }, []);

  const handleStartQuiz = () => {
    analytics.track(EVENTS.CTA_CLICKED, {
      buttonText: 'Start Your Journey',
      location: 'hero',
    });
    analytics.track(EVENTS.QUIZ_STARTED, {
      source: 'landing_page',
    });
    router.push('/quiz/1');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      <nav className="flex justify-between items-center p-6 text-white">
        <h1 className="text-2xl font-bold">FitPro</h1>
        <button
          onClick={() => {
            analytics.track(EVENTS.BUTTON_CLICKED, {
              buttonText: 'View Plans',
              location: 'nav',
            });
            router.push('/plans');
          }}
          className="px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-900 transition"
        >
          View Plans
        </button>
      </nav>

      <section className="flex flex-col items-center justify-center text-center text-white px-4 py-20">
        <h2 className="text-5xl font-bold mb-6">
          Transform Your Body,<br />Transform Your Life
        </h2>
        <p className="text-xl mb-8 max-w-2xl opacity-90">
          Take our quick 3-question quiz to get a personalized fitness plan
          tailored to your goals and experience level.
        </p>
        <button
          onClick={handleStartQuiz}
          className="bg-white text-blue-900 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-100 transition shadow-lg"
        >
          Start Your Journey →
        </button>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose FitPro?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Personalized Plans', desc: 'Custom workouts based on your goals' },
              { title: 'Expert Guidance', desc: 'Designed by certified trainers' },
              { title: 'Track Progress', desc: 'See your improvements over time' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-lg bg-gray-50"
                onClick={() => {
                  analytics.track(EVENTS.BUTTON_CLICKED, {
                    buttonText: item.title,
                    location: 'features',
                  });
                }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 text-xl font-bold">
                  {i + 1}
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
        <p className="mb-8 opacity-90">Join thousands who have already transformed their lives</p>
        <button
          onClick={handleStartQuiz}
          className="bg-white text-blue-900 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-100 transition"
        >
          Take the Quiz
        </button>
      </section>
    </main>
  );
}
