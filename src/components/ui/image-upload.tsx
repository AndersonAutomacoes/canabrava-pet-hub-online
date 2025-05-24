
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image } from 'lucide-react';

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
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <Label className="text-slate-700 font-medium">Imagens do Produto</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="URL da imagem"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="flex-1 bg-white border-slate-300"
        />
        <Button 
          type="button" 
          onClick={handleAddImage} 
          variant="outline"
          disabled={!imageUrl.trim()}
          className="bg-white hover:bg-slate-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {/* Preview das imagens */}
      {images.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Imagens adicionadas:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={url} 
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"><div class="text-center"><svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>Erro ao carregar</div></div>';
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

      <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <Image className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-800">Dicas para imagens:</span>
        </div>
        <ul className="text-blue-700 space-y-1">
          <li>• Use URLs de imagens hospedadas online (ex: imgur, cloudinary)</li>
          <li>• Formatos aceitos: JPG, PNG, WebP</li>
          <li>• Resolução recomendada: 800x800px ou superior</li>
        </ul>
      </div>
    </div>
  );
};
