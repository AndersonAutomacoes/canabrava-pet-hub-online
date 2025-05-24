
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import CheckoutFlow from '@/components/CheckoutFlow';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <PageLayout
        title="Login Necessário"
        subtitle="Para finalizar sua compra de forma segura"
        containerSize="sm"
      >
        <Card className="pet-card border-0 shadow-medium">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl text-gray-800">
              Acesso Restrito
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
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Finalizar Compra"
      subtitle="Ambiente seguro e protegido para finalizar seu pedido"
      breadcrumbs={[
        { label: 'Carrinho', href: '/carrinho' },
        { label: 'Checkout', current: true }
      ]}
      headerActions={
        <div className="flex items-center text-green-600">
          <ShieldCheck className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Compra Segura</span>
        </div>
      }
      containerSize="xl"
    >
      <CheckoutFlow />
    </PageLayout>
  );
};

export default Checkout;
