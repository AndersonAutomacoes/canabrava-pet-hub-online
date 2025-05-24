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

interface Appointment {
  cdAgendamento: number;
  dtStart: string;
  cdCliente: number;
  flComparecimento: boolean;
  dsServico?: string;
  nmPet?: string;
  nuTelefoneWhatsapp?: string;
}

interface Service {
  cdservico: number;
  dsservico: string;
}

interface Cliente {
  cdCliente: number;
  dsNome?: string;
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
    dtEnd: '',
    cdservico: '',
    cdCliente: '',
    cdPet: '',
    nmPet: '',
    nuTelefoneWhatsapp: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

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
      
      const { data, error } = await supabase
        .from('Clientes')
        .select('cdCliente, dsNome')
        .order('dsNome');

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
      
      const { data, error } = await supabase
        .from('Agendamento')
        .select('*')
        .order('dtStart', { ascending: false });

      console.log('Resultado da busca de agendamentos:', { data, error });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        toast({
          title: "Erro",
          description: `Erro ao carregar agendamentos: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      setAppointments(data || []);
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

  const ensureRequiredData = async () => {
    let clienteId = null;
    let petId = null;

    // Verificar se existe cliente, senão criar um
    if (clientes.length === 0) {
      try {
        console.log('Criando cliente padrão...');
        
        const { data: newCliente, error: clienteError } = await supabase
          .from('Clientes')
          .insert({
            dsNome: 'Cliente Padrão',
            nuTelefoneWhatsapp: '(11) 99999-9999',
            cdEmpresa: 1
          })
          .select()
          .single();

        if (clienteError) throw clienteError;
        
        setClientes([newCliente]);
        clienteId = newCliente.cdCliente;
        console.log('Cliente padrão criado:', newCliente);
      } catch (error) {
        console.error('Erro ao criar cliente padrão:', error);
        throw new Error('Não foi possível criar cliente padrão');
      }
    } else {
      clienteId = clientes[0].cdCliente;
    }

    // Verificar se existe pet, senão criar um
    if (pets.length === 0) {
      try {
        console.log('Criando pet padrão...');
        
        const { data: newPet, error: petError } = await supabase
          .from('Pet')
          .insert({
            cdCliente: clienteId,
            nmPet: 'Pet Padrão',
            dsPorte: 'MEDIO'
          })
          .select()
          .single();

        if (petError) throw petError;
        
        setPets([newPet]);
        petId = newPet.cdPet;
        console.log('Pet padrão criado:', newPet);
      } catch (error) {
        console.error('Erro ao criar pet padrão:', error);
        throw new Error('Não foi possível criar pet padrão');
      }
    } else {
      petId = pets[0].cdPet;
    }

    return { clienteId, petId };
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

      // Garantir que temos dados necessários
      const { clienteId, petId } = await ensureRequiredData();

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
        dtEnd: '',
        cdservico: '',
        cdCliente: '',
        cdPet: '',
        nmPet: '',
        nuTelefoneWhatsapp: ''
      });
      await fetchAppointments();
    } catch (error) {
      console.error('Erro inesperado ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const openCreateForm = () => {
    setFormData({
      dtStart: '',
      dtEnd: '',
      cdservico: '',
      cdCliente: '',
      cdPet: '',
      nmPet: '',
      nuTelefoneWhatsapp: ''
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Agendamentos</h2>
        <Button onClick={openCreateForm} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-500" />
            <Input
              placeholder="Buscar por pet, serviço ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
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
                <TableRow className="bg-slate-100 border-b border-slate-200 hover:bg-slate-100">
                  <TableHead className="text-slate-700 font-semibold">Data/Hora</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Pet</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Serviço</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Telefone</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.cdAgendamento} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="text-slate-700">
                      {formatDate(appointment.dtStart)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {appointment.nmPet || 'N/A'}
                    </TableCell>
                    <TableCell className="text-slate-700">{appointment.dsServico || 'N/A'}</TableCell>
                    <TableCell className="text-slate-700">{appointment.nuTelefoneWhatsapp || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={appointment.flComparecimento ? "default" : "secondary"} className={appointment.flComparecimento ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                        {appointment.flComparecimento ? 'Compareceu' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAppointments.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo agendamento
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="datetime" className="text-right">
                Data/Hora *
              </Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={formData.dtStart}
                onChange={(e) => setFormData(prev => ({ ...prev, dtStart: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Serviço *
              </Label>
              <Select value={formData.cdservico} onValueChange={(value) => setFormData(prev => ({ ...prev, cdservico: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.cdservico} value={service.cdservico.toString()}>
                      {service.dsservico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {clientes.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cliente" className="text-right">
                  Cliente
                </Label>
                <Select value={formData.cdCliente} onValueChange={(value) => setFormData(prev => ({ ...prev, cdCliente: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.cdCliente} value={cliente.cdCliente.toString()}>
                        {cliente.dsNome || `Cliente ${cliente.cdCliente}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {pets.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet" className="text-right">
                  Pet
                </Label>
                <Select value={formData.cdPet} onValueChange={(value) => setFormData(prev => ({ ...prev, cdPet: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.cdPet} value={pet.cdPet.toString()}>
                        {pet.nmPet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAppointment} className="bg-green-600 hover:bg-green-700">
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
