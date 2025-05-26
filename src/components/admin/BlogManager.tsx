import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useBlog } from '@/hooks/useBlog';

interface BlogPost {
  id: string;
  titulo: string;
  conteudo: string;
  resumo?: string;
  imagem_url?: string;
  categoria?: string;
  tags?: string[];
  autor?: string;
  slug: string;
  publicado: boolean;
  created_at: string;
  updated_at: string;
}

export const BlogManager = () => {
  const { posts, loading, createPost, updatePost, deletePost } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    resumo: '',
    imagem_url: '',
    categoria: '',
    tags: '',
    autor: '',
    slug: '',
    publicado: false
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const generateSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleCreatePost = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      if (!formData.titulo.trim() || !formData.conteudo.trim()) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e conteúdo são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      const slug = formData.slug.trim() || generateSlug(formData.titulo);
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      const postData = {
        titulo: formData.titulo.trim(),
        conteudo: formData.conteudo.trim(),
        resumo: formData.resumo.trim() || undefined,
        imagem_url: formData.imagem_url.trim() || undefined,
        categoria: formData.categoria.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        autor: formData.autor.trim() || undefined,
        slug,
        publicado: formData.publicado
      };

      console.log('Enviando dados do post:', postData);

      await createPost(postData);

      setShowForm(false);
      setFormData({
        titulo: '',
        conteudo: '',
        resumo: '',
        imagem_url: '',
        categoria: '',
        tags: '',
        autor: '',
        slug: '',
        publicado: false
      });
    } catch (error) {
      console.error('Erro no handleCreatePost:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost || submitting) return;

    try {
      setSubmitting(true);
      
      if (!formData.titulo.trim() || !formData.conteudo.trim()) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e conteúdo são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      const slug = formData.slug.trim() || generateSlug(formData.titulo);
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      const postData = {
        titulo: formData.titulo.trim(),
        conteudo: formData.conteudo.trim(),
        resumo: formData.resumo.trim() || null,
        imagem_url: formData.imagem_url.trim() || null,
        categoria: formData.categoria.trim() || null,
        tags: tags.length > 0 ? tags : null,
        autor: formData.autor.trim() || null,
        slug,
        publicado: formData.publicado,
        updated_at: new Date().toISOString()
      };

      await updatePost(editingPost.id, postData);

      setShowForm(false);
      setEditingPost(null);
      setFormData({
        titulo: '',
        conteudo: '',
        resumo: '',
        imagem_url: '',
        categoria: '',
        tags: '',
        autor: '',
        slug: '',
        publicado: false
      });
    } catch (error) {
      console.error('Erro no handleUpdatePost:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      await deletePost(id);
    } catch (error) {
      console.error('Erro no handleDeletePost:', error);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      await updatePost(post.id, { publicado: !post.publicado });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const openEditForm = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      titulo: post.titulo,
      conteudo: post.conteudo,
      resumo: post.resumo || '',
      imagem_url: post.imagem_url || '',
      categoria: post.categoria || '',
      tags: post.tags ? post.tags.join(', ') : '',
      autor: post.autor || '',
      slug: post.slug,
      publicado: post.publicado
    });
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingPost(null);
    setFormData({
      titulo: '',
      conteudo: '',
      resumo: '',
      imagem_url: '',
      categoria: '',
      tags: '',
      autor: '',
      slug: '',
      publicado: false
    });
    setShowForm(true);
  };

  const filteredPosts = posts.filter(post =>
    post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.categoria && post.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.autor && post.autor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-800">Gerenciar Blog</h2>
        <Button onClick={openCreateForm} className="pet-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Post
        </Button>
      </div>

      <Card className="pet-card border-0 shadow-medium">
        <CardHeader className="border-b border-green-100">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-green-500" />
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50 border-b border-green-100 hover:bg-green-50">
                  <TableHead className="text-green-700 font-semibold">Título</TableHead>
                  <TableHead className="text-green-700 font-semibold">Categoria</TableHead>
                  <TableHead className="text-green-700 font-semibold">Autor</TableHead>
                  <TableHead className="text-green-700 font-semibold">Status</TableHead>
                  <TableHead className="text-green-700 font-semibold">Data</TableHead>
                  <TableHead className="text-green-700 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className="border-b border-green-50 hover:bg-green-25">
                    <TableCell className="font-medium text-gray-800 max-w-xs truncate">
                      {post.titulo}
                    </TableCell>
                    <TableCell>
                      {post.categoria && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {post.categoria}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">{post.autor || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={post.publicado ? "default" : "secondary"} 
                             className={post.publicado ? "bg-green-500" : "bg-gray-400"}>
                        {post.publicado ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => togglePublished(post)}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          {post.publicado ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditForm(post)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar/editar post */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50 border border-green-200">
          <DialogHeader>
            <DialogTitle className="text-green-800">
              {editingPost ? 'Editar Post' : 'Novo Post'}
            </DialogTitle>
            <DialogDescription className="text-green-600">
              {editingPost ? 'Edite as informações do post' : 'Preencha as informações do novo post'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titulo" className="text-right text-green-700">
                Título *
              </Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    titulo: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value)
                  }));
                }}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="Título do post"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="resumo" className="text-right text-green-700 pt-2">
                Resumo
              </Label>
              <Textarea
                id="resumo"
                value={formData.resumo}
                onChange={(e) => setFormData(prev => ({ ...prev, resumo: e.target.value }))}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="Resumo do post"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="conteudo" className="text-right text-green-700 pt-2">
                Conteúdo *
              </Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="Conteúdo do post"
                rows={8}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right text-green-700">
                Categoria
              </Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="Categoria do post"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right text-green-700">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="autor" className="text-right text-green-700">
                Autor
              </Label>
              <Input
                id="autor"
                value={formData.autor}
                onChange={(e) => setFormData(prev => ({ ...prev, autor: e.target.value }))}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="Nome do autor"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagem_url" className="text-right text-green-700">
                URL da Imagem
              </Label>
              <Input
                id="imagem_url"
                value={formData.imagem_url}
                onChange={(e) => setFormData(prev => ({ ...prev, imagem_url: e.target.value }))}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right text-green-700">
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="col-span-3 bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
                placeholder="url-amigavel-do-post"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publicado" className="text-right text-green-700">
                Publicar
              </Label>
              <div className="col-span-3">
                <input
                  id="publicado"
                  type="checkbox"
                  checked={formData.publicado}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicado: e.target.checked }))}
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-green-700">Publicar este post</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={editingPost ? handleUpdatePost : handleCreatePost}
              disabled={submitting}
              className="pet-button-primary"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {editingPost ? 'Salvando...' : 'Criando...'}
                </>
              ) : (
                editingPost ? 'Salvar Alterações' : 'Criar Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
