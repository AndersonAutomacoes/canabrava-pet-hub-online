
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';

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
  'cao', 'gato', 'passaro', 'peixe', 'roedor', 'todos'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <Card className="border-slate-200 shadow-lg bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-slate-800">
            {initialData?.nome ? 'Editar Produto' : 'Novo Produto'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nome" className="text-slate-700">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                  className="bg-white border-slate-300"
                />
              </div>
              
              <div>
                <Label htmlFor="marca" className="text-slate-700">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
                  className="bg-white border-slate-300"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descricao" className="text-slate-700">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
                className="bg-white border-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="preco" className="text-slate-700">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                  required
                  className="bg-white border-slate-300"
                />
              </div>
              
              <div>
                <Label htmlFor="peso" className="text-slate-700">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.peso}
                  onChange={(e) => setFormData(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                  required
                  className="bg-white border-slate-300"
                />
              </div>
              
              <div>
                <Label htmlFor="estoque" className="text-slate-700">Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  min="0"
                  value={formData.estoque}
                  onChange={(e) => setFormData(prev => ({ ...prev, estoque: parseInt(e.target.value) || 0 }))}
                  required
                  className="bg-white border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="categoria" className="text-slate-700">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                >
                  <SelectTrigger className="bg-white border-slate-300">
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
                <Label htmlFor="tipo_pet" className="text-slate-700">Tipo de Pet</Label>
                <Select
                  value={formData.tipo_pet}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_pet: value }))}
                >
                  <SelectTrigger className="bg-white border-slate-300">
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
                <Label htmlFor="dimensoes" className="text-slate-700">Dimensões</Label>
                <Input
                  id="dimensoes"
                  value={formData.dimensoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensoes: e.target.value }))}
                  placeholder="Ex: 10x5x15 cm"
                  className="bg-white border-slate-300"
                />
              </div>
            </div>

            <ImageUpload 
              images={formData.imagens}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, imagens }))}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
              />
              <Label htmlFor="ativo" className="text-slate-700">Produto ativo</Label>
            </div>

            <div className="flex gap-4 pt-6">
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
    </div>
  );
};
