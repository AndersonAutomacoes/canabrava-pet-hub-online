
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
  dsServico: string;
  nmPet: string;
  nuTelefoneWhatsapp: string;
}

interface Service {
  cdServico: number;
  dsServico: string;
}

export const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dtStart: '',
    dtEnd: '',
    cdServico: '',
    nmPet: '',
    nuTelefoneWhatsapp: ''
  });
  const { toast } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultaagendamentopet')
        .select('*')
        .order('dtStart', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('Servico')
        .select('cdServico, dsServico')
        .order('dsServico');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const handleCreateAppointment = async () => {
    try {
      const startDateTime = new Date(formData.dtStart);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1);

      const { error } = await supabase
        .from('Agendamento')
        .insert([{
          cdEmpresa: 1,
          cdCliente: 1,
          cdPet: 1,
          cdServico: parseInt(formData.cdServico),
          dtStart: startDateTime.toISOString(),
          dtEnd: endDateTime.toISOString(),
        }]);

      if (error) throw error;

      toast({
        title: "Agendamento criado!",
        description: "O agendamento foi criado com sucesso.",
      });

      setShowForm(false);
      setFormData({
        dtStart: '',
        dtEnd: '',
        cdServico: '',
        nmPet: '',
        nuTelefoneWhatsapp: ''
      });
      fetchAppointments();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
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
      dtEnd: '',
      cdServico: '',
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
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar agendamento */}
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
                Data/Hora
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
                Serviço
              </Label>
              <Select value={formData.cdServico} onValueChange={(value) => setFormData(prev => ({ ...prev, cdServico: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.cdServico} value={service.cdServico.toString()}>
                      {service.dsServico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pet" className="text-right">
                Pet
              </Label>
              <Input
                id="pet"
                value={formData.nmPet}
                onChange={(e) => setFormData(prev => ({ ...prev, nmPet: e.target.value }))}
                className="col-span-3"
                placeholder="Nome do pet"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                value={formData.nuTelefoneWhatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, nuTelefoneWhatsapp: e.target.value }))}
                className="col-span-3"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateAppointment}>
              Criar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
