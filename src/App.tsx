
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Produtos from './pages/Produtos';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Agendamento from './pages/Agendamento';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Admin from './pages/Admin';
import CadastroPet from './pages/CadastroPet';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PaymentSuccess from './pages/PaymentSuccess';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/cadastro-pet" element={<CadastroPet />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
