
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const getPostBySlug = useCallback(async (postSlug: string) => {
    try {
      console.log('Buscando post com slug:', postSlug);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('publicado', true)
        .single();

      if (error) {
        console.error('Erro ao buscar post:', error);
        return null;
      }

      console.log('Post encontrado:', data);
      return data;
    } catch (error) {
      console.error('Erro inesperado ao buscar post:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        console.log('Slug não encontrado');
        setLoading(false);
        return;
      }

      console.log('Iniciando busca do post...');
      setLoading(true);
      
      const postData = await getPostBySlug(slug);
      setPost(postData);
      setLoading(false);
      
      console.log('Busca finalizada. Post:', postData);
    };

    fetchPost();
  }, [slug, getPostBySlug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout
        title="Post não encontrado"
        breadcrumbs={[
          { label: 'Blog', href: '/blog' },
          { label: 'Post não encontrado', current: true }
        ]}
      >
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Post não encontrado
          </h2>
          <p className="text-gray-500 mb-6">
            O post que você está procurando não existe ou foi removido.
          </p>
          <Link to="/blog">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Blog', href: '/blog' },
        { label: post.titulo, current: true }
      ]}
      containerSize="lg"
    >
      <article className="max-w-4xl mx-auto">
        {/* Back to Blog */}
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          {post.imagem_url && (
            <div className="w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
              <img 
                src={post.imagem_url} 
                alt={post.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            {post.categoria && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {post.categoria}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {post.titulo}
            </h1>

            {post.resumo && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.resumo}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {post.autor && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{post.autor}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.conteudo.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Blog
              </Button>
            </Link>
            
            <div className="text-sm text-gray-500">
              Publicado em {formatDate(post.created_at)}
              {post.updated_at !== post.created_at && (
                <span> • Atualizado em {formatDate(post.updated_at)}</span>
              )}
            </div>
          </div>
        </footer>
      </article>
    </PageLayout>
  );
};

export default BlogPost;
