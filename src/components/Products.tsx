
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Filter, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'Todos', icon: '🛍️' },
    { id: 'food', name: 'Ração', icon: '🥘' },
    { id: 'toys', name: 'Brinquedos', icon: '🎾' },
    { id: 'accessories', name: 'Acessórios', icon: '🎽' },
    { id: 'hygiene', name: 'Higiene', icon: '🧴' }
  ];

  const products = [
    {
      id: 1,
      name: 'Ração Premium Royal Canin',
      category: 'food',
      price: 89.90,
      originalPrice: 99.90,
      image: '🥘',
      rating: 4.8,
      reviews: 124,
      description: 'Ração premium para cães adultos de raças médias',
      badge: 'Mais Vendido',
      inStock: true
    },
    {
      id: 2,
      name: 'Bola de Tênis Kong',
      category: 'toys',
      price: 24.90,
      image: '🎾',
      rating: 4.7,
      reviews: 89,
      description: 'Bola resistente para exercícios e diversão',
      badge: 'Novo',
      inStock: true
    },
    {
      id: 3,
      name: 'Coleira Ajustável Premium',
      category: 'accessories',
      price: 34.90,
      image: '🎽',
      rating: 4.6,
      reviews: 67,
      description: 'Coleira confortável e resistente',
      inStock: true
    },
    {
      id: 4,
      name: 'Shampoo Neutro Pet',
      category: 'hygiene',
      price: 19.90,
      image: '🧴',
      rating: 4.5,
      reviews: 156,
      description: 'Shampoo suave para todos os tipos de pelo',
      inStock: true
    },
    {
      id: 5,
      name: 'Ração Cat Chow Gatos',
      category: 'food',
      price: 45.90,
      originalPrice: 52.90,
      image: '🐱',
      rating: 4.7,
      reviews: 93,
      description: 'Ração balanceada para gatos adultos',
      badge: 'Promoção',
      inStock: true
    },
    {
      id: 6,
      name: 'Corda com Nós Resistente',
      category: 'toys',
      price: 16.90,
      image: '🪢',
      rating: 4.4,
      reviews: 78,
      description: 'Brinquedo de corda para mastigação',
      inStock: false
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product) => {
    if (!product.inStock) {
      toast({
        title: "Produto indisponível",
        description: "Este produto está temporariamente fora de estoque.",
        variant: "destructive",
      });
      return;
    }

    setCart([...cart, product]);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <section id="products" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Produtos para seu Pet
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre tudo que seu pet precisa em nossa loja online. 
            Produtos de qualidade, preços especiais e entrega rápida.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 ${
                selectedCategory === category.id 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'hover:bg-green-50 hover:text-green-600 text-gray-700 border-gray-300'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardHeader className="text-center pb-4 relative">
                {product.badge && (
                  <Badge 
                    className={`absolute top-4 right-4 text-white font-semibold ${
                      product.badge === 'Mais Vendido' ? 'bg-blue-600 hover:bg-blue-700' :
                      product.badge === 'Novo' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {product.badge}
                  </Badge>
                )}
                <div className="text-6xl mb-4">{product.image}</div>
                <CardTitle className="text-lg mb-2 text-gray-800">{product.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-green-600 font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
                      <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ({product.reviews} avaliações)
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm font-semibold ${
                  product.inStock ? 'text-green-600' : 'text-red-500'
                }`}>
                  {product.inStock ? '✓ Em estoque' : '✗ Fora de estoque'}
                </div>
              </CardContent>
              <CardFooter className="space-y-3">
                <div className="flex w-full space-x-2">
                  <Button 
                    className={`flex-1 ${
                      product.inStock 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-400 cursor-not-allowed text-white'
                    }`}
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Adicionar' : 'Indisponível'}
                  </Button>
                  <Button variant="outline" size="icon" className="hover:text-red-500 border-gray-300">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Shopping cart info */}
        {cart.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
            </h3>
            <p className="text-green-700 mb-4">
              Total: R$ {cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Finalizar Compra
            </Button>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="font-semibold text-gray-800 mb-2">Entrega Rápida</h3>
            <p className="text-gray-600 text-sm">Entrega em 24h para a região de Canabrava</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">💳</div>
            <h3 className="font-semibold text-gray-800 mb-2">Pagamento Fácil</h3>
            <p className="text-gray-600 text-sm">Pix, cartão ou dinheiro na entrega</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-800 mb-2">Troca Garantida</h3>
            <p className="text-gray-600 text-sm">7 dias para trocar se não gostar</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
