
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Verificando status de admin para usuário:', user.id);
        
        // Primeira tentativa: usar a função RPC is_admin
        const { data: isAdminRpc, error: rpcError } = await supabase.rpc('is_admin');
        
        if (rpcError) {
          console.error('Erro ao chamar RPC is_admin:', rpcError);
          
          // Fallback: consulta direta na tabela admin_users
          const { data: adminData, error: directError } = await supabase
            .from('admin_users')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (directError) {
            console.error('Erro ao verificar admin diretamente:', directError);
            setIsAdmin(false);
          } else {
            const adminStatus = !!adminData;
            console.log('Status de admin (consulta direta):', adminStatus);
            setIsAdmin(adminStatus);
          }
        } else {
          console.log('Status de admin (RPC):', isAdminRpc);
          setIsAdmin(isAdminRpc);
        }
      } catch (error) {
        console.error('Erro ao verificar admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
