
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';

interface Servico {
  cdservico: number;
  dsservico: string;
  vrservico: number;
}

interface ServiceSelectionProps {
  servicos: Servico[];
  selectedServicos: string[];
  onServiceToggle: (servicoId: string) => void;
  onNext: () => void;
}

export const ServiceSelection = ({ 
  servicos, 
  selectedServicos, 
  onServiceToggle, 
  onNext 
}: ServiceSelectionProps) => {
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

  return (
    <Card className="pet-card border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="text-xl">Selecione os Serviços</CardTitle>
        <p className="text-green-100">Você pode selecionar múltiplos serviços</p>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicos.map((servico) => (
            <Card 
              key={servico.cdservico}
              className={`cursor-pointer transition-all duration-300 border-2 ${
                selectedServicos.includes(servico.cdservico.toString())
                  ? 'border-green-500 bg-green-50 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-green-300 hover:shadow-md'
              }`}
              onClick={() => onServiceToggle(servico.cdservico.toString())}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{servico.dsservico}</h3>
                    {servico.vrservico && (
                      <p className="text-green-600 font-bold text-lg">
                        R$ {servico.vrservico.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Checkbox
                    checked={selectedServicos.includes(servico.cdservico.toString())}
                    onChange={() => onServiceToggle(servico.cdservico.toString())}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedServicos.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Serviços Selecionados:</h4>
            <p className="text-green-700">{getSelectedServicosNames()}</p>
            <p className="text-green-800 font-bold mt-2">
              Total: R$ {getTotalValue().toFixed(2)}
            </p>
          </div>
        )}
        
        <Button 
          onClick={onNext} 
          className="w-full pet-button-primary h-12 text-base"
          disabled={selectedServicos.length === 0}
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
};
