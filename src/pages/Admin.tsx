
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { OrdersManager } from '@/components/admin/OrdersManager';
import { AppointmentsManager } from '@/components/admin/AppointmentsManager';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { BlogManager } from '@/components/admin/BlogManager';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Package, ShoppingCart, Calendar, Settings, PenTool, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Painel Administrativo</h1>
              <p className="text-gray-600 mt-2">Gerencie seu PetShop Canabrava</p>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white shadow-medium rounded-lg p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Produtos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Agendamentos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Serviços</span>
              </TabsTrigger>
              <TabsTrigger 
                value="blog" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                <PenTool className="w-4 h-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Card className="pet-card border-0 shadow-medium">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Resumo Geral</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Acompanhe o desempenho do seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <DashboardStats />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersManager />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentsManager />
            </TabsContent>

            <TabsContent value="services">
              <ServicesManager />
            </TabsContent>

            <TabsContent value="blog">
              <BlogManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
