
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  cdAgendamento: number;
  dtStart: string;
  dtEnd: string;
  cdCliente: number;
  cdPet: number;
  cdServico: number;
  cdEmpresa: number;
  flComparecimento: boolean;
  dtCreatedAt: string;
  // Dados relacionados
  dsServico?: string;
  nmPet?: string;
  dsNomeCliente?: string;
  nuTelefoneWhatsapp?: string;
}

export const useAppointmentSync = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      console.log('Buscando agendamentos com dados relacionados...');
      
      // Buscar agendamentos primeiro
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('Agendamento')
        .select('*')
        .order('dtStart', { ascending: true });

      console.log('Resultado da busca de agendamentos:', { data: appointmentsData, error: appointmentsError });

      if (appointmentsError) throw appointmentsError;

      // Buscar dados relacionados separadamente
      const { data: servicesData } = await supabase
        .from('servico')
        .select('cdservico, dsservico');

      const { data: clientesData } = await supabase
        .from('Clientes')
        .select('cdCliente, dsNome, nuTelefoneWhatsapp');

      const { data: petsData } = await supabase
        .from('Pet')
        .select('cdPet, nmPet, cdCliente');

      // Mapear os dados manualmente
      const mappedAppointments = (appointmentsData || []).map(appointment => {
        const service = servicesData?.find(s => s.cdservico === appointment.cdServico);
        const cliente = clientesData?.find(c => c.cdCliente === appointment.cdCliente);
        const pet = petsData?.find(p => p.cdPet === appointment.cdPet);

        return {
          cdAgendamento: appointment.cdAgendamento,
          dtStart: appointment.dtStart,
          dtEnd: appointment.dtEnd,
          cdCliente: appointment.cdCliente,
          cdPet: appointment.cdPet,
          cdServico: appointment.cdServico,
          cdEmpresa: appointment.cdEmpresa,
          flComparecimento: appointment.flComparecimento,
          dtCreatedAt: appointment.dtCreatedAt,
          dsServico: service?.dsservico,
          nmPet: pet?.nmPet,
          dsNomeCliente: cliente?.dsNome,
          nuTelefoneWhatsapp: cliente?.nuTelefoneWhatsapp
        };
      });

      setAppointments(mappedAppointments);
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

  const updateAppointmentStatus = async (cdAgendamento: number, flComparecimento: boolean) => {
    try {
      const { error } = await supabase
        .from('Agendamento')
        .update({ flComparecimento })
        .eq('cdAgendamento', cdAgendamento);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Agendamento marcado como ${flComparecimento ? 'compareceu' : 'não compareceu'}.`,
      });

      // Atualizar lista local
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.cdAgendamento === cdAgendamento 
            ? { ...appointment, flComparecimento }
            : appointment
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
    }
  };

  const syncAppointments = () => {
    console.log('Sincronizando agendamentos...');
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();

    // Configurar sincronização em tempo real
    const channel = supabase
      .channel('appointment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Agendamento'
        },
        (payload) => {
          console.log('Agendamento atualizado:', payload);
          fetchAppointments(); // Recarregar dados quando houver mudanças
        }
      )
      .subscribe();

    // Sincronização automática a cada 30 segundos para garantir dados atualizados
    const syncInterval = setInterval(() => {
      syncAppointments();
    }, 30 * 1000); // 30 segundos

    return () => {
      supabase.removeChannel(channel);
      clearInterval(syncInterval);
    };
  }, []);

  return {
    appointments,
    loading,
    updateAppointmentStatus,
    syncAppointments,
    refetch: fetchAppointments
  };
};
