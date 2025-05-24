
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  titulo: string;
  resumo: string;
  imagem_url?: string;
  categoria?: string;
  autor?: string;
  created_at: string;
  slug: string;
  tags?: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.imagem_url && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={post.imagem_url} 
            alt={post.titulo}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          {post.categoria && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {post.categoria}
            </Badge>
          )}
        </div>
        
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-800 hover:text-green-600 transition-colors line-clamp-2">
            {post.titulo}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-3">
          {post.resumo}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
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
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <Link 
          to={`/blog/${post.slug}`}
          className="inline-block text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Ler mais →
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
