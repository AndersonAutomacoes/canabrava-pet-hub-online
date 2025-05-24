import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PetSelection from '@/components/PetSelection';

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
  const [selectedServico, setSelectedServico] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [agendamentoId, setAgendamentoId] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

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
    if (!selectedServico) {
      toast({
        title: "Selecione um serviço",
        description: "Por favor, escolha o serviço desejado.",
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
    if (!user || !selectedDate || !selectedTime || !selectedServico || !selectedPet) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const [hours, minutes] = selectedTime.split(':');
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1);

      const { data, error } = await supabase
        .from('Agendamento')
        .insert({
          cdEmpresa: 1,
          cdCliente: 1,
          cdPet: parseInt(selectedPet),
          cdServico: parseInt(selectedServico),
          dtStart: startDateTime.toISOString(),
          dtEnd: endDateTime.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setAgendamentoId(data.cdAgendamento.toString());
      setStep(5);

      toast({
        title: "Agendamento realizado!",
        description: "Seu agendamento foi criado com sucesso.",
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

  const formatDisplayDate = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return format(dateTime, "dd-MM-yyyy HH:mm", { locale: ptBR });
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
          <Card className="max-w-2xl mx-auto pet-card border-0 shadow-xl">
            <CardContent className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Agendamento Confirmado!
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Seu agendamento #{agendamentoId} foi criado com sucesso. 
                Você receberá uma confirmação por e-mail em breve.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/agendamento'}
                  className="pet-button-primary mr-4 h-12 px-8"
                >
                  Novo Agendamento
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="h-12 px-8"
                >
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
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
              Agendar Serviço
            </h1>
            <p className="text-gray-600 text-lg">
              Cuidado profissional para seu pet em poucos cliques
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= stepNumber ? 'text-green-600' : 'text-gray-600'}`}>
                    {stepNumber === 1 && 'Serviço'}
                    {stepNumber === 2 && 'Pet'}
                    {stepNumber === 3 && 'Data/Hora'}
                    {stepNumber === 4 && 'Confirmação'}
                  </span>
                  {stepNumber < 4 && (
                    <ArrowRight className={`w-4 h-4 mx-4 ${
                      step > stepNumber ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Selecionar Serviço */}
          {step === 1 && (
            <Card className="pet-card border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">Selecione o Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicos.map((servico) => (
                    <Card 
                      key={servico.cdservico}
                      className={`cursor-pointer transition-all duration-300 border-2 ${
                        selectedServico === servico.cdservico.toString() 
                          ? 'border-green-500 bg-green-50 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedServico(servico.cdservico.toString())}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{servico.dsservico}</h3>
                        {servico.vrservico && (
                          <p className="text-green-600 font-bold text-lg">
                            R$ {servico.vrservico.toFixed(2)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button 
                  onClick={handleServiceNext} 
                  className="w-full pet-button-primary h-12 text-base"
                  disabled={!selectedServico}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continuar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Selecionar Pet */}
          {step === 2 && (
            <div className="space-y-6">
              <Card className="pet-card border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="text-xl">Selecione o Pet</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <PetSelection selectedPet={selectedPet} onPetSelect={setSelectedPet} />
                </CardContent>
              </Card>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  className="flex-1 h-12"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handlePetNext} 
                  className="flex-1 pet-button-primary h-12"
                  disabled={!selectedPet}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Selecionar Data e Hora */}
          {step === 3 && (
            <Card className="pet-card border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">Selecione Data e Horário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 block text-gray-700">Data</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ptBR}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border border-green-200 bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-4 block text-gray-700">Horário</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className={`h-12 ${selectedTime === time ? "pet-button-primary" : "border-green-200 hover:border-green-400"}`}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes" className="text-gray-700 font-medium">Observações (opcional)</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações especiais sobre o atendimento..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={3}
                    className="mt-2 border-green-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(2)} 
                    className="flex-1 h-12"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleDateTimeNext} 
                    className="flex-1 pet-button-primary h-12"
                    disabled={!selectedDate || !selectedTime}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmação */}
          {step === 4 && (
            <Card className="pet-card border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">Confirmar Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 text-lg mb-4">Resumo do Agendamento</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Serviço:</span>
                      <span className="text-gray-800">{servicos.find(s => s.cdservico.toString() === selectedServico)?.dsservico}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Pet:</span>
                      <span className="text-gray-800">Pet #{selectedPet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Data e Hora:</span>
                      <span className="text-gray-800">{selectedDate && selectedTime && formatDisplayDate(selectedDate, selectedTime)}</span>
                    </div>
                    {observacoes && (
                      <div className="border-t border-green-200 pt-3">
                        <span className="font-medium text-gray-700">Observações:</span>
                        <p className="text-gray-800 mt-1">{observacoes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(3)} 
                    className="flex-1 h-12"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="flex-1 pet-button-primary h-12"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Agendando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirmar Agendamento
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Agendamento;
