
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const services = [
    {
      id: 'banho',
      title: 'Banho Completo',
      description: 'Banho com produtos específicos para cada tipo de pelo, secagem e escovação.',
      price: 'A partir de R$ 35',
      duration: '1-2 horas',
      icon: '🛁',
      color: 'from-blue-400 to-blue-600',
      features: ['Shampoo premium', 'Condicionador', 'Secagem completa', 'Escovação']
    },
    {
      id: 'tosa',
      title: 'Tosa Profissional',
      description: 'Corte especializado respeitando as características da raça do seu pet.',
      price: 'A partir de R$ 45',
      duration: '2-3 horas',
      icon: '✂️',
      color: 'from-orange-400 to-orange-600',
      features: ['Corte por raça', 'Aparação de unhas', 'Limpeza de ouvidos', 'Perfume']
    },
    {
      id: 'veterinario',
      title: 'Consulta Veterinária',
      description: 'Consultas com veterinários qualificados para cuidar da saúde do seu pet.',
      price: 'A partir de R$ 80',
      duration: '30-45 min',
      icon: '🩺',
      color: 'from-green-400 to-green-600',
      features: ['Exame clínico', 'Orientações', 'Prescrições', 'Carteira de vacinação']
    },
    {
      id: 'spa',
      title: 'SPA Premium',
      description: 'Tratamento completo de beleza e bem-estar para seu pet.',
      price: 'A partir de R$ 120',
      duration: '3-4 horas',
      icon: '💆',
      color: 'from-purple-400 to-purple-600',
      features: ['Banho premium', 'Tosa', 'Hidratação', 'Aromaterapia']
    }
  ];

  const handleSchedule = () => {
    if (!selectedService || !appointmentDate || !appointmentTime || !petName || !ownerName || !ownerPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Simulate scheduling
    toast({
      title: "Agendamento realizado!",
      description: `${ownerName}, seu agendamento para ${petName} foi confirmado para ${new Date(appointmentDate).toLocaleDateString('pt-BR')} às ${appointmentTime}.`,
    });

    // Reset form and close dialog
    setSelectedService('');
    setAppointmentDate('');
    setAppointmentTime('');
    setPetName('');
    setPetType('');
    setOwnerName('');
    setOwnerPhone('');
    setObservations('');
    setIsOpen(false);
  };

  const handleOpenDialog = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsOpen(true);
  };

  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços para manter seu pet saudável, 
            limpo e feliz. Todos os procedimentos são realizados por profissionais qualificados.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{service.price}</span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration}
                  </div>
                </div>
                <div className="space-y-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleOpenDialog(service.id)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Dialog for scheduling */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] bg-purple-50 border border-purple-300">
            <DialogHeader>
              <DialogTitle className="text-purple-800">Agendar Serviço</DialogTitle>
              <DialogDescription className="text-purple-600">
                Preencha os dados abaixo para agendar o serviço para seu pet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-purple-700">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-purple-700">Horário</Label>
                  <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                    <SelectTrigger className="bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petName" className="text-purple-700">Nome do Pet *</Label>
                  <Input
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ex: Rex"
                    className="bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="petType" className="text-purple-700">Tipo/Raça</Label>
                  <Input
                    id="petType"
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    placeholder="Ex: Golden Retriever"
                    className="bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-purple-700">Seu Nome *</Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone" className="text-purple-700">Telefone *</Label>
                  <Input
                    id="ownerPhone"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observations" className="text-purple-700">Observações</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Informações adicionais sobre seu pet..."
                  rows={3}
                  className="bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 text-purple-800"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSchedule} 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Confirmar Agendamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Features section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Por que escolher nossos serviços?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 text-teal-500 flex items-center justify-center">⭐</div>
              <span className="text-gray-700">Profissionais qualificados</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">Produtos premium</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700">Agendamento flexível</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
