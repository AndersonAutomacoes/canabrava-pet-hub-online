
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, PawPrint, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDateTime } from '@/utils/dateFormatters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Pet {
  cdPet: number;
  nmPet: string;
  nmRaca?: string;
  dsPorte?: string;
  nuIdade?: number;
  dtNascimento?: string;
}

interface Agendamento {
  cdAgendamento: number;
  dtStart: string;
  dtEnd: string;
  flComparecimento: boolean;
  dsServico?: string;
  vrServico?: number;
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
  const [agendamentos, setAgendamentos] = useState<Record<number, Agendamento[]>>({});
  const [loading, setLoading] = useState(true);
  const [showAddPet, setShowAddPet] = useState(false);
  const [showHistory, setShowHistory] = useState<number | null>(null);
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

  const fetchPetHistory = async (petId: number) => {
    try {
      console.log('Buscando histórico do pet:', petId);
      
      // Buscar agendamentos
      const { data: agendamentosData, error: agendamentosError } = await supabase
        .from('Agendamento')
        .select('cdAgendamento, dtStart, dtEnd, flComparecimento, cdServico')
        .eq('cdPet', petId)
        .order('dtStart', { ascending: false });

      if (agendamentosError) {
        console.error('Erro ao buscar agendamentos:', agendamentosError);
        return;
      }

      // Buscar serviços separadamente
      const { data: servicosData } = await supabase
        .from('servico')
        .select('cdservico, dsservico, vrservico');

      // Mapear dados manualmente
      const mappedAgendamentos: Agendamento[] = (agendamentosData || []).map(agendamento => {
        const servico = servicosData?.find(s => s.cdservico === agendamento.cdServico);
        
        return {
          cdAgendamento: agendamento.cdAgendamento,
          dtStart: agendamento.dtStart,
          dtEnd: agendamento.dtEnd,
          flComparecimento: agendamento.flComparecimento,
          dsServico: servico?.dsservico,
          vrServico: servico?.vrservico
        };
      });
      
      setAgendamentos(prev => ({
        ...prev,
        [petId]: mappedAgendamentos
      }));
      
    } catch (error) {
      console.error('Erro inesperado ao buscar histórico:', error);
    }
  };

  const ensureClientExists = async () => {
    if (clientes.length === 0) {
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

      const { data, error } = await supabase
        .from('Pet')
        .insert(petData)
        .select()
        .single();

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

  const handleShowHistory = async (petId: number) => {
    if (!agendamentos[petId]) {
      await fetchPetHistory(petId);
    }
    setShowHistory(petId);
  };

  const getStatusBadge = (agendamento: Agendamento) => {
    const now = new Date();
    const startDate = new Date(agendamento.dtStart);
    
    if (agendamento.flComparecimento) {
      return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Realizado</Badge>;
    } else if (startDate > now) {
      return <Badge variant="secondary"><Calendar className="w-3 h-3 mr-1" />Agendado</Badge>;
    } else {
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Não Compareceu</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
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
                    <div className="flex items-center justify-between">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowHistory(pet.cdPet);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Histórico
                      </Button>
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

            {/* Modal de Histórico */}
            <Dialog open={showHistory !== null} onOpenChange={() => setShowHistory(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Histórico - {pets.find(p => p.cdPet === showHistory)?.nmPet}
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  {showHistory && agendamentos[showHistory] ? (
                    agendamentos[showHistory].length > 0 ? (
                      <div className="space-y-4">
                        {agendamentos[showHistory].map((agendamento) => (
                          <div key={agendamento.cdAgendamento} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">
                                  {agendamento.dsServico || 'Serviço'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {formatDateTime(agendamento.dtStart)}
                                </p>
                              </div>
                              {getStatusBadge(agendamento)}
                            </div>
                            {agendamento.vrServico && (
                              <p className="text-sm text-green-600 font-semibold">
                                R$ {agendamento.vrServico.toFixed(2)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Nenhum histórico encontrado</p>
                      </div>
                    )
                  ) : (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  )}
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
