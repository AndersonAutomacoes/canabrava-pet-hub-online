
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Pet {
  cdPet: number;
  nmPet: string;
  nmRaca?: string;
  dsPorte?: string;
  nuIdade?: number;
}

interface PetSelectionStepProps {
  selectedPet: string;
  onPetSelect: (petId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PetSelectionStep: React.FC<PetSelectionStepProps> = ({
  selectedPet,
  onPetSelect,
  onNext,
  onBack
}) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserPets();
    }
  }, [user]);

  const fetchUserPets = async () => {
    if (!user) return;
    
    try {
      // Primeiro buscar o cliente pelo user_id (usando telefone como referência temporária)
      const { data: clienteData } = await supabase
        .from('Clientes')
        .select('cdCliente')
        .eq('nuTelefoneWhatsapp', user.phone || user.id)
        .single();

      if (clienteData) {
        // Buscar pets do cliente
        const { data: petsData, error } = await supabase
          .from('Pet')
          .select('cdPet, nmPet, nmRaca, dsPorte, nuIdade')
          .eq('cdCliente', clienteData.cdCliente)
          .order('nmPet');

        if (error) throw error;
        setPets(petsData || []);
      } else {
        // Se não encontrou cliente, tentar criar um novo baseado no usuário
        const { data: newCliente, error: clienteError } = await supabase
          .from('Clientes')
          .insert({
            dsNome: user.email?.split('@')[0] || 'Cliente',
            nuTelefoneWhatsapp: user.phone || user.id,
            cdEmpresa: 1
          })
          .select()
          .single();

        if (!clienteError) {
          // Cliente criado, mas ainda sem pets
          setPets([]);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar pets do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="pet-card border-0 shadow-xl max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pets.length === 0) {
    return (
      <Card className="pet-card border-0 shadow-xl max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6" />
            <span>Selecionar Pet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum pet cadastrado
            </h3>
            <p className="text-gray-500 mb-6">
              Você precisa cadastrar pelo menos um pet para agendar serviços.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={onBack} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={() => window.location.href = '/meu-pet'}>
                Cadastrar Pet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pet-card border-0 shadow-xl max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-6 h-6" />
          <span>Selecionar Pet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {pets.map((pet) => (
            <div
              key={pet.cdPet}
              className={`pet-card p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPet === pet.cdPet.toString()
                  ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
              onClick={() => onPetSelect(pet.cdPet.toString())}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🐕</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{pet.nmPet}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {pet.nmRaca && (
                    <p><span className="font-medium">Raça:</span> {pet.nmRaca}</p>
                  )}
                  {pet.dsPorte && (
                    <p><span className="font-medium">Porte:</span> {pet.dsPorte}</p>
                  )}
                  {pet.nuIdade && (
                    <p><span className="font-medium">Idade:</span> {pet.nuIdade} anos</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button onClick={onBack} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={onNext}
            disabled={!selectedPet}
            className="pet-button-primary"
          >
            Continuar
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
