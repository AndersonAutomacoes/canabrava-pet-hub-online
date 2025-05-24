
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  marca: string;
  estoque: number;
  tipo_pet: string;
  imagens: string[];
}

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTipoPet, setSelectedTipoPet] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (produtoId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('carrinho')
        .upsert({
          user_id: user.id,
          produto_id: produtoId,
          quantidade: 1,
        }, {
          onConflict: 'user_id,produto_id'
        });

      if (error) throw error;

      toast({
        title: "Produto adicionado!",
        description: "O produto foi adicionado ao carrinho.",
      });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const addToFavorites = async (produtoId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar aos favoritos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favoritos')
        .upsert({
          user_id: user.id,
          produto_id: produtoId,
        }, {
          onConflict: 'user_id,produto_id'
        });

      if (error) throw error;

      toast({
        title: "Adicionado aos favoritos!",
        description: "O produto foi adicionado aos seus favoritos.",
      });
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
    }
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || produto.categoria === selectedCategory;
    const matchesTipoPet = !selectedTipoPet || produto.tipo_pet === selectedTipoPet || produto.tipo_pet === 'ambos';
    
    return matchesSearch && matchesCategory && matchesTipoPet;
  });

  const categories = [...new Set(produtos.map(p => p.categoria))];
  const tiposPet = ['cao', 'gato', 'ambos'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Carregando produtos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Nossos Produtos</h1>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTipoPet} onValueChange={setSelectedTipoPet}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Pet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os pets</SelectItem>
                <SelectItem value="cao">Cães</SelectItem>
                <SelectItem value="gato">Gatos</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-600 flex items-center">
              {filteredProdutos.length} produto(s) encontrado(s)
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-4xl">🐾</span>
                </div>
                <CardTitle className="text-lg">{produto.nome}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{produto.categoria}</Badge>
                  {produto.tipo_pet && (
                    <Badge variant="outline">
                      {produto.tipo_pet === 'cao' ? 'Cão' : produto.tipo_pet === 'gato' ? 'Gato' : 'Ambos'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{produto.descricao}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  {produto.marca && (
                    <span className="text-sm text-gray-500">{produto.marca}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Estoque: {produto.estoque} unidades
                </p>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => addToCart(produto.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={produto.estoque === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {produto.estoque === 0 ? 'Esgotado' : 'Carrinho'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => addToFavorites(produto.id)}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProdutos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Produtos;
