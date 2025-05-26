
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, ExternalLink } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ url, title, description }) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description || '');

  const openShareWindow = (shareLink: string) => {
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 flex items-center">
        <Share2 className="w-4 h-4 mr-1" />
        Compartilhar:
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="text-blue-600 hover:bg-blue-50"
      >
        Facebook
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.whatsapp)}
        className="text-green-600 hover:bg-green-50"
      >
        WhatsApp
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.instagram, '_blank')}
        className="text-pink-600 hover:bg-pink-50"
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        Instagram
      </Button>
    </div>
  );
};
