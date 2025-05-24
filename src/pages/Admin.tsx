
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, Calendar, Settings, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { AppointmentsManager } from '@/components/admin/AppointmentsManager';

const Admin = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="border-b bg-white/95 backdrop-blur-sm shadow-sm border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar à Loja</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Painel Administrativo</h1>
                  <p className="text-slate-600">PetShop Canabrava</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/90 backdrop-blur-sm border border-slate-200">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700"
              >
                <BarChart className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700"
              >
                <Package className="w-4 h-4" />
                <span>Produtos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700"
              >
                <Settings className="w-4 h-4" />
                <span>Serviços</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendamentos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h2>
                <p className="text-slate-600">Visão geral do seu negócio</p>
              </div>
              <DashboardStats />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Ações Rápidas</CardTitle>
                    <CardDescription className="text-slate-600">Funcionalidades mais utilizadas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Adicionar Produto
                    </Button>
                    <Button className="w-full border-slate-300 text-slate-700 hover:bg-slate-50" variant="outline">
                      Novo Agendamento
                    </Button>
                    <Button className="w-full border-slate-300 text-slate-700 hover:bg-slate-50" variant="outline">
                      Ver Pedidos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Atividade Recente</CardTitle>
                    <CardDescription className="text-slate-600">Últimas movimentações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                        <span className="text-sm text-slate-700">Novo produto cadastrado</span>
                        <span className="text-xs text-slate-500">Há 2 horas</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                        <span className="text-sm text-slate-700">Agendamento confirmado</span>
                        <span className="text-xs text-slate-500">Há 4 horas</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                        <span className="text-sm text-slate-700">Pedido finalizado</span>
                        <span className="text-xs text-slate-500">Há 6 horas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="services">
              <ServicesManager />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentsManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
