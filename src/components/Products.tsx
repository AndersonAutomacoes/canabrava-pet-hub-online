
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Filter, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
  ativo: boolean;
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Buscando produtos do banco de dados...');
      
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }

      console.log('Produtos carregados:', data);
      setProducts(data || []);
      
      // Extrair categorias únicas dos produtos
      const uniqueCategories = [...new Set(data?.map(p => p.categoria) || [])];
      const categoryList = [
        { id: 'all', name: 'Todos', icon: '🛍️' },
        ...uniqueCategories.map(cat => ({
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          icon: getCategoryIcon(cat)
        }))
      ];
      setCategories(categoryList);
      
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'racao': '🥘',
      'brinquedos': '🎾',
      'acessorios': '🎽',
      'higiene': '🧴',
      'medicina': '💊'
    };
    return icons[category] || '🐾';
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.categoria === selectedCategory);

  const handleAddToCart = async (product: Product) => {
    if (product.estoque <= 0) {
      toast({
        title: "Produto indisponível",
        description: "Este produto está temporariamente fora de estoque.",
        variant: "destructive",
      });
      return;
    }

    console.log('Adicionando produto ao carrinho:', product.id);
    await addToCart(product.id, 1);
  };

  const handleToggleFavorite = async (product: Product) => {
    console.log('Adicionando/removendo produto dos favoritos:', product.id);
    await toggleFavorite(product.id);
  };

  const handleViewAllProducts = () => {
    navigate('/produtos');
  };

  if (loading) {
    return (
      <section id="products" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Produtos para seu Pet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carregando nossos produtos...
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

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
          {filteredProducts.slice(0, 6).map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardHeader className="text-center pb-4 relative">
                <div className="text-6xl mb-4">
                  {product.imagens && product.imagens[0] ? (
                    <img src={product.imagens[0]} alt={product.nome} className="w-16 h-16 mx-auto object-cover rounded" />
                  ) : (
                    getCategoryIcon(product.categoria)
                  )}
                </div>
                <CardTitle className="text-lg mb-2 text-gray-800">{product.nome}</CardTitle>
                <CardDescription className="text-gray-600">
                  {product.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {product.preco.toFixed(2)}
                      </span>
                      {product.marca && (
                        <span className="text-sm text-gray-500">{product.marca}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{product.categoria}</Badge>
                  </div>
                </div>
                
                <div className={`text-sm font-semibold ${
                  product.estoque > 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {product.estoque > 0 ? `✓ ${product.estoque} em estoque` : '✗ Fora de estoque'}
                </div>
              </CardContent>
              <CardFooter className="space-y-3">
                <div className="flex w-full space-x-2">
                  <Button 
                    className={`flex-1 ${
                      product.estoque > 0 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-400 cursor-not-allowed text-white'
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.estoque <= 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.estoque > 0 ? 'Adicionar' : 'Indisponível'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleFavorite(product)}
                    className={`hover:text-red-500 border-gray-300 ${
                      isFavorite(product.id) ? 'text-red-500 bg-red-50' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${
                      isFavorite(product.id) ? 'fill-current' : ''
                    }`} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Products Button */}
        {products.length > 6 && (
          <div className="text-center mb-12">
            <Button 
              onClick={handleViewAllProducts}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              Ver Todos os Produtos ({products.length})
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
