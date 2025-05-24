import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ShoppingCart, User, Heart, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useAdmin } from '@/hooks/useAdmin';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { getCartItemsCount } = useCart();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const cartItemCount = getCartItemsCount();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🐾</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PetShop</h1>
              <p className="text-xs text-gray-600">Canabrava</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Início
            </Link>
            <Link to="/produtos" className="text-gray-700 hover:text-green-600 transition-colors">
              Produtos
            </Link>
            <Link to="/agendamento" className="text-gray-700 hover:text-green-600 transition-colors">
              Agendamento
            </Link>
            {user && isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {user && (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="w-5 h-5" />
                </Button>
                <Link to="/carrinho">
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAuthAction}
              className="flex items-center space-x-1"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {user ? 'Sair' : 'Entrar'}
              </span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/produtos"
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link
                to="/agendamento"
                className="text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Agendamento
              </Link>
              {user && isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Painel Admin</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
