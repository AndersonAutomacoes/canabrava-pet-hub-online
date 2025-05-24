
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, ArrowRight, Heart } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Como Cuidar da Higiene do seu Pet no Inverno',
      excerpt: 'Dicas essenciais para manter seu pet limpo e saudável durante os meses mais frios do ano.',
      content: 'O inverno requer cuidados especiais com a higiene dos pets. Banhos menos frequentes, secagem completa e produtos específicos são fundamentais...',
      category: 'Cuidados',
      author: 'Dr. Carlos Silva',
      date: '2024-01-15',
      readTime: '5 min',
      views: 234,
      image: '🧼',
      tags: ['higiene', 'inverno', 'cuidados'],
      featured: true
    },
    {
      id: 2,
      title: 'Os Melhores Brinquedos para Estimular seu Cão',
      excerpt: 'Descubra quais brinquedos são ideais para o desenvolvimento mental e físico do seu cão.',
      content: 'Brinquedos interativos, cordas e bolas podem fazer toda a diferença no bem-estar do seu pet...',
      category: 'Diversão',
      author: 'Maria Santos',
      date: '2024-01-12',
      readTime: '3 min',
      views: 189,
      image: '🎾',
      tags: ['brinquedos', 'exercícios', 'diversão']
    },
    {
      id: 3,
      title: 'Alimentação Balanceada: Guia Completo',
      excerpt: 'Tudo que você precisa saber sobre nutrição adequada para cães e gatos.',
      content: 'Uma alimentação equilibrada é fundamental para a saúde e longevidade do seu pet...',
      category: 'Nutrição',
      author: 'Dr. Carlos Silva',
      date: '2024-01-10',
      readTime: '7 min',
      views: 312,
      image: '🥘',
      tags: ['nutrição', 'saúde', 'alimentação']
    },
    {
      id: 4,
      title: 'Sinais de que seu Pet Precisa de Tosa',
      excerpt: 'Aprenda a identificar quando é hora de levar seu pet para uma tosa profissional.',
      content: 'Pelos emaranhados, coceira excessiva e dificuldade de movimentação são alguns sinais...',
      category: 'Beleza',
      author: 'João Oliveira',
      date: '2024-01-08',
      readTime: '4 min',
      views: 156,
      image: '✂️',
      tags: ['tosa', 'beleza', 'cuidados']
    },
    {
      id: 5,
      title: 'Como Preparar seu Pet para o Primeiro Banho',
      excerpt: 'Dicas para tornar a experiência do primeiro banho mais tranquila para filhotes.',
      content: 'O primeiro banho pode ser traumático se não for feito com cuidado e paciência...',
      category: 'Cuidados',
      author: 'Maria Santos',
      date: '2024-01-05',
      readTime: '6 min',
      views: 278,
      image: '🛁',
      tags: ['banho', 'filhotes', 'cuidados']
    },
    {
      id: 6,
      title: 'Vacinação: Cronograma e Importância',
      excerpt: 'Entenda a importância das vacinas e como manter o cronograma em dia.',
      content: 'As vacinas são essenciais para prevenir doenças graves e manter a saúde do seu pet...',
      category: 'Saúde',
      author: 'Dr. Carlos Silva',
      date: '2024-01-03',
      readTime: '8 min',
      views: 421,
      image: '💉',
      tags: ['vacinação', 'saúde', 'prevenção']
    }
  ];

  const categories = ['Todos', 'Cuidados', 'Saúde', 'Nutrição', 'Diversão', 'Beleza'];
  const [selectedCategory, setSelectedCategory] = React.useState('Todos');

  const filteredPosts = selectedCategory === 'Todos' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {featuredPost.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-white/90 mb-6">
                    {featuredPost.excerpt}
                  </CardDescription>
                  <div className="flex items-center space-x-6 text-sm text-white/80 mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{featuredPost.views} visualizações</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    Ler Artigo Completo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardHeader>
                <div className="lg:p-12 p-8 flex items-center justify-center">
                  <div className="text-9xl opacity-20">
                    {featuredPost.image}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(selectedCategory === 'Todos' ? 1 : 0).map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {post.category}
                  </Badge>
                  <div className="text-4xl">{post.image}</div>
                </div>
                <CardTitle className="text-xl mb-2 text-left group-hover:text-green-600 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-left">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Por {post.author}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex w-full space-x-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    Ler Mais
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover:text-red-500">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
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
