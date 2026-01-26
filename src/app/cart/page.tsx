'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analytics, EVENTS } from '@/lib/analytics';
import { initWeaver, track as weaverTrack, identify as weaverIdentify, page as weaverPage } from '@weaver/sdk';
import { useCart } from '@/context/CartContext';

const weaver = initWeaver({ apiKey: 'wvr_test_api_key_12345' });

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    analytics.pageView('Cart');
    analytics.track(EVENTS.CART_VIEWED, {
      itemCount: items.length,
      cartTotal: total,
      source: 'direct',
    });
    weaverPage('Cart');
    weaverTrack(EVENTS.CART_VIEWED, {
      itemCount: items.length,
      cartTotal: total,
      source: 'direct',
    });
  }, [items.length, total]);

  const handleCheckout = async () => {
    setIsProcessing(true);

    analytics.track(EVENTS.CHECKOUT_STARTED, {
      itemCount: items.length,
      cartTotal: total,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity })),
    });
    weaverTrack(EVENTS.CHECKOUT_STARTED, {
      itemCount: items.length,
      cartTotal: total,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity })),
    });

    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    analytics.track(EVENTS.CHECKOUT_COMPLETED, {
      orderId: `order_${Date.now()}`,
      itemCount: items.length,
      orderTotal: total,
      items: items.map((i) => i.id),
    });
    weaverTrack(EVENTS.CHECKOUT_COMPLETED, {
      orderId: `order_${Date.now()}`,
      itemCount: items.length,
      orderTotal: total,
      items: items.map((i) => i.id),
    });

    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Complete!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Check your email for confirmation.
          </p>
          <button
            onClick={() => {
              analytics.track(EVENTS.BUTTON_CLICKED, {
                buttonText: 'Back to Home',
                location: 'order_complete',
              });
              weaverTrack(EVENTS.BUTTON_CLICKED, {
                buttonText: 'Back to Home',
                location: 'order_complete',
              });
              router.push('/');
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push('/plans')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Plans
          </button>
          <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>
          <div className="w-24" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/plans')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Browse Plans
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold text-gray-800">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-gray-800">
                  ${(total * 1.1).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                  isProcessing
                    ? 'bg-gray-400 cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
