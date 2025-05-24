
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductFormData {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  marca: string;
  peso: number;
  estoque: number;
  ativo: boolean;
  tipo_pet: string;
  dimensoes: string;
  imagens: string[];
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categorias = [
  'food', 'toys', 'accessories', 'hygiene', 'health', 'other'
];

const tiposPet = [
  'cachorro', 'gato', 'passaro', 'peixe', 'roedor', 'todos'
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    nome: initialData?.nome || '',
    descricao: initialData?.descricao || '',
    preco: initialData?.preco || 0,
    categoria: initialData?.categoria || '',
    marca: initialData?.marca || '',
    peso: initialData?.peso || 0.5,
    estoque: initialData?.estoque || 0,
    ativo: initialData?.ativo !== undefined ? initialData.ativo : true,
    tipo_pet: initialData?.tipo_pet || '',
    dimensoes: initialData?.dimensoes || '',
    imagens: initialData?.imagens || []
  });

  const [imagemUrl, setImagemUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const adicionarImagem = () => {
    if (imagemUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        imagens: [...prev.imagens, imagemUrl.trim()]
      }));
      setImagemUrl('');
    }
  };

  const removerImagem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.nome ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco}
                onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                min="0"
                value={formData.peso}
                onChange={(e) => setFormData(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estoque">Estoque</Label>
              <Input
                id="estoque"
                type="number"
                min="0"
                value={formData.estoque}
                onChange={(e) => setFormData(prev => ({ ...prev, estoque: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tipo_pet">Tipo de Pet</Label>
              <Select
                value={formData.tipo_pet}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_pet: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPet.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dimensoes">Dimensões</Label>
              <Input
                id="dimensoes"
                value={formData.dimensoes}
                onChange={(e) => setFormData(prev => ({ ...prev, dimensoes: e.target.value }))}
                placeholder="Ex: 10x5x15 cm"
              />
            </div>
          </div>

          <div>
            <Label>Imagens do Produto</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="URL da imagem"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
              />
              <Button type="button" onClick={adicionarImagem} variant="outline">
                Adicionar
              </Button>
            </div>
            {formData.imagens.length > 0 && (
              <div className="space-y-2">
                {formData.imagens.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removerImagem(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
            />
            <Label htmlFor="ativo">Produto ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
