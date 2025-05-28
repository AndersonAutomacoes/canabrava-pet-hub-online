
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessStepProps {
  selectedServicosCount: number;
}

export const SuccessStep = ({ selectedServicosCount }: SuccessStepProps) => {
  return (
    <Card className="max-w-2xl mx-auto pet-card border-0 shadow-xl">
      <CardContent className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Agendamentos Confirmados!
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Seus {selectedServicosCount} agendamento(s) foram criados com sucesso. 
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
  );
};
