
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutFlow from '@/components/CheckoutFlow';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen pet-gradient-bg">
        <Header />
        <div className="pet-container py-12">
          <div className="max-w-md mx-auto">
            <Card className="pet-card border-0 shadow-medium">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">
                  Login Necessário
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Para finalizar sua compra de forma segura, você precisa estar logado em sua conta.
                </p>
                <Button 
                  className="w-full pet-button-primary h-12 text-base"
                  onClick={() => window.location.href = '/auth'}
                >
                  Fazer Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pet-gradient-bg">
      <Header />
      
      <main className="pet-container py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 gradient-text">
                Finalizar Compra
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Ambiente seguro e protegido para finalizar seu pedido
            </p>
          </div>
          
          <CheckoutFlow />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
