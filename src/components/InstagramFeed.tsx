
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Heart, MessageCircle } from 'lucide-react';

// Mock data - In a real implementation, you'd fetch from Instagram API
const mockInstagramPosts = [
  {
    id: '1',
    image: '/placeholder.svg',
    caption: 'Nosso cliente mais fofo do dia! 🐕',
    likes: 45,
    comments: 8,
    url: 'https://instagram.com'
  },
  {
    id: '2',
    image: '/placeholder.svg',
    caption: 'Serviço de banho e tosa completo ✨',
    likes: 32,
    comments: 5,
    url: 'https://instagram.com'
  },
  {
    id: '3',
    image: '/placeholder.svg',
    caption: 'Produtos novos chegaram! 🎉',
    likes: 28,
    comments: 3,
    url: 'https://instagram.com'
  },
  {
    id: '4',
    image: '/placeholder.svg',
    caption: 'Antes e depois da tosa 😍',
    likes: 67,
    comments: 12,
    url: 'https://instagram.com'
  }
];

export const InstagramFeed: React.FC = () => {
  return (
    <Card className="pet-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-pink-600">
          <span>📸</span>
          <span>Nosso Instagram</span>
          <ExternalLink className="w-4 h-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {mockInstagramPosts.map((post) => (
            <div 
              key={post.id}
              className="relative group cursor-pointer"
              onClick={() => window.open(post.url, '_blank')}
            >
              <img 
                src={post.image} 
                alt={post.caption}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            Ver mais no Instagram →
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
