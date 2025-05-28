
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, CheckCircle, XCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAdmin } from '@/hooks/useAdmin';
import { useUserClient } from '@/hooks/useUserClient';

interface Appointment {
  cdAgendamento: number;
  dtStart: string;
  cdCliente: number;
  flComparecimento: boolean;
  dsServico?: string;
  nmPet?: string;
  dsNomeCliente?: string;
  nuTelefoneWhatsapp?: string;
  cdServico?: number;
  cdPet?: number;
}

interface Service {
  cdservico: number;
  dsservico: string;
}

interface Cliente {
  cdCliente: number;
  dsNome?: string;
  nuTelefoneWhatsapp?: string;
}

interface Pet {
  cdPet: number;
  nmPet: string;
  cdCliente: number;
}

export const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dtStart: '',
    cdservico: '',
    cdCliente: '',
    cdPet: ''
  });
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const { currentClient } = useUserClient();

  useEffect(() => {
    fetchInitialData();
  }, [isAdmin, currentClient]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAppointments(),
        fetchServices(),
        fetchClientes(),
        fetchPets()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      console.log('Buscando clientes...');
      
      // Se não é admin, usar apenas o cliente atual
      if (!isAdmin && currentClient) {
        setClientes([currentClient]);
        return;
      }

      // Se é admin, buscar todos os clientes
      if (isAdmin) {
        const { data, error } = await supabase
          .from('Clientes')
          .select('cdCliente, dsNome, nuTelefoneWhatsapp')
          .order('dsNome');

        console.log('Resultado da busca de clientes (admin):', { data, error });

        if (error) {
          console.error('Erro ao buscar clientes:', error);
          return;
        }
        
        setClientes(data || []);
      }
    } catch (error) {
      console.error('Erro inesperado ao buscar clientes:', error);
    }
  };

  const fetchPets = async () => {
    try {
      console.log('Buscando pets...');
      
      const { data, error } = await supabase
        .from('Pet')
        .select('cdPet, nmPet, cdCliente')
        .order('nmPet');

      console.log('Resultado da busca de pets:', { data, error });

      if (error) {
        console.error('Erro ao buscar pets:', error);
        return;
      }
      
      setPets(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar pets:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      console.log('Buscando agendamentos...');
      
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('Agendamento')
        .select('*')
        .order('dtStart', { ascending: false });

      if (appointmentsError) {
        console.error('Erro ao buscar agendamentos:', appointmentsError);
        toast({
          title: "Erro",
          description: `Erro ao carregar agendamentos: ${appointmentsError.message}`,
          variant: "destructive",
        });
        return;
      }

      const { data: servicesData } = await supabase
        .from('servico')
        .select('cdservico, dsservico');

      const { data: clientesData } = await supabase
        .from('Clientes')
        .select('cdCliente, dsNome, nuTelefoneWhatsapp');

      const { data: petsData } = await supabase
        .from('Pet')
        .select('cdPet, nmPet, cdCliente');

      const mappedAppointments = (appointmentsData || []).map(appointment => {
        const service = servicesData?.find(s => s.cdservico === appointment.cdServico);
        const cliente = clientesData?.find(c => c.cdCliente === appointment.cdCliente);
        const pet = petsData?.find(p => p.cdPet === appointment.cdPet);

        return {
          cdAgendamento: appointment.cdAgendamento,
          dtStart: appointment.dtStart,
          cdCliente: appointment.cdCliente,
          flComparecimento: appointment.flComparecimento,
          cdServico: appointment.cdServico,
          cdPet: appointment.cdPet,
          dsServico: service?.dsservico,
          nmPet: pet?.nmPet,
          dsNomeCliente: cliente?.dsNome,
          nuTelefoneWhatsapp: cliente?.nuTelefoneWhatsapp
        };
      });
      
      setAppointments(mappedAppointments);
      console.log('Agendamentos mapeados:', mappedAppointments);
    } catch (error) {
      console.error('Erro inesperado ao buscar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive",
      });
    }
  };

  const fetchServices = async () => {
    try {
      console.log('Buscando serviços...');
      
      const { data, error } = await supabase
        .from('servico')
        .select('cdservico, dsservico')
        .order('dsservico');

      console.log('Resultado da busca de serviços:', { data, error });

      if (error) {
        console.error('Erro ao buscar serviços:', error);
        return;
      }
      
      setServices(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar serviços:', error);
    }
  };

  const handleCreateAppointment = async () => {
    try {
      if (!formData.dtStart || !formData.cdservico) {
        toast({
          title: "Campos obrigatórios",
          description: "Data/hora e serviço são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      console.log('Criando agendamento:', formData);

      // Usar cliente atual se não for admin
      const clienteId = isAdmin 
        ? (formData.cdCliente ? parseInt(formData.cdCliente) : clientes[0]?.cdCliente)
        : currentClient?.cdCliente;

      if (!clienteId) {
        toast({
          title: "Erro",
          description: "Cliente não identificado.",
          variant: "destructive",
        });
        return;
      }

      // Usar pet selecionado ou primeiro pet disponível do cliente
      const availablePets = pets.filter(pet => pet.cdCliente === clienteId);
      const petId = formData.cdPet ? parseInt(formData.cdPet) : availablePets[0]?.cdPet;

      if (!petId) {
        toast({
          title: "Erro",
          description: "Nenhum pet disponível para este cliente.",
          variant: "destructive",
        });
        return;
      }

      const startDateTime = new Date(formData.dtStart);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1);

      const appointmentData = {
        cdEmpresa: 1,
        cdCliente: clienteId,
        cdPet: petId,
        cdServico: parseInt(formData.cdservico),
        dtStart: startDateTime.toISOString(),
        dtEnd: endDateTime.toISOString(),
        flComparecimento: false
      };

      console.log('Dados do agendamento para inserção:', appointmentData);

      const { data, error } = await supabase
        .from('Agendamento')
        .insert(appointmentData)
        .select();

      console.log('Resultado da inserção do agendamento:', { data, error });

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        toast({
          title: "Erro",
          description: `Erro ao criar agendamento: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Agendamento criado!",
        description: "O agendamento foi criado com sucesso.",
      });

      setShowForm(false);
      setFormData({
        dtStart: '',
        cdservico: '',
        cdCliente: '',
        cdPet: ''
      });
      await fetchAppointments();
    } catch (error) {
      console.error('Erro inesperado ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const openCreateForm = () => {
    setFormData({
      dtStart: '',
      cdservico: '',
      cdCliente: currentClient ? currentClient.cdCliente.toString() : '',
      cdPet: ''
    });
    setShowForm(true);
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.nmPet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.dsServico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.nuTelefoneWhatsapp?.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getAvailablePets = () => {
    if (!isAdmin && currentClient) {
      return pets.filter(pet => pet.cdCliente === currentClient.cdCliente);
    }
    
    if (!formData.cdCliente) return pets;
    return pets.filter(pet => pet.cdCliente === parseInt(formData.cdCliente));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Gerenciar Agendamentos
        </h2>
        <Button 
          onClick={openCreateForm} 
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <Card className="pet-card border-0 shadow-medium">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-100" />
            <Input
              placeholder="Buscar por pet, serviço ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus:border-white focus:ring-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50">
                  <TableHead className="text-blue-700 font-semibold">Data/Hora</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Pet</TableHead>
                  {isAdmin && <TableHead className="text-blue-700 font-semibold">Cliente</TableHead>}
                  <TableHead className="text-blue-700 font-semibold">Serviço</TableHead>
                  {isAdmin && <TableHead className="text-blue-700 font-semibold">Telefone</TableHead>}
                  <TableHead className="text-blue-700 font-semibold">Status</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.cdAgendamento} className="border-b border-blue-100 hover:bg-blue-50/50">
                    <TableCell className="text-slate-700 font-medium">
                      {formatDate(appointment.dtStart)}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-800">
                      {appointment.nmPet || 'N/A'}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-slate-700">
                        {appointment.dsNomeCliente || 'N/A'}
                      </TableCell>
                    )}
                    <TableCell className="text-slate-700">{appointment.dsServico || 'N/A'}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-slate-700">{appointment.nuTelefoneWhatsapp || 'N/A'}</TableCell>
                    )}
                    <TableCell>
                      <Badge 
                        variant={appointment.flComparecimento ? "default" : "secondary"} 
                        className={appointment.flComparecimento 
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-0" 
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
                        }
                      >
                        {appointment.flComparecimento ? 'Compareceu' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAppointments.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 5} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Nenhum agendamento encontrado com esse termo' : 'Nenhum agendamento cadastrado'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-xl">
          <DialogHeader className="text-center border-b border-blue-100 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Novo Agendamento
            </DialogTitle>
            <DialogDescription className="text-gray-600 font-medium">
              Preencha as informações do novo agendamento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="datetime" className="text-sm font-semibold text-blue-700">
                Data/Hora *
              </Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={formData.dtStart}
                onChange={(e) => setFormData(prev => ({ ...prev, dtStart: e.target.value }))}
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-semibold text-blue-700">
                Serviço *
              </Label>
              <Select value={formData.cdservico} onValueChange={(value) => setFormData(prev => ({ ...prev, cdservico: value }))}>
                <SelectTrigger className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-blue-200 shadow-lg rounded-lg">
                  {services.map((service) => (
                    <SelectItem key={service.cdservico} value={service.cdservico.toString()} className="hover:bg-blue-50">
                      {service.dsservico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAdmin && clientes.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-sm font-semibold text-blue-700">
                  Cliente
                </Label>
                <Select value={formData.cdCliente} onValueChange={(value) => setFormData(prev => ({ ...prev, cdCliente: value, cdPet: '' }))}>
                  <SelectTrigger className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-blue-200 shadow-lg rounded-lg">
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.cdCliente} value={cliente.cdCliente.toString()} className="hover:bg-blue-50">
                        {cliente.dsNome || `Cliente ${cliente.cdCliente}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {getAvailablePets().length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="pet" className="text-sm font-semibold text-blue-700">
                  Pet
                </Label>
                <Select value={formData.cdPet} onValueChange={(value) => setFormData(prev => ({ ...prev, cdPet: value }))}>
                  <SelectTrigger className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                    <SelectValue placeholder="Selecione um pet" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-blue-200 shadow-lg rounded-lg">
                    {getAvailablePets().map((pet) => (
                      <SelectItem key={pet.cdPet} value={pet.cdPet.toString()} className="hover:bg-blue-50">
                        {pet.nmPet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="flex space-x-3 pt-6 border-t border-blue-100">
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
              className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateAppointment} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium shadow-lg"
            >
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
