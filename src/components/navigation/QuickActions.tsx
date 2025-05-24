
import React from 'react';
import { Calendar, ShoppingCart, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Calendar,
      label: 'Agendar Serviço',
      description: 'Banho, tosa, consulta veterinária',
      onClick: () => navigate('/agendamento'),
      color: 'bg-green-500'
    },
    {
      icon: ShoppingCart,
      label: 'Comprar Produtos',
      description: 'Ração, brinquedos, acessórios',
      onClick: () => navigate('/produtos'),
      color: 'bg-blue-500'
    },
    {
      icon: Phone,
      label: 'Entrar em Contato',
      description: 'Tire suas dúvidas conosco',
      onClick: () => window.open('tel:(11)99999-9999'),
      color: 'bg-orange-500'
    },
    {
      icon: MapPin,
      label: 'Como Chegar',
      description: 'Rua das Flores, 123 - Canabrava',
      onClick: () => window.open('https://maps.google.com'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.onClick}>
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{action.label}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
