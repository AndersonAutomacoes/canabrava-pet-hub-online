
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FavoriteItem {
  id: string;
  produto_id: string;
  created_at: string;
  produtos: {
    nome: string;
    preco: number;
    imagens: string[];
    categoria: string;
  };
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select(`
          id,
          produto_id,
          created_at,
          produtos:produto_id (
            nome,
            preco,
            imagens,
            categoria
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (produtoId: string) => {
    return favorites.some(fav => fav.produto_id === produtoId);
  };

  const addToFavorites = async (produtoId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar aos favoritos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favoritos')
        .insert({
          user_id: user.id,
          produto_id: produtoId
        });

      if (error) throw error;

      toast({
        title: "Adicionado aos favoritos!",
        description: "O produto foi adicionado à sua lista de favoritos.",
      });

      fetchFavorites();
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos.",
        variant: "destructive",
      });
    }
  };

  const removeFromFavorites = async (produtoId: string) => {
    try {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user?.id)
        .eq('produto_id', produtoId);

      if (error) throw error;

      toast({
        title: "Removido dos favoritos",
        description: "O produto foi removido da sua lista de favoritos.",
      });

      fetchFavorites();
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover dos favoritos.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (produtoId: string) => {
    if (isFavorite(produtoId)) {
      await removeFromFavorites(produtoId);
    } else {
      await addToFavorites(produtoId);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  return {
    favorites,
    loading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    fetchFavorites
  };
};
