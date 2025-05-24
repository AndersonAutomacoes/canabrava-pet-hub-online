
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCart } from '@/hooks/useCart';
import { AuthProvider } from '@/contexts/AuthContext';

const wrapper = ({ children }: any) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useCart Hook', () => {
  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getCartItemsCount()).toBe(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('calculates cart total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    // Mock cart items
    result.current.cartItems = [
      {
        id: '1',
        produto_id: '1',
        quantidade: 2,
        produto: { nome: 'Test', preco: 10, imagens: [] }
      }
    ];
    
    expect(result.current.getCartTotal()).toBe(20);
  });
});
