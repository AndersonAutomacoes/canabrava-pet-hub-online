
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Pet {
  cdPet: number;
  nmPet: string;
  nmRaca?: string;
  dsPorte?: string;
}

interface PetSelectorProps {
  clienteId: number | null;
  selectedPetId: string;
  onPetSelect: (petId: string) => void;
}

export const PetSelector: React.FC<PetSelectorProps> = ({
  clienteId,
  selectedPetId,
  onPetSelect
}) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clienteId) {
      fetchPets();
    } else {
      setPets([]);
    }
  }, [clienteId]);

  const fetchPets = async () => {
    if (!clienteId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Pet')
        .select('cdPet, nmPet, nmRaca, dsPorte')
        .eq('cdCliente', clienteId)
        .order('nmPet');

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!clienteId) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um cliente primeiro" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={selectedPetId}
      onValueChange={onPetSelect}
      disabled={loading}
    >
      <SelectTrigger>
        <SelectValue placeholder={loading ? "Carregando pets..." : "Selecione um pet"} />
      </SelectTrigger>
      <SelectContent>
        {pets.map((pet) => (
          <SelectItem key={pet.cdPet} value={pet.cdPet.toString()}>
            <div>
              <div className="font-medium">{pet.nmPet}</div>
              <div className="text-sm text-gray-500">
                {pet.nmRaca && `${pet.nmRaca} • `}
                {pet.dsPorte || 'Porte não informado'}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
