
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutFlow from '@/components/CheckoutFlow';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Checkout = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login Necessário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Para finalizar sua compra, você precisa estar logado.</p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={() => window.location.href = '/auth'}
              >
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Finalizar Compra
        </h1>
        
        <CheckoutFlow />
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
