
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, User, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      user_name: 'Maria Silva',
      rating: 5,
      comment: 'Excelente produto! Meu cachorro adorou. A qualidade é muito boa e chegou rapidinho.',
      created_at: '2024-01-15',
      helpful_count: 8
    },
    {
      id: '2',
      user_name: 'João Santos',
      rating: 4,
      comment: 'Bom produto, mas achei um pouco caro. Qualidade ok, meu gato gostou.',
      created_at: '2024-01-10',
      helpful_count: 3
    },
    {
      id: '3',
      user_name: 'Ana Costa',
      rating: 5,
      comment: 'Recomendo! É a segunda vez que compro e sempre dá certo. Produto de qualidade.',
      created_at: '2024-01-05',
      helpful_count: 12
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para deixar uma avaliação.",
        variant: "destructive",
      });
      return;
    }

    if (newReview.rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma classificação.",
        variant: "destructive",
      });
      return;
    }

    if (newReview.comment.trim().length < 10) {
      toast({
        title: "Comentário muito curto",
        description: "Por favor, escreva pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Simular adição da review
    const review: Review = {
      id: Date.now().toString(),
      user_name: user.email?.split('@')[0] || 'Usuário',
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString().split('T')[0],
      helpful_count: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: '' });
    setShowReviewForm(false);

    toast({
      title: "Avaliação enviada!",
      description: "Obrigado por sua opinião sobre o produto.",
    });
  };

  const renderStars = (rating: number, interactive = false, size = 'w-4 h-4') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={interactive ? () => setNewReview({ ...newReview, rating: star }) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  return (
    <div className="space-y-6">
      {/* Resumo das Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Avaliações dos Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nota Geral */}
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600">
                Baseado em {reviews.length} avaliações
              </p>
            </div>

            {/* Distribuição das Notas */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botão para Avaliar */}
          <div className="mt-6 text-center">
            {!showReviewForm ? (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Avaliar Produto
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancelar Avaliação
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Nova Avaliação */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliar {productName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Sua avaliação *
              </label>
              {renderStars(newReview.rating, true, 'w-6 h-6')}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Comentário *
              </label>
              <Textarea
                placeholder="Compartilhe sua experiência com este produto..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de 10 caracteres ({newReview.comment.length}/10)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                className="bg-green-600 hover:bg-green-700"
                disabled={newReview.rating === 0 || newReview.comment.length < 10}
              >
                Enviar Avaliação
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Avaliações ({reviews.length})
        </h3>
        
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{review.user_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <Badge variant="secondary">{review.rating}.0</Badge>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{review.comment}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Útil ({review.helpful_count})
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma avaliação ainda
            </h3>
            <p className="text-gray-500 mb-4">
              Seja o primeiro a avaliar este produto!
            </p>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Fazer Primeira Avaliação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductReviews;
