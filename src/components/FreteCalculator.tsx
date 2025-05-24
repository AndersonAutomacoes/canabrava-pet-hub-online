
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Calculator, Clock } from 'lucide-react';
import { useFreteCalculator } from '@/hooks/useFreteCalculator';

interface FreteCalculatorProps {
  pesoTotal: number;
  onFreteCalculado?: (valor: number, prazo: number) => void;
}

const FreteCalculator: React.FC<FreteCalculatorProps> = ({ 
  pesoTotal, 
  onFreteCalculado 
}) => {
  const [cep, setCep] = useState('');
  const { calcularFrete, freteCalculado, loading, formatarCEP } = useFreteCalculator();

  useEffect(() => {
    if (freteCalculado && onFreteCalculado) {
      onFreteCalculado(freteCalculado.valor, freteCalculado.prazo);
    }
  }, [freteCalculado, onFreteCalculado]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const cepFormatado = formatarCEP(valor);
    setCep(cepFormatado);
  };

  const handleCalcular = () => {
    calcularFrete(cep, pesoTotal);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalcular();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Calcular Frete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="cep">CEP de entrega</Label>
            <Input
              id="cep"
              placeholder="00000-000"
              value={cep}
              onChange={handleCepChange}
              onKeyPress={handleKeyPress}
              maxLength={9}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleCalcular}
              disabled={loading || cep.length < 9}
              className="bg-green-600 hover:bg-green-700"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {loading ? 'Calculando...' : 'Calcular'}
            </Button>
          </div>
        </div>

        {pesoTotal > 0 && (
          <div className="text-sm text-gray-600">
            Peso total da encomenda: {pesoTotal.toFixed(2)} kg
          </div>
        )}

        {freteCalculado && (
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-green-800">
                {freteCalculado.descricao}
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {freteCalculado.valor === 0 ? 'GRÁTIS' : `R$ ${freteCalculado.valor.toFixed(2)}`}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-green-700">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {freteCalculado.prazo === 1 
                    ? '24 horas' 
                    : `${freteCalculado.prazo} dias úteis`
                  }
                </span>
              </div>
              
              {freteCalculado.peso_total > 0 && (
                <div className="text-xs">
                  Peso: {freteCalculado.peso_total.toFixed(2)} kg
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FreteCalculator;
