import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, PawPrint } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Pet {
  cdPet: number;
  nmPet: string;
  nmRaca?: string;
  dsPorte?: string;
}

interface Cliente {
  cdCliente: number;
  dsNome?: string;
}

interface PetSelectionProps {
  selectedPet: string;
  onPetSelect: (petId: string) => void;
}

const PetSelection: React.FC<PetSelectionProps> = ({ selectedPet, onPetSelect }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({
    nmPet: '',
    nmRaca: '',
    dsPorte: 'PEQUENO'
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPets(), fetchClientes()]);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      console.log('Buscando clientes...');
      
      const { data, error } = await supabase
        .from('Clientes')
        .select('cdCliente, dsNome')
        .order('cdCliente');

      console.log('Resultado da busca de clientes:', { data, error });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return;
      }
      
      setClientes(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar clientes:', error);
    }
  };

  const fetchPets = async () => {
    try {
      console.log('Buscando pets...');
      
      const { data, error } = await supabase
        .from('Pet')
        .select('*')
        .order('nmPet');

      console.log('Resultado da busca de pets:', { data, error });

      if (error) {
        console.error('Erro ao buscar pets:', error);
        toast({
          title: "Erro",
          description: `Erro ao carregar pets: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      setPets(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar pets:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar os pets.",
        variant: "destructive",
      });
    }
  };

  const ensureClientExists = async () => {
    if (clientes.length === 0) {
      // Criar um cliente padrão se não existir nenhum
      try {
        console.log('Criando cliente padrão...');
        
        const { data, error } = await supabase
          .from('Clientes')
          .insert({
            dsNome: 'Cliente Padrão',
            nuTelefoneWhatsapp: '(11) 99999-9999',
            cdEmpresa: 1
          })
          .select()
          .single();

        console.log('Resultado da criação do cliente:', { data, error });

        if (error) {
          throw error;
        }

        setClientes([data]);
        return data.cdCliente;
      } catch (error) {
        console.error('Erro ao criar cliente padrão:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar cliente padrão.",
          variant: "destructive",
        });
        return null;
      }
    }
    
    return clientes[0].cdCliente;
  };

  const handleAddPet = async () => {
    if (!newPet.nmPet.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do pet é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adicionando novo pet:', newPet);
      
      // Garantir que existe um cliente válido
      const cdCliente = await ensureClientExists();
      if (!cdCliente) {
        toast({
          title: "Erro",
          description: "Não foi possível criar ou encontrar um cliente válido.",
          variant: "destructive",
        });
        return;
      }

      const petData = {
        cdCliente: cdCliente,
        nmPet: newPet.nmPet.trim(),
        nmRaca: newPet.nmRaca.trim() || null,
        dsPorte: newPet.dsPorte
      };

      console.log('Dados do pet para inserção:', petData);

      const { data, error } = await supabase
        .from('Pet')
        .insert(petData)
        .select()
        .single();

      console.log('Resultado da inserção do pet:', { data, error });

      if (error) {
        console.error('Erro ao adicionar pet:', error);
        toast({
          title: "Erro",
          description: `Erro ao adicionar pet: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      setPets([...pets, data]);
      setNewPet({ nmPet: '', nmRaca: '', dsPorte: 'PEQUENO' });
      setShowAddPet(false);
      
      toast({
        title: "Pet adicionado!",
        description: `${data.nmPet} foi adicionado com sucesso.`,
      });

      // Selecionar automaticamente o pet recém-criado
      onPetSelect(data.cdPet.toString());
    } catch (error) {
      console.error('Erro inesperado ao adicionar pet:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar o pet.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PawPrint className="w-5 h-5" />
          <span>Selecionar Pet</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pets.length === 0 ? (
          <div className="text-center py-8">
            <PawPrint className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Nenhum pet cadastrado</p>
            <Dialog open={showAddPet} onOpenChange={setShowAddPet}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Pet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Pet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="petName">Nome do Pet *</Label>
                    <Input
                      id="petName"
                      value={newPet.nmPet}
                      onChange={(e) => setNewPet({ ...newPet, nmPet: e.target.value })}
                      placeholder="Ex: Rex, Luna, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="petBreed">Raça</Label>
                    <Input
                      id="petBreed"
                      value={newPet.nmRaca}
                      onChange={(e) => setNewPet({ ...newPet, nmRaca: e.target.value })}
                      placeholder="Ex: Golden Retriever, SRD, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="petSize">Porte</Label>
                    <Select value={newPet.dsPorte} onValueChange={(value) => setNewPet({ ...newPet, dsPorte: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEQUENO">Pequeno</SelectItem>
                        <SelectItem value="MEDIO">Médio</SelectItem>
                        <SelectItem value="GRANDE">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddPet(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddPet}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <Card 
                  key={pet.cdPet}
                  className={`cursor-pointer transition-all ${
                    selectedPet === pet.cdPet.toString() 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => onPetSelect(pet.cdPet.toString())}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <PawPrint className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{pet.nmPet}</h4>
                        {pet.nmRaca && (
                          <p className="text-sm text-gray-600">{pet.nmRaca}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Porte {pet.dsPorte?.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={showAddPet} onOpenChange={setShowAddPet}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Pet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Pet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="petName">Nome do Pet *</Label>
                    <Input
                      id="petName"
                      value={newPet.nmPet}
                      onChange={(e) => setNewPet({ ...newPet, nmPet: e.target.value })}
                      placeholder="Ex: Rex, Luna, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="petBreed">Raça</Label>
                    <Input
                      id="petBreed"
                      value={newPet.nmRaca}
                      onChange={(e) => setNewPet({ ...newPet, nmRaca: e.target.value })}
                      placeholder="Ex: Golden Retriever, SRD, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="petSize">Porte</Label>
                    <Select value={newPet.dsPorte} onValueChange={(value) => setNewPet({ ...newPet, dsPorte: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEQUENO">Pequeno</SelectItem>
                        <SelectItem value="MEDIO">Médio</SelectItem>
                        <SelectItem value="GRANDE">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddPet(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddPet}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PetSelection;
