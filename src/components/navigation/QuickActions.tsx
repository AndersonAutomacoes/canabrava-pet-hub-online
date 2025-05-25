
import React from 'react';
import { Calendar, ShoppingCart, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const actions = [
    {
      icon: Calendar,
      label: 'Agendar Serviço',
      description: 'Banho, tosa, consulta veterinária',
      onClick: () => {
        // Primeiro tenta navegar para a página de agendamento
        // Se estiver na home, faz scroll para os serviços
        if (window.location.pathname === '/') {
          scrollToServices();
        } else {
          navigate('/agendamento');
        }
      },
      colorClass: 'bg-green-500 hover:bg-green-600',
      bgClass: 'hover:bg-green-50'
    },
    {
      icon: ShoppingCart,
      label: 'Comprar Produtos',
      description: 'Ração, brinquedos, acessórios',
      onClick: () => navigate('/produtos'),
      colorClass: 'bg-blue-500 hover:bg-blue-600',
      bgClass: 'hover:bg-blue-50'
    },
    {
      icon: Phone,
      label: 'Entrar em Contato',
      description: 'Tire suas dúvidas conosco',
      onClick: () => window.open('https://wa.me/5571997227741?text=Olá! Gostaria de mais informações sobre os serviços do PetShop Canabrava.', '_blank'),
      colorClass: 'bg-orange-500 hover:bg-orange-600',
      bgClass: 'hover:bg-orange-50'
    },
    {
      icon: MapPin,
      label: 'Como Chegar',
      description: 'Rua das Flores, 123 - Canabrava',
      onClick: () => window.open('https://maps.google.com/maps?q=Rua+das+Flores,+123+Canabrava', '_blank'),
      colorClass: 'bg-purple-500 hover:bg-purple-600',
      bgClass: 'hover:bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card 
            key={index} 
            className={`pet-card cursor-pointer group transition-all duration-300 ${action.bgClass} border-slate-200 hover:border-slate-300`} 
            onClick={action.onClick}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-14 h-14 ${action.colorClass} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 text-lg">{action.label}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
