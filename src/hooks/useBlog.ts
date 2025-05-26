import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPosts = useCallback(async (publishedOnly = true) => {
    setLoading(true);
    try {
      console.log('Buscando posts do blog...');
      
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (publishedOnly) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar posts:', error);
        throw error;
      }

      console.log('Posts carregados:', data);
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts do blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getPostBySlug = useCallback(async (slug: string) => {
    try {
      console.log('Buscando post por slug:', slug);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .single();

      if (error) {
        console.error('Erro ao buscar post por slug:', error);
        throw error;
      }

      console.log('Post encontrado por slug:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar post:', error);
      return null;
    }
  }, []);

  const createPost = useCallback(async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Criando post:', postData);
      
      // Validação dos dados obrigatórios
      if (!postData.titulo || !postData.conteudo || !postData.slug) {
        throw new Error('Título, conteúdo e slug são obrigatórios');
      }

      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se o usuário é administrador usando a nova função
      const { data: isAdminResult, error: adminError } = await supabase.rpc('is_admin');
      
      if (adminError) {
        console.error('Erro ao verificar status de admin:', adminError);
        throw new Error('Erro ao verificar permissões de administrador');
      }

      if (!isAdminResult) {
        throw new Error('Você não tem permissão para criar posts. Apenas administradores podem criar posts.');
      }

      // Preparar dados para inserção
      const insertData = {
        titulo: postData.titulo.trim(),
        conteudo: postData.conteudo.trim(),
        slug: postData.slug.trim(),
        resumo: postData.resumo?.trim() || null,
        imagem_url: postData.imagem_url?.trim() || null,
        categoria: postData.categoria?.trim() || null,
        autor: postData.autor?.trim() || null,
        tags: postData.tags && postData.tags.length > 0 ? postData.tags : null,
        publicado: Boolean(postData.publicado)
      };

      console.log('Dados preparados para inserção:', insertData);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado ao criar post:', error);
        if (error.code === '23505') {
          throw new Error('Já existe um post com este slug. Escolha outro slug.');
        }
        throw error;
      }

      console.log('Post criado com sucesso:', data);

      toast({
        title: "Post criado!",
        description: "O post foi criado com sucesso.",
      });

      await fetchPosts(false);
      return data;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível criar o post.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast, fetchPosts]);

  const updatePost = useCallback(async (id: string, postData: Partial<BlogPost>) => {
    try {
      console.log('Atualizando post:', id, postData);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...postData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar post:', error);
        if (error.code === '42501') {
          throw new Error('Você não tem permissão para atualizar posts.');
        }
        throw error;
      }

      console.log('Post atualizado com sucesso:', data);

      toast({
        title: "Post atualizado!",
        description: "O post foi atualizado com sucesso.",
      });

      await fetchPosts(false);
      return data;
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível atualizar o post.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast, fetchPosts]);

  const deletePost = useCallback(async (id: string) => {
    try {
      console.log('Excluindo post:', id);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir post:', error);
        if (error.code === '42501') {
          throw new Error('Você não tem permissão para excluir posts.');
        }
        throw error;
      }

      console.log('Post excluído com sucesso');

      toast({
        title: "Post excluído!",
        description: "O post foi excluído com sucesso.",
      });

      await fetchPosts(false);
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível excluir o post.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast, fetchPosts]);

  // Carregar posts ao inicializar o hook
  useEffect(() => {
    fetchPosts(false);
  }, [fetchPosts]);

  return {
    posts,
    loading,
    fetchPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost
  };
};
