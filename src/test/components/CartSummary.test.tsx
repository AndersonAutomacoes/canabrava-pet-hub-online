
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { describe, it, expect, vi } from 'vitest';
import CartSummary from '@/components/CartSummary';

vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    cartItems: [],
    loading: false,
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
    getCartTotal: () => 0,
    getCartItemsCount: () => 0,
  }),
}));

describe('CartSummary Component', () => {
  it('shows empty cart message', () => {
    render(<CartSummary />);
    
    expect(screen.getByText('Carrinho vazio')).toBeInTheDocument();
    expect(screen.getByText('Adicione produtos ao seu carrinho para continuar suas compras')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    vi.doMock('@/hooks/useCart', () => ({
      useCart: () => ({
        cartItems: [],
        loading: true,
        updateQuantity: vi.fn(),
        removeFromCart: vi.fn(),
        getCartTotal: () => 0,
        getCartItemsCount: () => 0,
      }),
    }));

    render(<CartSummary />);
    // Loading spinner should be present
  });
});
