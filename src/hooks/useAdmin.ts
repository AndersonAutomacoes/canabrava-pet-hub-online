
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
        
        const { data: isAdminResult, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Erro ao chamar RPC is_admin:', error);
          setIsAdmin(false);
        } else {
          console.log('Status de admin (RPC):', isAdminResult);
          setIsAdmin(isAdminResult);
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
