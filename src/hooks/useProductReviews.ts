
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProductReview {
  id: string;
  produto_id: string;
  user_id: string;
  avaliacao: number;
  comentario?: string;
  created_at: string;
  profiles: {
    nome: string;
  };
}

export const useProductReviews = (produtoId?: string) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!produtoId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('avaliacoes_produtos')
        .select(`
          *,
          profiles:user_id (nome)
        `)
        .eq('produto_id', produtoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReviews(data || []);
      setTotalReviews(data?.length || 0);
      
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.avaliacao, 0) / data.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (avaliacao: number, comentario?: string) => {
    if (!user || !produtoId) {
      toast({
        title: "Login necessário",
        description: "Faça login para avaliar produtos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Verificar se o usuário já avaliou este produto
      const { data: existingReview } = await supabase
        .from('avaliacoes_produtos')
        .select('id')
        .eq('produto_id', produtoId)
        .eq('user_id', user.id)
        .single();

      if (existingReview) {
        toast({
          title: "Avaliação já existe",
          description: "Você já avaliou este produto.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('avaliacoes_produtos')
        .insert({
          produto_id: produtoId,
          user_id: user.id,
          avaliacao,
          comentario
        });

      if (error) throw error;

      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada com sucesso.",
      });

      fetchReviews();
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (produtoId) {
      fetchReviews();
    }
  }, [produtoId]);

  return {
    reviews,
    loading,
    averageRating,
    totalReviews,
    addReview,
    fetchReviews
  };
};
