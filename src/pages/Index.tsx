
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import About from '../components/About';
import Blog from '../components/Blog';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen pet-gradient-bg">
      <Header />
      <Hero />
      <Services />
      <Products />
      <About />
      <Blog />
      <Footer />
    </div>
  );
};

export default Index;
