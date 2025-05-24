
import { useState, useEffect } from 'react';
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

  const fetchPosts = async (publishedOnly = true) => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (publishedOnly) {
        query = query.eq('publicado', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts do blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPostBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar post:', error);
      return null;
    }
  };

  const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([postData]);

      if (error) throw error;

      toast({
        title: "Post criado!",
        description: "O post foi criado com sucesso.",
      });

      fetchPosts(false);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o post.",
        variant: "destructive",
      });
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ ...postData, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Post atualizado!",
        description: "O post foi atualizado com sucesso.",
      });

      fetchPosts(false);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o post.",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Post excluído!",
        description: "O post foi excluído com sucesso.",
      });

      fetchPosts(false);
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o post.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
