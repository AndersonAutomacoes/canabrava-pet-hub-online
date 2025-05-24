
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
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        setActiveTab('products');
        break;
      case 'new-appointment':
        setActiveTab('appointments');
        break;
      case 'view-orders':
        // Implementar quando houver aba de pedidos
        console.log('Ver pedidos - funcionalidade em desenvolvimento');
        break;
      default:
        break;
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="border-b bg-white/98 backdrop-blur-sm shadow-lg border-slate-200/80">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 text-slate-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar à Loja</span>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Painel Administrativo</h1>
                  <p className="text-slate-600 font-medium">PetShop Canabrava</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-slate-300 text-slate-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 rounded-xl"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md rounded-xl p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-lg font-medium"
              >
                <BarChart className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg font-medium"
              >
                <Package className="w-4 h-4" />
                <span>Produtos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 rounded-lg font-medium"
              >
                <Settings className="w-4 h-4" />
                <span>Serviços</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="flex items-center space-x-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 rounded-lg font-medium"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendamentos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-slate-800 mb-3 gradient-text">Dashboard</h2>
                <p className="text-slate-600 text-lg">Visão geral do seu negócio</p>
              </div>
              <DashboardStats />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="admin-card hover:shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Ações Rápidas</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600">Funcionalidades mais utilizadas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => handleQuickAction('add-product')}
                      className="w-full pet-button-gradient text-white hover:shadow-lg transition-all duration-200 rounded-xl"
                    >
                      Adicionar Produto
                    </Button>
                    <Button 
                      onClick={() => handleQuickAction('new-appointment')}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transition-all duration-200 rounded-xl"
                    >
                      Novo Agendamento
                    </Button>
                    <Button 
                      onClick={() => handleQuickAction('view-orders')}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white hover:shadow-lg transition-all duration-200 rounded-xl"
                    >
                      Ver Pedidos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="admin-card hover:shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Atividade Recente</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600">Últimas movimentações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
                        <span className="text-sm font-medium text-green-800">Novo produto cadastrado</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Há 2 horas</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                        <span className="text-sm font-medium text-blue-800">Agendamento confirmado</span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Há 4 horas</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors">
                        <span className="text-sm font-medium text-purple-800">Pedido finalizado</span>
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Há 6 horas</span>
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
