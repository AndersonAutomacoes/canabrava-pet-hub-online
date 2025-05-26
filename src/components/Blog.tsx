
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, ArrowRight, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  titulo: string;
  conteudo: string;
  resumo?: string;
  imagem_url?: string;
  categoria?: string;
  autor?: string;
  slug: string;
  tags?: string[];
  publicado: boolean;
  created_at: string;
  updated_at: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      console.log('Buscando posts do blog...');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('publicado', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Erro ao buscar posts:', error);
        throw error;
      }

      console.log('Posts carregados:', data);
      setBlogPosts(data || []);
      
      // Extrair categorias únicas
      const uniqueCategories = [...new Set(data?.map(p => p.categoria).filter(Boolean) || [])];
      setCategories(['Todos', ...uniqueCategories]);
      
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts do blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'Todos' 
    ? blogPosts 
    : blogPosts.filter(post => post.categoria === selectedCategory);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const getCategoryIcon = (categoria?: string) => {
    const icons: Record<string, string> = {
      'Cuidados': '🧼',
      'Saúde': '💉',
      'Nutrição': '🥘',
      'Diversão': '🎾',
      'Beleza': '✂️'
    };
    return icons[categoria || ''] || '📝';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Blog & Dicas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carregando conteúdo...
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <section id="blog" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Blog & Dicas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Em breve teremos conteúdo exclusivo para você e seu pet!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Blog & Dicas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantenha-se informado com as melhores dicas e cuidados para seu pet. 
            Conteúdo criado por nossos especialistas para você.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              className={`${
                selectedCategory === category 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'Todos' && (
          <div className="mb-16">
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <div className="grid lg:grid-cols-2 gap-0">
                <CardHeader className="lg:p-12 p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="secondary" className="bg-white text-green-600">
                      Destaque
                    </Badge>
                    {featuredPost.categoria && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {featuredPost.categoria}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {featuredPost.titulo}
                  </CardTitle>
                  <CardDescription className="text-lg text-white/90 mb-6">
                    {featuredPost.resumo || featuredPost.conteudo.substring(0, 150) + '...'}
                  </CardDescription>
                  <div className="flex items-center space-x-6 text-sm text-white/80 mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredPost.created_at)}</span>
                    </div>
                    {featuredPost.autor && (
                      <div className="flex items-center space-x-1">
                        <span>Por {featuredPost.autor}</span>
                      </div>
                    )}
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                      Ler Artigo Completo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardHeader>
                <div className="lg:p-12 p-8 flex items-center justify-center">
                  <div className="text-9xl opacity-20">
                    {getCategoryIcon(featuredPost.categoria)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-between items-start mb-4">
                  {post.categoria && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {post.categoria}
                    </Badge>
                  )}
                  <div className="text-4xl">{getCategoryIcon(post.categoria)}</div>
                </div>
                <CardTitle className="text-xl mb-2 text-left group-hover:text-green-600 transition-colors">
                  {post.titulo}
                </CardTitle>
                <CardDescription className="text-gray-600 text-left">
                  {post.resumo || post.conteudo.substring(0, 100) + '...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  {post.autor && <span>Por {post.autor}</span>}
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex w-full space-x-2">
                  <Link to={`/blog/${post.slug}`} className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Ler Mais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="hover:text-red-500">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Ver todos os posts */}
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
              Ver Todos os Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Receba Dicas Exclusivas por Email
          </h3>
          <p className="mb-6 opacity-90">
            Inscreva-se em nossa newsletter e receba as melhores dicas de cuidados para pets 
            diretamente no seu email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 border-0 focus:ring-2 focus:ring-white"
            />
            <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              Inscrever-se
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
