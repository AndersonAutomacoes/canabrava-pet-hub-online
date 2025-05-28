
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Servico {
  cdservico: number;
  dsservico: string;
  vrservico: number;
}

interface ConfirmationStepProps {
  servicos: Servico[];
  selectedServicos: string[];
  selectedPet: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  observacoes: string;
  loading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export const ConfirmationStep = ({
  servicos,
  selectedServicos,
  selectedPet,
  selectedDate,
  selectedTime,
  observacoes,
  loading,
  onSubmit,
  onBack
}: ConfirmationStepProps) => {
  const getSelectedServicosNames = () => {
    return selectedServicos.map(id => {
      const servico = servicos.find(s => s.cdservico.toString() === id);
      return servico?.dsservico || '';
    }).join(', ');
  };

  const getTotalValue = () => {
    return selectedServicos.reduce((total, id) => {
      const servico = servicos.find(s => s.cdservico.toString() === id);
      return total + (servico?.vrservico || 0);
    }, 0);
  };

  const formatDisplayDate = (date: Date, time: string) => {
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes));
    return format(dateTime, "dd-MM-yyyy HH:mm", { locale: ptBR });
  };

  return (
    <Card className="pet-card border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="text-xl">Confirmar Agendamentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-800 text-lg mb-4">Resumo dos Agendamentos</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Serviços:</span>
              <span className="text-gray-800">{getSelectedServicosNames()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Pet:</span>
              <span className="text-gray-800">Pet #{selectedPet}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Data e Hora:</span>
              <span className="text-gray-800">{selectedDate && selectedTime && formatDisplayDate(selectedDate, selectedTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Total:</span>
              <span className="text-gray-800 font-bold">R$ {getTotalValue().toFixed(2)}</span>
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
            onClick={onBack} 
            className="flex-1 h-12"
          >
            Voltar
          </Button>
          <Button 
            onClick={onSubmit} 
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
                Confirmar Agendamentos
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
