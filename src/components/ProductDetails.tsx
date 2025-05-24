
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import ProductReviews from './ProductReviews';

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  marca?: string;
  estoque: number;
  tipo_pet?: string;
  imagens?: string[];
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const handleAddToFavorites = () => {
    toast({
      title: "Adicionado aos favoritos!",
      description: `${product.nome} foi adicionado aos seus favoritos.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar aos Produtos
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem do Produto */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-8xl">🐾</span>
            </div>
            {product.imagens && product.imagens.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imagens.slice(0, 4).map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🐾</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalhes do Produto */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{product.nome}</CardTitle>
                  {product.marca && (
                    <p className="text-gray-600 mt-1">Por {product.marca}</p>
                  )}
                </div>
                <Button variant="outline" size="icon" onClick={handleAddToFavorites}>
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{product.categoria}</Badge>
                {product.tipo_pet && (
                  <Badge variant="outline">
                    {product.tipo_pet === 'cao' ? 'Cão' : product.tipo_pet === 'gato' ? 'Gato' : 'Ambos'}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Preço */}
              <div>
                <span className="text-3xl font-bold text-green-600">
                  R$ {product.preco.toFixed(2)}
                </span>
              </div>

              {/* Avaliação (mock) */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) 124 avaliações</span>
              </div>

              {/* Descrição */}
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700">{product.descricao}</p>
              </div>

              {/* Estoque */}
              <div className={`text-sm font-semibold ${
                product.estoque > 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {product.estoque > 0 ? (
                  `✓ ${product.estoque} unidades em estoque`
                ) : (
                  '✗ Produto esgotado'
                )}
              </div>

              {/* Quantidade e Adicionar ao Carrinho */}
              {product.estoque > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantidade</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-16 text-center font-semibold text-lg">
                        {quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.estoque, quantity + 1))}
                        disabled={quantity >= product.estoque}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho - R$ {(product.preco * quantity).toFixed(2)}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Informações de Entrega</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>🚚</span>
                  <span>Entrega em 24h para Canabrava</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💳</span>
                  <span>Pix, cartão ou dinheiro na entrega</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔄</span>
                  <span>7 dias para trocar se não gostar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção de Reviews */}
      <ProductReviews 
        productId={product.id} 
        productName={product.nome}
      />
    </div>
  );
};

export default ProductDetails;
