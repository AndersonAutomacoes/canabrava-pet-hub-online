
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock hooks
vi.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    getCartItemsCount: () => 2,
  }),
}));

vi.mock('@/hooks/useAdmin', () => ({
  useAdmin: () => ({
    isAdmin: false,
  }),
}));

const MockedHeader = () => (
  <AuthProvider>
    <Header />
  </AuthProvider>
);

describe('Header Component', () => {
  it('renders logo and navigation', () => {
    render(<MockedHeader />);
    
    expect(screen.getByText('PetShop')).toBeInTheDocument();
    expect(screen.getByText('Canabrava')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByText('Agendamento')).toBeInTheDocument();
  });

  it('shows cart count badge', () => {
    render(<MockedHeader />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<MockedHeader />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Should show mobile navigation
    const mobileNav = screen.getAllByText('Início');
    expect(mobileNav.length).toBeGreaterThan(1);
  });
});
