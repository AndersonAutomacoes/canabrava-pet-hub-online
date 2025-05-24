import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Service {
  cdservico: number;
  dsservico: string;
  vrservico: number | null;
  cdempresa: number;
  cdservicopai: number | null;
}

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    dsservico: '',
    vrservico: 0,
    cdempresa: 1
  });
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      console.log('Iniciando busca de serviços...');
      
      // Tentativa mais simples de buscar dados
      const { data, error } = await supabase
        .from('servico')
        .select('*')
        .order('dsservico');

      console.log('Resultado da query:', { data, error });

      if (error) {
        console.error('Erro detalhado:', error);
        toast({
          title: "Erro",
          description: `Erro ao carregar serviços: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Serviços carregados com sucesso:', data);
      setServices(data || []);
      
      toast({
        title: "Sucesso",
        description: `${(data || []).length} serviços carregados.`,
      });
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar os serviços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async () => {
    try {
      if (!formData.dsservico.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome do serviço é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      console.log('Criando serviço:', formData);
      
      const serviceData = {
        dsservico: formData.dsservico.trim(),
        vrservico: formData.vrservico > 0 ? formData.vrservico : null,
        cdempresa: formData.cdempresa,
        cdservicopai: null
      };

      console.log('Dados para inserção:', serviceData);

      const { data, error } = await supabase
        .from('servico')
        .insert([serviceData])
        .select();

      console.log('Resultado da inserção:', { data, error });

      if (error) {
        console.error('Erro ao criar serviço:', error);
        toast({
          title: "Erro",
          description: `Erro ao criar serviço: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Serviço criado!",
        description: "O serviço foi criado com sucesso.",
      });

      setShowForm(false);
      setFormData({ dsservico: '', vrservico: 0, cdempresa: 1 });
      await fetchServices();
    } catch (error) {
      console.error('Erro inesperado ao criar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar o serviço.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      if (!formData.dsservico.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O nome do serviço é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      console.log('Atualizando serviço:', editingService.cdservico, formData);
      
      const updateData = {
        dsservico: formData.dsservico.trim(),
        vrservico: formData.vrservico > 0 ? formData.vrservico : null,
        cdempresa: formData.cdempresa
      };

      const { data, error } = await supabase
        .from('servico')
        .update(updateData)
        .eq('cdservico', editingService.cdservico)
        .select();

      console.log('Resultado da atualização:', { data, error });

      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        toast({
          title: "Erro",
          description: `Erro ao atualizar serviço: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Serviço atualizado!",
        description: "O serviço foi atualizado com sucesso.",
      });

      setShowForm(false);
      setEditingService(null);
      setFormData({ dsservico: '', vrservico: 0, cdempresa: 1 });
      await fetchServices();
    } catch (error) {
      console.error('Erro inesperado ao atualizar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar o serviço.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (cdservico: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      console.log('Excluindo serviço:', cdservico);
      
      const { error } = await supabase
        .from('servico')
        .delete()
        .eq('cdservico', cdservico);

      console.log('Resultado da exclusão:', { error });

      if (error) {
        console.error('Erro ao excluir serviço:', error);
        toast({
          title: "Erro",
          description: `Erro ao excluir serviço: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Serviço excluído!",
        description: "O serviço foi excluído com sucesso.",
      });

      await fetchServices();
    } catch (error) {
      console.error('Erro inesperado ao excluir serviço:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir o serviço.",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setFormData({
      dsservico: service.dsservico,
      vrservico: service.vrservico || 0,
      cdempresa: service.cdempresa
    });
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingService(null);
    setFormData({ dsservico: '', vrservico: 0, cdempresa: 1 });
    setShowForm(true);
  };

  const filteredServices = services.filter(service =>
    service.dsservico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">Gerenciar Serviços</h2>
        <Button onClick={openCreateForm} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <Card className="bg-white border-blue-200 shadow-lg">
        <CardHeader className="bg-white border-b border-blue-200">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-500" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500"
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
                <TableRow className="bg-blue-100 border-b border-blue-200 hover:bg-blue-100">
                  <TableHead className="text-blue-700 font-semibold">Código</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Serviço</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Valor</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Empresa</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.cdservico} className="border-b border-blue-100 hover:bg-blue-50">
                    <TableCell className="text-blue-700">{service.cdservico}</TableCell>
                    <TableCell className="font-medium text-blue-800">{service.dsservico}</TableCell>
                    <TableCell className="text-blue-700 font-medium">
                      {service.vrservico ? `R$ ${service.vrservico.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-blue-700">{service.cdempresa}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditForm(service)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteService(service.cdservico)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredServices.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Nenhum serviço encontrado com esse termo' : 'Nenhum serviço cadastrado'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px] bg-blue-50 border border-blue-300">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              {editingService ? 'Edite as informações do serviço' : 'Preencha as informações do novo serviço'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-blue-700">
                Nome *
              </Label>
              <Input
                id="name"
                value={formData.dsservico}
                onChange={(e) => setFormData(prev => ({ ...prev, dsservico: e.target.value }))}
                className="col-span-3 bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500 text-blue-800"
                placeholder="Nome do serviço"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right text-blue-700">
                Valor (R$)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.vrservico}
                onChange={(e) => setFormData(prev => ({ ...prev, vrservico: parseFloat(e.target.value) || 0 }))}
                className="col-span-3 bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500 text-blue-800"
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowForm(false)}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button 
              onClick={editingService ? handleUpdateService : handleCreateService}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingService ? 'Salvar Alterações' : 'Criar Serviço'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
