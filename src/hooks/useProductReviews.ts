
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
  profiles?: {
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
      // First get reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('avaliacoes_produtos')
        .select('*')
        .eq('produto_id', produtoId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        setReviews([]);
        setTotalReviews(0);
        setAverageRating(0);
        return;
      }

      // Then get user profiles for the reviews
      if (reviewsData && reviewsData.length > 0) {
        const userIds = reviewsData.map(review => review.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, nome')
          .in('id', userIds);

        // Combine reviews with profile data
        const reviewsWithProfiles = reviewsData.map(review => ({
          ...review,
          profiles: profilesData?.find(profile => profile.id === review.user_id) || { nome: 'Usuário' }
        }));

        setReviews(reviewsWithProfiles);
        setTotalReviews(reviewsWithProfiles.length);
        
        const avg = reviewsWithProfiles.reduce((sum: number, review: any) => sum + review.avaliacao, 0) / reviewsWithProfiles.length;
        setAverageRating(avg);
      } else {
        setReviews([]);
        setTotalReviews(0);
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setTotalReviews(0);
      setAverageRating(0);
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
      // Check if user already reviewed this product
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
      console.error('Error adding review:', error);
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
