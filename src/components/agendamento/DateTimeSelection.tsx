
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  observacoes,
  onDateSelect,
  onTimeSelect,
  onObservacoesChange,
  onNext,
  onBack
}) => {
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Horários disponíveis
  const availableHours = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    if (selectedDate) {
      fetchOccupiedSlots();
    }
  }, [selectedDate]);

  const fetchOccupiedSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('Agendamento')
        .select('dtStart')
        .gte('dtStart', startOfDay.toISOString())
        .lt('dtStart', endOfDay.toISOString());

      if (error) throw error;

      const slots = data.map(appointment => {
        const appointmentTime = new Date(appointment.dtStart);
        return `${appointmentTime.getHours().toString().padStart(2, '0')}:${appointmentTime.getMinutes().toString().padStart(2, '0')}`;
      });

      setOccupiedSlots(slots);
    } catch (error) {
      console.error('Erro ao buscar horários ocupados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar horários disponíveis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isTimeSlotAvailable = (time: string) => {
    return !occupiedSlots.includes(time);
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Domingo = 0, Sábado = 6
  };

  return (
    <Card className="pet-card border-0 shadow-xl max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Data e Horário</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendário */}
          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-4 block">
              Selecione a Data
            </Label>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                disabled={(date) => isPastDate(date) || isWeekend(date)}
                className="rounded-md"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Atendemos de segunda a sexta-feira
            </p>
          </div>

          {/* Horários */}
          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-4 block">
              Selecione o Horário
            </Label>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-3">
                {availableHours.map((time) => {
                  const isAvailable = isTimeSlotAvailable(time);
                  const isSelected = selectedTime === time;
                  
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => onTimeSelect(time)}
                      disabled={!isAvailable || loading}
                      className={`h-12 ${
                        isSelected 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : isAvailable 
                            ? 'border-gray-300 hover:bg-green-50 hover:border-green-300' 
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {time}
                      {!isAvailable && (
                        <span className="ml-2 text-xs">(Ocupado)</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Selecione uma data primeiro</p>
              </div>
            )}
            
            {loading && (
              <p className="text-sm text-blue-600 mt-2">
                Verificando disponibilidade...
              </p>
            )}
          </div>
        </div>

        {/* Observações */}
        <div className="mt-8">
          <Label htmlFor="observacoes" className="text-lg font-semibold text-gray-700 mb-4 block">
            Observações (Opcional)
          </Label>
          <Textarea
            id="observacoes"
            placeholder="Alguma observação especial sobre seu pet ou preferências..."
            value={observacoes}
            onChange={(e) => onObservacoesChange(e.target.value)}
            rows={4}
            className="border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="flex justify-between mt-8">
          <Button onClick={onBack} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={onNext}
            disabled={!selectedDate || !selectedTime}
            className="pet-button-primary"
          >
            Continuar
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
