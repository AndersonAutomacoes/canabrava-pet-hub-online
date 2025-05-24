
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
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
}

export const CEPAutoComplete: React.FC<CEPAutoCompleteProps> = ({ 
  onAddressComplete, 
  initialCep = '' 
}) => {
  const [cep, setCep] = useState(initialCep);
  const [loading, setLoading] = useState(false);
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
  };

  const fetchAddressByCEP = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: CEPData = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado.",
          variant: "destructive",
        });
        return;
      }

      onAddressComplete(data);
      
      toast({
        title: "Endereço encontrado!",
        description: "Os campos foram preenchidos automaticamente.",
      });
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar o endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchAddressByCEP();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cep" className="text-slate-700 font-medium">
        CEP *
      </Label>
      <div className="flex gap-2">
        <Input
          id="cep"
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={handleCepChange}
          onKeyPress={handleKeyPress}
          maxLength={9}
          className="flex-1 bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
        />
        <Button
          type="button"
          onClick={fetchAddressByCEP}
          disabled={loading || cep.replace(/\D/g, '').length !== 8}
          variant="outline"
          size="icon"
          className="border-slate-300 hover:bg-green-50 hover:border-green-400"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-slate-500">
        Digite o CEP e clique na lupa para preencher automaticamente
      </p>
    </div>
  );
};
