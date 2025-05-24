
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange }) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleAddImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      onImagesChange([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Imagens do Produto</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="URL da imagem"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddImage} 
          variant="outline"
          disabled={!imageUrl.trim()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {/* Preview das imagens */}
      {images.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Imagens adicionadas:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={url} 
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">Erro ao carregar imagem</div>';
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="mt-2 text-xs text-gray-500 truncate">
                  {url}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Adicione URLs de imagens do produto. As imagens devem estar hospedadas online.
      </div>
    </div>
  );
};
