
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ORDER_STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'pago', label: 'Pago', color: 'bg-green-100 text-green-800' },
  { value: 'erro_pagamento', label: 'Erro Pagamento', color: 'bg-red-100 text-red-800' },
  { value: 'em_preparacao', label: 'Em Preparação', color: 'bg-blue-100 text-blue-800' },
  { value: 'postado', label: 'Postado', color: 'bg-purple-100 text-purple-800' },
  { value: 'entregue', label: 'Entregue', color: 'bg-green-100 text-green-800' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  { value: 'em_processo_estorno', label: 'Em Processo de Estorno', color: 'bg-orange-100 text-orange-800' },
  { value: 'estornado', label: 'Estornado', color: 'bg-gray-100 text-gray-800' },
  { value: 'concluido', label: 'Concluído', color: 'bg-emerald-100 text-emerald-800' }
];

interface OrderStatusSelectProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
  disabled?: boolean;
}

export const OrderStatusSelect: React.FC<OrderStatusSelectProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false
}) => {
  const currentStatusOption = ORDER_STATUS_OPTIONS.find(option => option.value === currentStatus);

  return (
    <div className="flex items-center space-x-2">
      <Badge className={currentStatusOption?.color || 'bg-gray-100 text-gray-800'}>
        {currentStatusOption?.label || currentStatus}
      </Badge>
      <Select
        value={currentStatus}
        onValueChange={onStatusChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Alterar status" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center space-x-2">
                <Badge className={option.color} variant="secondary">
                  {option.label}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
