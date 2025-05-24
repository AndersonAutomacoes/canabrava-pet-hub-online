
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
    peso?: number;
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = async () => {
    if (!user) return;
    
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
            imagens,
            peso
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems = (data || []).map(item => ({
        id: item.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        produto: item.produtos
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
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
      // Verificar se o item já existe no carrinho
      const { data: existingItem } = await supabase
        .from('carrinho')
        .select('id, quantidade')
        .eq('user_id', user.id)
        .eq('produto_id', produtoId)
        .single();

      if (existingItem) {
        // Atualizar quantidade se já existe
        const { error } = await supabase
          .from('carrinho')
          .update({ quantidade: existingItem.quantidade + quantidade })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Adicionar novo item
        const { error } = await supabase
          .from('carrinho')
          .insert({
            user_id: user.id,
            produto_id: produtoId,
            quantidade
          });

        if (error) throw error;
      }

      toast({
        title: "Produto adicionado!",
        description: "O produto foi adicionado ao carrinho.",
      });

      // Recarregar carrinho
      fetchCartItems();
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('carrinho')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Produto removido",
        description: "O produto foi removido do carrinho.",
      });

      fetchCartItems();
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto do carrinho.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('carrinho')
        .update({ quantidade })
        .eq('id', itemId);

      if (error) throw error;

      fetchCartItems();
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
      
      toast({
        title: "Carrinho limpo",
        description: "Todos os itens foram removidos do carrinho.",
      });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível limpar o carrinho.",
        variant: "destructive",
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  const getCartItemCount = () => {
    return getCartItemsCount();
  };

  const syncCart = () => {
    console.log('Sincronizando carrinho...');
    fetchCartItems();
  };

  useEffect(() => {
    if (user) {
      fetchCartItems();

      // Configurar sincronização em tempo real do carrinho
      const channel = supabase
        .channel('cart-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'carrinho',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Carrinho atualizado:', payload);
            fetchCartItems(); // Recarregar dados quando houver mudanças
          }
        )
        .subscribe();

      // Sincronização automática a cada 2 minutos
      const syncInterval = setInterval(() => {
        syncCart();
      }, 2 * 60 * 1000); // 2 minutos

      return () => {
        supabase.removeChannel(channel);
        clearInterval(syncInterval);
      };
    } else {
      setCartItems([]);
    }
  }, [user]);

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartItemCount,
    fetchCartItems,
    syncCart
  };
};
