
import React, { useState } from 'react';
import { Menu, X, Phone, MapPin, ShoppingCart, User, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-green-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Rua das Flores, 123 - Canabrava</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span>Seg-Sex: 8h-18h | Sáb: 8h-16h</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🐾</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">PetShop Canabrava</h1>
              <p className="text-sm text-gray-600">Cuidando do seu melhor amigo</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">Início</a>
            <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">Serviços</a>
            <a href="/produtos" className="text-gray-700 hover:text-green-600 transition-colors">Produtos</a>
            <a href="#blog" className="text-gray-700 hover:text-green-600 transition-colors">Blog</a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">Sobre</a>
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1"
              onClick={() => navigate('/agendamento')}
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <ShoppingCart className="w-4 h-4" />
              <span>Carrinho</span>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Minha Conta</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <User className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/meus-agendamentos')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Meus Agendamentos
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Meus Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={() => navigate('/auth')}
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <nav className="flex flex-col space-y-3">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">Início</a>
              <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">Serviços</a>
              <a href="/produtos" className="text-gray-700 hover:text-green-600 transition-colors">Produtos</a>
              <a href="#blog" className="text-gray-700 hover:text-green-600 transition-colors">Blog</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">Sobre</a>
              
              <div className="flex flex-col space-y-2 pt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center justify-center space-x-1"
                  onClick={() => navigate('/agendamento')}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar</span>
                </Button>
                
                <Button variant="outline" size="sm" className="flex items-center justify-center space-x-1">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Carrinho</span>
                </Button>

                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center space-x-1"
                      onClick={() => navigate('/perfil')}
                    >
                      <User className="w-4 h-4" />
                      <span>Meu Perfil</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center space-x-1"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center justify-center space-x-1"
                    onClick={() => navigate('/auth')}
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
