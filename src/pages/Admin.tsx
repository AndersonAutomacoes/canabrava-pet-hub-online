
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, Package, Calendar, ShoppingBag, Settings, ArrowLeft } from 'lucide-react';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { AppointmentsManager } from '@/components/admin/AppointmentsManager';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { OrdersManager } from '@/components/admin/OrdersManager';
import { BlogManager } from '@/components/admin/BlogManager';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-slate-800">Painel Administrativo</h1>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Site</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white border border-slate-200 shadow-sm">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center space-x-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Agendamentos</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center space-x-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center space-x-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Produtos</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center space-x-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <DashboardStats />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <AppointmentsManager />
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <ServicesManager />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrdersManager />
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <BlogManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
