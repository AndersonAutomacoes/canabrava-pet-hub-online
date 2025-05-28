
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { ArrowRight, Clock } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

interface DateTimeSelectionProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  observacoes: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onObservacoesChange: (observacoes: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DateTimeSelection = ({
  selectedDate,
  selectedTime,
  observacoes,
  onDateSelect,
  onTimeSelect,
  onObservacoesChange,
  onNext,
  onBack
}: DateTimeSelectionProps) => {
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  return (
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
              onSelect={onDateSelect}
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
                  onClick={() => onTimeSelect(time)}
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
            onChange={(e) => onObservacoesChange(e.target.value)}
            rows={3}
            className="mt-2 border-green-200 focus:border-green-500 focus:ring-green-500"
          />
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
            onClick={onNext} 
            className="flex-1 pet-button-primary h-12"
            disabled={!selectedDate || !selectedTime}
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
