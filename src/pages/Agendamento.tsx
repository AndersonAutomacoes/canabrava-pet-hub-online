import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProgressSteps } from '@/components/agendamento/ProgressSteps';
import { ServiceSelection } from '@/components/agendamento/ServiceSelection';
import { PetSelectionStep } from '@/components/agendamento/PetSelectionStep';
import { DateTimeSelection } from '@/components/agendamento/DateTimeSelection';
import { ConfirmationStep } from '@/components/agendamento/ConfirmationStep';
import { SuccessStep } from '@/components/agendamento/SuccessStep';

interface Servico {
  cdservico: number;
  dsservico: string;
  vrservico: number;
}

const Agendamento = () => {
  const [step, setStep] = useState(1);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServicos, setSelectedServicos] = useState<string[]>([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchServicos();
    }
  }, [user]);

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servico')
        .select('*')
        .order('dsservico');

      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const handleServiceNext = () => {
    if (selectedServicos.length === 0) {
      toast({
        title: "Selecione pelo menos um serviço",
        description: "Por favor, escolha pelo menos um serviço desejado.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePetNext = () => {
    if (!selectedPet) {
      toast({
        title: "Selecione um pet",
        description: "Por favor, escolha o pet para o agendamento.",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
  };

  const handleDateTimeNext = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione data e horário.",
        variant: "destructive",
      });
      return;
    }
    setStep(4);
  };

  const handleSubmit = async () => {
    if (!user || !selectedDate || !selectedTime || selectedServicos.length === 0 || !selectedPet) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Buscar ou criar cliente
      let clienteId;
      const { data: clienteData } = await supabase
        .from('Clientes')
        .select('cdCliente')
        .eq('nuTelefoneWhatsapp', user.phone || user.id)
        .single();

      if (clienteData) {
        clienteId = clienteData.cdCliente;
      } else {
        const { data: newCliente, error: clienteError } = await supabase
          .from('Clientes')
          .insert({
            dsNome: user.email?.split('@')[0] || 'Cliente',
            nuTelefoneWhatsapp: user.phone || user.id,
            cdEmpresa: 1
          })
          .select()
          .single();

        if (clienteError) throw clienteError;
        clienteId = newCliente.cdCliente;
      }

      const [hours, minutes] = selectedTime.split(':');
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Buscar dados do pet
      const { data: petData } = await supabase
        .from('Pet')
        .select('nmPet')
        .eq('cdPet', parseInt(selectedPet))
        .single();

      // Criar agendamentos para cada serviço selecionado
      const agendamentos = [];
      for (const servicoId of selectedServicos) {
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + 1);

        // Obter próximo ID para agendamento
        const { data: maxAgendamentoData } = await supabase
          .from('Agendamento')
          .select('cdAgendamento')
          .order('cdAgendamento', { ascending: false })
          .limit(1);

        const nextAgendamentoId = maxAgendamentoData && maxAgendamentoData.length > 0 
          ? maxAgendamentoData[0].cdAgendamento + 1 
          : 1;

        const { data, error } = await supabase
          .from('Agendamento')
          .insert({
            cdAgendamento: nextAgendamentoId,
            cdEmpresa: 1,
            cdCliente: clienteId,
            cdPet: parseInt(selectedPet),
            cdServico: parseInt(servicoId),
            dtStart: startDateTime.toISOString(),
            dtEnd: endDateTime.toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        agendamentos.push(data);

        // Buscar dados do serviço
        const { data: servicoData } = await supabase
          .from('servico')
          .select('dsservico')
          .eq('cdservico', parseInt(servicoId))
          .single();

        // Enviar email de confirmação
        try {
          await supabase.functions.invoke('send-appointment-email', {
            body: {
              agendamentoId: nextAgendamentoId,
              clienteEmail: user.email,
              petNome: petData?.nmPet || 'Pet',
              servicoNome: servicoData?.dsservico || 'Serviço',
              dataHora: startDateTime.toISOString()
            }
          });
          console.log('Email de confirmação enviado');
        } catch (emailError) {
          console.error('Erro ao enviar email:', emailError);
        }

        // Criar evento no Google Calendar
        try {
          await supabase.functions.invoke('create-calendar-event', {
            body: {
              petNome: petData?.nmPet || 'Pet',
              servicoNome: servicoData?.dsservico || 'Serviço',
              clienteNome: user.email?.split('@')[0] || 'Cliente',
              dataInicio: startDateTime.toISOString(),
              dataFim: endDateTime.toISOString(),
              observacoes: observacoes
            }
          });
          console.log('Evento criado no Google Calendar');
        } catch (calendarError) {
          console.error('Erro ao criar evento no Google Calendar:', calendarError);
        }

        // Incrementar horário para próximo serviço (se houver)
        startDateTime.setHours(startDateTime.getHours() + 1);
      }

      setStep(5);

      toast({
        title: "Agendamentos realizados!",
        description: `${selectedServicos.length} agendamento(s) criado(s) com sucesso. Verifique seu email para confirmação.`,
      });

    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro no agendamento",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServicoToggle = (servicoId: string) => {
    setSelectedServicos(prev => 
      prev.includes(servicoId)
        ? prev.filter(id => id !== servicoId)
        : [...prev, servicoId]
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto pet-card border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle>Login Necessário</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">Para agendar serviços, você precisa estar logado.</p>
              <Button className="w-full pet-button-primary" onClick={() => window.location.href = '/auth'}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <SuccessStep selectedServicosCount={selectedServicos.length} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Agendar Serviços
            </h1>
            <p className="text-gray-600 text-lg">
              Cuidado profissional para seu pet em poucos cliques
            </p>
          </div>

          <ProgressSteps currentStep={step} />

          {step === 1 && (
            <ServiceSelection
              servicos={servicos}
              selectedServicos={selectedServicos}
              onServiceToggle={handleServicoToggle}
              onNext={handleServiceNext}
            />
          )}

          {step === 2 && (
            <PetSelectionStep
              selectedPet={selectedPet}
              onPetSelect={setSelectedPet}
              onNext={handlePetNext}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <DateTimeSelection
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              observacoes={observacoes}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              onObservacoesChange={setObservacoes}
              onNext={handleDateTimeNext}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <ConfirmationStep
              servicos={servicos}
              selectedServicos={selectedServicos}
              selectedPet={selectedPet}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              observacoes={observacoes}
              loading={loading}
              onSubmit={handleSubmit}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Agendamento;
