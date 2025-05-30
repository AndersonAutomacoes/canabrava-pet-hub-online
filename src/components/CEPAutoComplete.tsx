
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CEPData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface CEPAutoCompleteProps {
  onAddressComplete: (address: CEPData) => void;
  initialCep?: string;
  onCepChange?: (cep: string) => void;
}

export const CEPAutoComplete: React.FC<CEPAutoCompleteProps> = ({ 
  onAddressComplete, 
  initialCep = '',
  onCepChange
}) => {
  const [cep, setCep] = useState(initialCep);
  const [loading, setLoading] = useState(false);
  const [lastSearchedCep, setLastSearchedCep] = useState('');
  const { toast } = useToast();

  const formatCEP = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numericValue.length <= 5) {
      return numericValue;
    } else {
      return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCEP(e.target.value);
    setCep(formattedCep);
    
    // Notificar o componente pai sobre a mudança do CEP
    if (onCepChange) {
      onCepChange(formattedCep);
    }
  };

  const fetchAddressByCEP = async (cepToSearch: string) => {
    const cleanCep = cepToSearch.replace(/\D/g, '');
    
    // Não buscar se for o mesmo CEP já pesquisado ou se for inválido
    if (cleanCep.length !== 8 || cleanCep === lastSearchedCep) {
      return;
    }

    setLoading(true);
    try {
      console.log('Buscando CEP automaticamente:', cleanCep);
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CEPData = await response.json();
      console.log('Dados do CEP recebidos:', data);

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado.",
          variant: "destructive",
        });
        return;
      }

      setLastSearchedCep(cleanCep);
      onAddressComplete(data);
      
      toast({
        title: "Endereço encontrado!",
        description: "Os campos foram preenchidos automaticamente.",
      });
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar o endereço. Verifique o CEP e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCepBlur = () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetchAddressByCEP(cep);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        fetchAddressByCEP(cep);
      }
    }
  };

  // Effect para buscar CEP quando o valor inicial mudar
  useEffect(() => {
    if (initialCep && initialCep !== cep) {
      setCep(initialCep);
    }
  }, [initialCep]);

  return (
    <div className="space-y-2">
      <Label htmlFor="cep" className="text-slate-700 font-medium">
        CEP *
      </Label>
      <div className="relative">
        <Input
          id="cep"
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={handleCepChange}
          onBlur={handleCepBlur}
          onKeyDown={handleKeyPress}
          maxLength={9}
          className="bg-white border-slate-300 focus:border-green-500 focus:ring-green-500 pr-10"
          disabled={loading}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500">
        {loading 
          ? 'Buscando endereço...' 
          : 'Digite o CEP completo para buscar automaticamente'
        }
      </p>
    </div>
  );
};
