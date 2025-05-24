
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FreteConfiguracao {
  id: string;
  valor_fixo: number;
  valor_por_kg: number;
  prazo_dias: number;
  descricao: string;
}

interface FreteCalculado {
  valor: number;
  prazo: number;
  descricao: string;
  peso_total: number;
}

export const useFreteCalculator = () => {
  const [loading, setLoading] = useState(false);
  const [freteCalculado, setFreteCalculado] = useState<FreteCalculado | null>(null);
  const { toast } = useToast();

  const calcularFrete = useCallback(async (cep: string, pesoTotal: number) => {
    if (!cep || !pesoTotal) {
      setFreteCalculado(null);
      return;
    }

    // Limpar formatação do CEP
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Buscar configuração de frete adequada
      const { data: configuracoes, error } = await supabase
        .from('frete_configuracoes')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Encontrar a configuração adequada para o CEP
      let configuracaoEscolhida: FreteConfiguracao | null = null;
      
      for (const config of configuracoes || []) {
        const cepInicioLimpo = config.cep_destino_inicio.replace(/\D/g, '');
        const cepFimLimpo = config.cep_destino_fim.replace(/\D/g, '');
        
        if (cepLimpo >= cepInicioLimpo && cepLimpo <= cepFimLimpo) {
          configuracaoEscolhida = config;
          break;
        }
      }

      if (!configuracaoEscolhida) {
        // Usar configuração padrão para outros estados
        configuracaoEscolhida = configuracoes?.find(c => 
          c.descricao?.includes('Outros estados')
        ) || null;
      }

      if (configuracaoEscolhida) {
        const valorCalculado = configuracaoEscolhida.valor_fixo + 
          (configuracaoEscolhida.valor_por_kg * pesoTotal);

        setFreteCalculado({
          valor: valorCalculado,
          prazo: configuracaoEscolhida.prazo_dias,
          descricao: configuracaoEscolhida.descricao,
          peso_total: pesoTotal
        });
      } else {
        toast({
          title: "Região não atendida",
          description: "Não conseguimos calcular o frete para este CEP.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast({
        title: "Erro no cálculo",
        description: "Não foi possível calcular o frete. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const formatarCEP = (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return {
    calcularFrete,
    freteCalculado,
    loading,
    formatarCEP
  };
};
