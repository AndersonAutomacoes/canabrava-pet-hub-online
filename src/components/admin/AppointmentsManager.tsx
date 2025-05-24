
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar, CheckCircle, XCircle } from 'lucide-react';
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

export const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment =>
    appointment.nmPet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.dsServico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.nuTelefoneWhatsapp?.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Agendamentos</h2>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Calendar className="w-4 h-4 mr-2" />
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
              className="max-w-sm border-slate-300 focus:border-green-500 focus:ring-green-500"
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
                      {appointment.dtStart ? formatDate(appointment.dtStart) : 'N/A'}
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
    </div>
  );
};
