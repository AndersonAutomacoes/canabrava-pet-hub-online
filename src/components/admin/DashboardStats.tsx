
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Calendar, Users, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalProducts: number;
  totalAppointments: number;
  totalOrders: number;
  totalRevenue: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalAppointments: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar total de produtos
        const { count: productsCount } = await supabase
          .from('produtos')
          .select('*', { count: 'exact', head: true });

        // Buscar total de agendamentos
        const { count: appointmentsCount } = await supabase
          .from('consultaagendamentopet')
          .select('*', { count: 'exact', head: true });

        // Buscar total de pedidos
        const { count: ordersCount } = await supabase
          .from('pedidos')
          .select('*', { count: 'exact', head: true });

        // Buscar receita total
        const { data: revenue } = await supabase
          .from('pedidos')
          .select('total');

        const totalRevenue = revenue?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

        setStats({
          totalProducts: productsCount || 0,
          totalAppointments: appointmentsCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAppointments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
