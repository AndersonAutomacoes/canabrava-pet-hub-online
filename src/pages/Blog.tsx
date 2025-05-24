import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import BlogCard from '@/components/blog/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Local interface that matches our component needs and BlogCard requirements
interface BlogPost {
  id: string;
  titulo: string;
  conteudo: string;
  resumo: string; // Made required to match BlogCard expectations
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
  const { posts, loading } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(posts.map(post => post.categoria).filter(Boolean))];

  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.resumo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout
      title="Blog PetShop Canabrava"
      subtitle="Dicas, cuidados e novidades sobre o mundo pet"
      breadcrumbs={[
        { label: 'Blog', current: true }
      ]}
      containerSize="xl"
    >
      <div className="space-y-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className="bg-green-600 hover:bg-green-700"
              >
                Todos
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar sua busca ou filtros.
            </p>
          </div>
        )}

        {/* Featured Categories */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Explore por Categoria
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <Badge 
                key={category}
                variant="secondary"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Blog;
