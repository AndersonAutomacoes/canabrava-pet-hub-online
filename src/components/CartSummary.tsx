
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const CartSummary = () => {
  const { 
    cartItems, 
    loading, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItemCount 
  } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Carrinho vazio
          </h3>
          <p className="text-gray-500">
            Adicione produtos ao seu carrinho para continuar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Carrinho ({getCartItemCount()} itens)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold">{item.produto.nome}</h4>
                <p className="text-green-600 font-bold">
                  R$ {item.produto.preco.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <span className="w-8 text-center font-semibold">
                  {item.quantidade}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              R$ {getCartTotal().toFixed(2)}
            </span>
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            onClick={() => window.location.href = '/checkout'}
          >
            Finalizar Compra
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartSummary;
