export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is your primary goal?',
    options: ['Lose weight', 'Build muscle', 'Improve fitness', 'Better health'],
  },
  {
    id: 2,
    question: 'How often do you exercise?',
    options: ['Never', '1-2 times/week', '3-4 times/week', 'Daily'],
  },
  {
    id: 3,
    question: 'What is your experience level?',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
  },
];

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'month',
    features: ['5 workouts/week', 'Basic analytics', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    period: 'month',
    features: ['Unlimited workouts', 'Advanced analytics', 'Priority support', 'Custom plans'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    period: 'month',
    features: ['Everything in Pro', 'Team management', 'API access', 'Dedicated support'],
  },
];

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const addOns: AddOn[] = [
  { id: 'nutrition', name: 'Nutrition Guide', price: 4.99, description: 'Personalized meal plans' },
  { id: 'coaching', name: '1-on-1 Coaching', price: 29.99, description: 'Weekly video calls' },
  { id: 'gear', name: 'Starter Gear Kit', price: 79.99, description: 'Resistance bands & mat' },
];
