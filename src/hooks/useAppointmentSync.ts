
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
      
      const { data, error } = await supabase
        .from('Agendamento')
        .select(`
          *,
          servico!inner(dsservico),
          Pet!inner(nmPet),
          Clientes!inner(dsNome, nuTelefoneWhatsapp)
        `)
        .order('dtStart', { ascending: true });

      console.log('Resultado da busca de agendamentos:', { data, error });

      if (error) throw error;

      // Mapear os dados para o formato esperado
      const mappedAppointments = (data || []).map(appointment => ({
        cdAgendamento: appointment.cdAgendamento,
        dtStart: appointment.dtStart,
        dtEnd: appointment.dtEnd,
        cdCliente: appointment.cdCliente,
        cdPet: appointment.cdPet,
        cdServico: appointment.cdServico,
        cdEmpresa: appointment.cdEmpresa,
        flComparecimento: appointment.flComparecimento,
        dtCreatedAt: appointment.dtCreatedAt,
        dsServico: appointment.servico?.dsservico,
        nmPet: appointment.Pet?.nmPet,
        dsNomeCliente: appointment.Clientes?.dsNome,
        nuTelefoneWhatsapp: appointment.Clientes?.nuTelefoneWhatsapp
      }));

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
