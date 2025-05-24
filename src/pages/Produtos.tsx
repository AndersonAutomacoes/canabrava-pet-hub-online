
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Heart, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';
import PageLayout from '@/components/PageLayout';
import SearchBar from '@/components/SearchBar';
import LoadingCard from '@/components/LoadingCard';
import EmptyState from '@/components/EmptyState';

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
  ativo: boolean;
}

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTipoPet, setSelectedTipoPet] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }
      
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

  const handleAddToCart = async (produtoId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    await addToCart(produtoId, 1);
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
      toast({
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos.",
        variant: "destructive",
      });
    }
  };

  if (selectedProduct) {
    return (
      <PageLayout
        title="Detalhes do Produto"
        breadcrumbs={[
          { label: 'Produtos', href: '/produtos' },
          { label: selectedProduct.nome, current: true }
        ]}
      >
        <ProductDetails 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)}
        />
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout title="Nossos Produtos" subtitle="Carregando produtos...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </PageLayout>
    );
  }

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || produto.categoria === selectedCategory;
    const matchesTipoPet = !selectedTipoPet || selectedTipoPet === 'all' || produto.tipo_pet === selectedTipoPet || produto.tipo_pet === 'todos';
    
    return matchesSearch && matchesCategory && matchesTipoPet;
  });

  const categories = [...new Set(produtos.map(p => p.categoria))];
  const tiposPet = ['cao', 'gato', 'todos'];

  return (
    <PageLayout
      title="Nossos Produtos"
      subtitle="Encontre tudo o que seu pet precisa"
      breadcrumbs={[
        { label: 'Produtos', current: true }
      ]}
    >
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SearchBar
          placeholder="Buscar produtos..."
          onSearch={(query) => setSearchTerm(query)}
          onClear={() => setSearchTerm('')}
        />
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedTipoPet} onValueChange={setSelectedTipoPet}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="Tipo de Pet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pets</SelectItem>
            <SelectItem value="cao">Cães</SelectItem>
            <SelectItem value="gato">Gatos</SelectItem>
            <SelectItem value="todos">Ambos</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-gray-600 flex items-center justify-center bg-white rounded-lg px-4 border border-gray-300">
          {filteredProdutos.length} produto(s) encontrado(s)
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredProdutos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id} className="hover:shadow-lg transition-shadow bg-white">
              <CardHeader className="cursor-pointer" onClick={() => setSelectedProduct(produto)}>
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  {produto.imagens && produto.imagens.length > 0 ? (
                    <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl">🐾</span>
                  )}
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
              
              <CardContent className="cursor-pointer" onClick={() => setSelectedProduct(produto)}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(produto.id);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={produto.estoque === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {produto.estoque === 0 ? 'Esgotado' : 'Carrinho'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToFavorites(produto.id);
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<div className="text-6xl">🔍</div>}
          title="Nenhum produto encontrado"
          description="Tente ajustar os filtros ou buscar por outros termos."
          action={
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedTipoPet('all');
            }}>
              Limpar Filtros
            </Button>
          }
        />
      )}
    </PageLayout>
  );
};

export default Produtos;
