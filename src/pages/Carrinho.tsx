
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSummary from '@/components/CartSummary';

const Carrinho = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Meu Carrinho
        </h1>
        
        <CartSummary />
      </main>
      
      <Footer />
    </div>
  );
};

export default Carrinho;
