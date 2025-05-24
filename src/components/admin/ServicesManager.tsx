
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
  cdServico: number;
  dsServico: string;
  vrServico: number;
  cdEmpresa: number;
  cdServicoPai: number | null;
}

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    dsServico: '',
    vrServico: 0,
    cdEmpresa: 1
  });
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Servico')
        .select('*')
        .order('dsServico');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços.",
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
      // Gerar um novo código único
      const { data: maxService } = await supabase
        .from('Servico')
        .select('cdServico')
        .order('cdServico', { ascending: false })
        .limit(1);

      const newCdServico = maxService && maxService.length > 0 ? maxService[0].cdServico + 1 : 1;

      const { error } = await supabase
        .from('Servico')
        .insert([{
          cdServico: newCdServico,
          ...formData
        }]);

      if (error) throw error;

      toast({
        title: "Serviço criado!",
        description: "O serviço foi criado com sucesso.",
      });

      setShowForm(false);
      setFormData({ dsServico: '', vrServico: 0, cdEmpresa: 1 });
      fetchServices();
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o serviço.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      const { error } = await supabase
        .from('Servico')
        .update(formData)
        .eq('cdServico', editingService.cdServico);

      if (error) throw error;

      toast({
        title: "Serviço atualizado!",
        description: "O serviço foi atualizado com sucesso.",
      });

      setShowForm(false);
      setEditingService(null);
      setFormData({ dsServico: '', vrServico: 0, cdEmpresa: 1 });
      fetchServices();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (cdServico: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await supabase
        .from('Servico')
        .delete()
        .eq('cdServico', cdServico);

      if (error) throw error;

      toast({
        title: "Serviço excluído!",
        description: "O serviço foi excluído com sucesso.",
      });

      fetchServices();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço.",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setFormData({
      dsServico: service.dsServico,
      vrServico: service.vrServico,
      cdEmpresa: service.cdEmpresa
    });
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingService(null);
    setFormData({ dsServico: '', vrServico: 0, cdEmpresa: 1 });
    setShowForm(true);
  };

  const filteredServices = services.filter(service =>
    service.dsServico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gerenciar Serviços</h2>
        <Button onClick={openCreateForm} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="bg-white border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-500" />
            <Input
              placeholder="Buscar serviços..."
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
                  <TableHead className="text-slate-700 font-semibold">Código</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Serviço</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Valor</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Empresa</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.cdServico} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="text-slate-700">{service.cdServico}</TableCell>
                    <TableCell className="font-medium text-slate-800">{service.dsServico}</TableCell>
                    <TableCell className="text-slate-700 font-medium">
                      {service.vrServico ? `R$ ${service.vrServico.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-slate-700">{service.cdEmpresa}</TableCell>
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
                          onClick={() => handleDeleteService(service.cdServico)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar/editar serviço */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
            <DialogDescription>
              {editingService ? 'Edite as informações do serviço' : 'Preencha as informações do novo serviço'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.dsServico}
                onChange={(e) => setFormData(prev => ({ ...prev, dsServico: e.target.value }))}
                className="col-span-3 bg-white"
                placeholder="Nome do serviço"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Valor
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.vrServico}
                onChange={(e) => setFormData(prev => ({ ...prev, vrServico: parseFloat(e.target.value) || 0 }))}
                className="col-span-3 bg-white"
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editingService ? handleUpdateService : handleCreateService}>
              {editingService ? 'Salvar Alterações' : 'Criar Serviço'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
