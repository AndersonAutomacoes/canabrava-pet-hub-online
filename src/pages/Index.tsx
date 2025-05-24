
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import About from '../components/About';
import Blog from '../components/Blog';
import { QuickActions } from '@/components/navigation/QuickActions';

const Index = () => {
  return (
    <PageLayout containerSize="full" className="py-0">
      <Hero />
      
      {/* Seção de Ações Rápidas */}
      <section className="py-12 bg-white/50">
        <div className="pet-container">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              Como podemos ajudar você hoje?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Escolha uma das opções abaixo para começar a cuidar ainda melhor do seu pet
            </p>
          </div>
          <QuickActions />
        </div>
      </section>
      
      <Services />
      <Products />
      <About />
      <Blog />
    </PageLayout>
  );
};

export default Index;
