
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from './useAdmin';

interface Cliente {
  cdCliente: number;
  dsNome?: string;
  nuTelefoneWhatsapp?: string;
}

export const useUserClient = () => {
  const [currentClient, setCurrentClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const fetchCurrentClient = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Se for admin, não precisa buscar cliente específico
        if (isAdmin) {
          setLoading(false);
          return;
        }

        console.log('Buscando cliente para usuário:', user.id);
        
        // Buscar cliente baseado no telefone do usuário autenticado
        const { data: clienteData, error } = await supabase
          .from('Clientes')
          .select('cdCliente, dsNome, nuTelefoneWhatsapp')
          .eq('nuTelefoneWhatsapp', user.phone || user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao buscar cliente:', error);
        } else if (clienteData) {
          console.log('Cliente encontrado:', clienteData);
          setCurrentClient(clienteData);
        } else {
          console.log('Cliente não encontrado, criando cliente padrão...');
          
          // Criar cliente se não existir
          const { data: newClient, error: createError } = await supabase
            .from('Clientes')
            .insert({
              dsNome: user.email?.split('@')[0] || 'Cliente',
              nuTelefoneWhatsapp: user.phone || user.id,
              cdEmpresa: 1
            })
            .select()
            .single();

          if (createError) {
            console.error('Erro ao criar cliente:', createError);
          } else {
            console.log('Cliente criado:', newClient);
            setCurrentClient(newClient);
          }
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentClient();
  }, [user, isAdmin]);

  return { currentClient, loading };
};
