
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  produto_id: string;
  quantidade: number;
  produto: {
    nome: string;
    preco: number;
    imagens: string[];
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('carrinho')
        .select(`
          id,
          produto_id,
          quantidade,
          produtos:produto_id (
            nome,
            preco,
            imagens
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems = data?.map(item => ({
        id: item.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        produto: {
          nome: item.produtos?.nome || '',
          preco: item.produtos?.preco || 0,
          imagens: item.produtos?.imagens || [],
        }
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o carrinho.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (produtoId: string, quantidade: number = 1) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('carrinho')
        .upsert({
          user_id: user.id,
          produto_id: produtoId,
          quantidade,
        }, {
          onConflict: 'user_id,produto_id'
        });

      if (error) throw error;

      await fetchCartItems();
      toast({
        title: "Produto adicionado!",
        description: "O produto foi adicionado ao carrinho.",
      });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('carrinho')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      await fetchCartItems();
      toast({
        title: "Produto removido",
        description: "O produto foi removido do carrinho.",
      });
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto do carrinho.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (cartItemId: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('carrinho')
        .update({ quantidade: novaQuantidade })
        .eq('id', cartItemId);

      if (error) throw error;

      await fetchCartItems();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('carrinho')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    fetchCartItems,
  };
};
