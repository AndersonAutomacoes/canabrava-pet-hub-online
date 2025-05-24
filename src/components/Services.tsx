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
      color: 'from-green-400 to-green-600',
      bgClass: 'hover:bg-green-50',
      borderClass: 'hover:border-green-300',
      features: ['Shampoo premium', 'Condicionador', 'Secagem completa', 'Escovação']
    },
    {
      id: 'tosa',
      title: 'Tosa Profissional',
      description: 'Corte especializado respeitando as características da raça do seu pet.',
      price: 'A partir de R$ 45',
      duration: '2-3 horas',
      icon: '✂️',
      color: 'from-blue-400 to-blue-600',
      bgClass: 'hover:bg-blue-50',
      borderClass: 'hover:border-blue-300',
      features: ['Corte por raça', 'Aparação de unhas', 'Limpeza de ouvidos', 'Perfume']
    },
    {
      id: 'veterinario',
      title: 'Consulta Veterinária',
      description: 'Consultas com veterinários qualificados para cuidar da saúde do seu pet.',
      price: 'A partir de R$ 80',
      duration: '30-45 min',
      icon: '🩺',
      color: 'from-orange-400 to-orange-600',
      bgClass: 'hover:bg-orange-50',
      borderClass: 'hover:border-orange-300',
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
      bgClass: 'hover:bg-purple-50',
      borderClass: 'hover:border-purple-300',
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
    <section id="services" className="py-20 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
            <Card key={service.id} className={`group pet-card cursor-pointer transition-all duration-300 ${service.bgClass} ${service.borderClass} border-0 shadow-lg hover:shadow-xl`}>
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <CardTitle className="text-xl mb-2 text-gray-800">{service.title}</CardTitle>
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
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full pet-button-primary group-hover:scale-105 transition-transform duration-200"
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
          <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-green-800 text-xl">Agendar Serviço</DialogTitle>
              <DialogDescription className="text-green-600">
                Preencha os dados abaixo para agendar o serviço para seu pet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-green-700 font-medium">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-white border-green-300 focus:border-green-500 focus:ring-green-500 text-green-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-green-700 font-medium">Horário</Label>
                  <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                    <SelectTrigger className="bg-white border-green-300 focus:border-green-500 focus:ring-green-500 text-green-800">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-green-200">
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
                  <Label htmlFor="petName" className="text-green-700 font-medium">Nome do Pet *</Label>
                  <Input
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ex: Rex"
                    className="bg-white border-green-300 focus:border-green-500 focus:ring-green-500 text-green-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="petType" className="text-green-700 font-medium">Tipo/Raça</Label>
                  <Input
                    id="petType"
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    placeholder="Ex: Golden Retriever"
                    className="bg-white border-green-300 focus:border-green-500 focus:ring-green-500 text-green-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-green-700 font-medium">Seu Nome *</Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="bg-white border-green-300 focus:border-green-500 focus:ring-green-500 text-green-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone" className="text-green-700 font-medium">Telefone *</Label>
                  <Input
                    id="ownerPhone"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="bg-white border-green-300 focus:border-green-500 focus:ring-green-500 text-green-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observations" className="text-green-700 font-medium">Observações</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Informações adicionais sobre seu pet..."
                  rows={3}
                  className="bg-white border-green-300 focus:border-green-500 focus:ring-green-500 text-green-800"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSchedule} 
                className="pet-button-primary w-full h-12 text-base font-semibold"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmar Agendamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Features section */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Por que escolher nossos serviços?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl">⭐</div>
              <span className="text-gray-700 font-medium">Profissionais qualificados</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-gray-700 font-medium">Produtos premium</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-gray-700 font-medium">Agendamento flexível</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
