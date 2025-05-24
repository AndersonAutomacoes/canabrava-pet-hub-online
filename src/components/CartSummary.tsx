
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2, Package, Truck } from 'lucide-react';
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
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card className="pet-card border-0 shadow-medium max-w-lg mx-auto">
        <CardContent className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Carrinho vazio
          </h3>
          <p className="text-gray-500 mb-6">
            Adicione produtos ao seu carrinho para continuar suas compras
          </p>
          <Button 
            className="pet-button-primary"
            onClick={() => window.location.href = '/produtos'}
          >
            <Package className="w-4 h-4 mr-2" />
            Ver Produtos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Items do carrinho */}
      <Card className="pet-card border-0 shadow-medium">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span>Carrinho ({getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'itens'})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🐾</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 mb-1 truncate">
                    {item.produto.nome}
                  </h4>
                  <p className="text-green-600 font-bold text-lg">
                    R$ {item.produto.preco.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-white rounded-lg p-2 shadow-sm">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                    disabled={item.quantidade <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  
                  <span className="w-8 text-center font-semibold text-gray-800">
                    {item.quantidade}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                    onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800 mb-2">
                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo do pedido */}
      <Card className="pet-card border-0 shadow-medium">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">
                R$ {getCartTotal().toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Frete:</span>
              <span className="font-semibold text-green-600">Grátis</span>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="flex justify-between items-center text-xl">
              <span className="font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold gradient-text">
                R$ {getCartTotal().toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full pet-button-primary h-12 text-base"
              onClick={() => window.location.href = '/checkout'}
            >
              <Truck className="w-5 h-5 mr-2" />
              Finalizar Compra
            </Button>
            
            <Button 
              variant="outline"
              className="w-full pet-button-secondary h-12 text-base"
              onClick={() => window.location.href = '/produtos'}
            >
              Continuar Comprando
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações de entrega */}
      <Card className="pet-card border-0 shadow-soft bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Entrega Rápida e Segura
              </h3>
              <p className="text-gray-600 text-sm">
                Entrega grátis para Canabrava • Produtos garantidos • Suporte dedicado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartSummary;
