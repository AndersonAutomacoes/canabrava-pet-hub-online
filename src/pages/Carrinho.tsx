
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSummary from '@/components/CartSummary';

const Carrinho = () => {
  return (
    <div className="min-h-screen pet-gradient-bg">
      <Header />
      
      <main className="pet-container py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 gradient-text">
              Meu Carrinho
            </h1>
            <p className="text-gray-600 text-lg">
              Revise seus itens antes de finalizar a compra
            </p>
          </div>
          
          <CartSummary />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Carrinho;
