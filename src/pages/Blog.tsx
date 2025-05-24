
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
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
  resumo: string; // Required for BlogCard
  imagem_url?: string;
  categoria?: string;
  autor?: string;
  slug: string;
  tags?: string[];
  publicado: boolean;
  created_at: string;
  updated_at: string;
}

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const { posts: rawPosts, loading } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts to only include those with resumo and transform them
  const posts: BlogPost[] = rawPosts
    .filter(post => post.resumo && post.resumo.trim() !== '')
    .map(post => ({
      ...post,
      resumo: post.resumo!
    }));

  const categories = [...new Set(posts.map(post => post.categoria).filter(Boolean))];
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.resumo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.categoria === selectedCategory;
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedTag;

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
        <div className="space-y-4">
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
            
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="sm:w-auto"
              >
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Categorias:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className="bg-green-600 hover:bg-green-700"
              >
                Todas
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

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Tags:</span>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedTag === '' ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag('')}
                >
                  Todas
                </Badge>
                {allTags.slice(0, 10).map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'secondary'}
                    className="cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        {filteredPosts.length > 0 && (
          <div className="text-sm text-gray-600">
            {filteredPosts.length === posts.length 
              ? `${posts.length} posts encontrados`
              : `${filteredPosts.length} de ${posts.length} posts encontrados`
            }
            {hasActiveFilters && ' (filtrado)'}
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : paginatedPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'Tente ajustar sua busca ou filtros.'
                : 'Não há posts publicados no momento.'
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Limpar Filtros
              </Button>
            )}
          </div>
        )}

        {/* Featured Categories */}
        {!hasActiveFilters && categories.length > 0 && (
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
        )}
      </div>
    </PageLayout>
  );
};

export default Blog;
