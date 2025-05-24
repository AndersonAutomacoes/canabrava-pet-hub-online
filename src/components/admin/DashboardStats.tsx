
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
      <Card className="admin-stat-card admin-stat-green">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">{stats.totalProducts}</div>
        </CardContent>
      </Card>

      <Card className="admin-stat-card admin-stat-blue">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Agendamentos</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">{stats.totalAppointments}</div>
        </CardContent>
      </Card>

      <Card className="admin-stat-card admin-stat-purple">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Total de Pedidos</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">{stats.totalOrders}</div>
        </CardContent>
      </Card>

      <Card className="admin-stat-card admin-stat-teal">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-teal-700">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-teal-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-800">R$ {stats.totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
