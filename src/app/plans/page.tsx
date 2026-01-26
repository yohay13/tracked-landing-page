'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analytics, EVENTS } from '@/lib/analytics';
import { plans, addOns } from '@/lib/quiz-data';
import { useCart } from '@/context/CartContext';
import { track as weaverTrack } from '@weaver/sdk';

export default function PlansPage() {
  const router = useRouter();
  const { selectedPlan, setSelectedPlan, addItem, items } = useCart();

  useEffect(() => {
    analytics.pageView('Plans');
    analytics.track(EVENTS.PLANS_VIEWED, {
      plansCount: plans.length,
      addOnsCount: addOns.length,
    });
    weaverTrack(EVENTS.PLANS_VIEWED, {
      plansCount: plans.length,
      addOnsCount: addOns.length,
    });
  }, []);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleAddOn = (addOn: typeof addOns[0]) => {
    const alreadyInCart = items.some((item) => item.id === addOn.id);
    if (!alreadyInCart) {
      addItem({
        id: addOn.id,
        name: addOn.name,
        price: addOn.price,
      });
    }
  };

  const handleContinue = () => {
    if (!selectedPlan) return;

    const plan = plans.find((p) => p.id === selectedPlan);
    if (plan) {
      addItem({
        id: plan.id,
        name: `${plan.name} Plan`,
        price: plan.price,
      });
    }

    analytics.track(EVENTS.CHECKOUT_STARTED, {
      planId: selectedPlan,
      itemCount: items.length + 1,
    });
    weaverTrack(EVENTS.CHECKOUT_STARTED, {
      planId: selectedPlan,
      itemCount: items.length + 1,
    });

    router.push('/cart');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Home
          </button>
          <h1 className="text-xl font-bold text-gray-800">Choose Your Plan</h1>
          <button
            onClick={() => {
              analytics.track(EVENTS.CART_VIEWED, { source: 'nav' });
              weaverTrack(EVENTS.CART_VIEWED, { source: 'nav' });
              router.push('/cart');
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Cart ({items.length})
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Your Personalized Plan is Ready!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Choose the plan that best fits your goals
        </p>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`relative bg-white rounded-xl p-6 cursor-pointer transition border-2 ${
                selectedPlan === plan.id
                  ? 'border-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              } ${plan.recommended ? 'ring-2 ring-blue-400' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Boost Your Results with Add-ons
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {addOns.map((addOn) => {
            const inCart = items.some((item) => item.id === addOn.id);
            return (
              <div
                key={addOn.id}
                className={`bg-white rounded-lg p-4 border-2 transition ${
                  inCart ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                <h4 className="font-semibold text-gray-800">{addOn.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{addOn.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">${addOn.price}</span>
                  <button
                    onClick={() => handleAddOn(addOn)}
                    disabled={inCart}
                    className={`px-4 py-1 rounded text-sm transition ${
                      inCart
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {inCart ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedPlan}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
            selectedPlan
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Checkout
        </button>
      </div>
    </main>
  );
}
