'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { analytics, EVENTS } from '@/lib/analytics';
import { track as weaverTrack } from '@weaver/sdk';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  selectedPlan: string | null;
  quizAnswers: Record<number, string>;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setSelectedPlan: (planId: string) => void;
  setQuizAnswer: (step: number, answer: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedPlan, setSelectedPlanState] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    analytics.track(EVENTS.ITEM_ADDED_TO_CART, {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
    });
    weaverTrack(EVENTS.ITEM_ADDED_TO_CART, {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
    });
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (item) {
      analytics.track(EVENTS.ITEM_REMOVED_FROM_CART, {
        itemId: id,
        itemName: item.name,
      });
      weaverTrack(EVENTS.ITEM_REMOVED_FROM_CART, {
        itemId: id,
        itemName: item.name,
      });
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );

    analytics.track(EVENTS.CART_UPDATED, {
      itemId: id,
      newQuantity: quantity,
    });
    weaverTrack(EVENTS.CART_UPDATED, {
      itemId: id,
      newQuantity: quantity,
    });
  };

  const setSelectedPlan = (planId: string) => {
    const previousPlan = selectedPlan;
    setSelectedPlanState(planId);

    if (previousPlan) {
      analytics.track(EVENTS.PLAN_CHANGED, {
        previousPlan,
        newPlan: planId,
      });
      weaverTrack(EVENTS.PLAN_CHANGED, {
        previousPlan,
        newPlan: planId,
      });
    } else {
      analytics.track(EVENTS.PLAN_SELECTED, {
        planId,
      });
      weaverTrack(EVENTS.PLAN_SELECTED, {
        planId,
      });
    }
  };

  const setQuizAnswer = (step: number, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [step]: answer }));

    analytics.track(EVENTS.QUIZ_ANSWER_SELECTED, {
      step,
      answer,
    });
    weaverTrack(EVENTS.QUIZ_ANSWER_SELECTED, {
      step,
      answer,
    });
  };

  const clearCart = () => {
    setItems([]);
    setSelectedPlanState(null);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedPlan,
        quizAnswers,
        addItem,
        removeItem,
        updateQuantity,
        setSelectedPlan,
        setQuizAnswer,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
