
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { OrderStatusSelect } from './OrderStatusSelect';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Order {
  id: string;
  user_id: string;
  created_at: string;
  total: number;
  endereco_entrega: string;
  metodo_pagamento: string;
  status: string;
  observacoes?: string;
  customer_name?: string;
  customer_email?: string;
}

interface OrderHistory {
  id: string;
  status_anterior: string;
  status_novo: string;
  created_at: string;
  observacoes: string;
}

export const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // First get all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Then get profiles data separately and merge
      const userIds = ordersData?.map(order => order.user_id).filter(Boolean) || [];
      let profilesData: any[] = [];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, nome, email')
          .in('id', userIds);
        
        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Merge orders with profile data
      const ordersWithProfiles = (ordersData || []).map(order => {
        const profile = profilesData.find(p => p.id === order.user_id);
        return {
          ...order,
          customer_name: profile?.nome || 'Cliente não encontrado',
          customer_email: profile?.email || 'Email não disponível'
        };
      });
      
      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso.",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido.",
        variant: "destructive",
      });
    }
  };

  const fetchOrderHistory = async (orderId: string) => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedido_historico')
        .select('*')
        .eq('pedido_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrderHistory(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico do pedido.",
        variant: "destructive",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const customerName = order.customer_name?.toLowerCase() || '';
    const customerEmail = order.customer_email?.toLowerCase() || '';
    const orderStatus = order.status.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return customerName.includes(searchLower) ||
           customerEmail.includes(searchLower) ||
           orderStatus.includes(searchLower);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pago':
      case 'entregue':
      case 'concluido':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'em_preparacao':
      case 'postado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelado':
      case 'erro_pagamento':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'em_processo_estorno':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'estornado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Pedidos</h2>
      </div>

      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="bg-white border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-500" />
            <Input
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 border-b border-slate-200 hover:bg-slate-100">
                  <TableHead className="text-slate-700 font-semibold">Pedido</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Cliente</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Data</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Total</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Pagamento</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-800">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-800">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {order.customer_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-slate-700 font-medium">
                      R$ {order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusSelect
                        currentStatus={order.status}
                        onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                      />
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {order.metodo_pagamento || 'Não informado'}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchOrderHistory(order.id)}
                          >
                            <History className="w-4 h-4 mr-2" />
                            Histórico
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Histórico do Pedido #{order.id.slice(0, 8)}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {historyLoading ? (
                              <div className="flex justify-center py-4">
                                <LoadingSpinner />
                              </div>
                            ) : orderHistory.length > 0 ? (
                              <div className="space-y-3">
                                {orderHistory.map((history) => (
                                  <div key={history.id} className="border rounded-lg p-3 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium">
                                          {history.status_anterior ? 
                                            `${history.status_anterior} → ${history.status_novo}` : 
                                            `Status inicial: ${history.status_novo}`
                                          }
                                        </div>
                                        {history.observacoes && (
                                          <div className="text-sm text-gray-600 mt-1">
                                            {history.observacoes}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(history.created_at).toLocaleString('pt-BR')}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                Nenhum histórico encontrado.
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
