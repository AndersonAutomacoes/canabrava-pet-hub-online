
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import CartSummary from '@/components/CartSummary';

const Carrinho = () => {
  return (
    <PageLayout
      title="Meu Carrinho"
      subtitle="Revise seus itens antes de finalizar a compra"
      breadcrumbs={[
        { label: 'Carrinho', current: true }
      ]}
      containerSize="lg"
    >
      <CartSummary />
    </PageLayout>
  );
};

export default Carrinho;
