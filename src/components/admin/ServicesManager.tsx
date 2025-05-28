
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Servico {
  cdservico: number;
  dsservico: string;
  vrservico: number | null;
  cdservicopai: number | null;
  cdempresa: number;
}

export const ServicesManager = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    dsservico: '',
    vrservico: '',
    cdservicopai: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servico')
        .select('*')
        .order('dsservico');

      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: "Erro ao carregar serviços",
        description: "Não foi possível carregar a lista de serviços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (servico: Servico) => {
    try {
      const { error } = await supabase
        .from('servico')
        .update({
          dsservico: servico.dsservico,
          vrservico: servico.vrservico,
          cdservicopai: servico.cdservicopai
        })
        .eq('cdservico', servico.cdservico);

      if (error) throw error;

      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso.",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      setEditingId(null);
      fetchServicos();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: "Erro ao atualizar serviço",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await supabase
        .from('servico')
        .delete()
        .eq('cdservico', id);

      if (error) throw error;

      toast({
        title: "Serviço excluído",
        description: "O serviço foi excluído com sucesso.",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      fetchServicos();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: "Erro ao excluir serviço",
        description: "Não foi possível excluir o serviço.",
        variant: "destructive",
      });
    }
  };

  const handleAddService = async () => {
    try {
      const { error } = await supabase
        .from('servico')
        .insert([{
          dsservico: formData.dsservico,
          vrservico: formData.vrservico ? parseFloat(formData.vrservico) : null,
          cdservicopai: formData.cdservicopai ? parseInt(formData.cdservicopai) : null,
          cdempresa: 1
        }]);

      if (error) throw error;

      toast({
        title: "Serviço adicionado",
        description: "O novo serviço foi adicionado com sucesso.",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      setFormData({ dsservico: '', vrservico: '', cdservicopai: '' });
      setShowAddForm(false);
      fetchServicos();
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: "Erro ao adicionar serviço",
        description: "Não foi possível adicionar o serviço.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="pet-card border-0 shadow-medium">
        <CardContent className="p-6">
          <div className="text-center">Carregando serviços...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="pet-card border-0 shadow-medium">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciar Serviços</CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="secondary"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Adicionar Novo Serviço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="new-dsservico">Nome do Serviço</Label>
                  <Input
                    id="new-dsservico"
                    value={formData.dsservico}
                    onChange={(e) => setFormData({ ...formData, dsservico: e.target.value })}
                    placeholder="Ex: Banho e Tosa"
                  />
                </div>
                <div>
                  <Label htmlFor="new-vrservico">Valor (R$)</Label>
                  <Input
                    id="new-vrservico"
                    type="number"
                    step="0.01"
                    value={formData.vrservico}
                    onChange={(e) => setFormData({ ...formData, vrservico: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="new-cdservicopai">Serviço Pai (ID)</Label>
                  <Input
                    id="new-cdservicopai"
                    type="number"
                    value={formData.cdservicopai}
                    onChange={(e) => setFormData({ ...formData, cdservicopai: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddService} className="pet-button-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ dsservico: '', vrservico: '', cdservicopai: '' });
                  }}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {servicos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum serviço encontrado.
              </div>
            ) : (
              servicos.map((servico) => (
                <div key={servico.cdservico} className="border rounded-lg p-4 bg-white">
                  {editingId === servico.cdservico ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Nome do Serviço</Label>
                        <Input
                          value={servico.dsservico}
                          onChange={(e) => {
                            const updated = servicos.map(s => 
                              s.cdservico === servico.cdservico 
                                ? { ...s, dsservico: e.target.value }
                                : s
                            );
                            setServicos(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Valor (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={servico.vrservico || ''}
                          onChange={(e) => {
                            const updated = servicos.map(s => 
                              s.cdservico === servico.cdservico 
                                ? { ...s, vrservico: e.target.value ? parseFloat(e.target.value) : null }
                                : s
                            );
                            setServicos(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Serviço Pai</Label>
                        <Input
                          type="number"
                          value={servico.cdservicopai || ''}
                          onChange={(e) => {
                            const updated = servicos.map(s => 
                              s.cdservico === servico.cdservico 
                                ? { ...s, cdservicopai: e.target.value ? parseInt(e.target.value) : null }
                                : s
                            );
                            setServicos(updated);
                          }}
                        />
                      </div>
                      <div className="flex items-end space-x-2">
                        <Button
                          onClick={() => handleSave(servico)}
                          size="sm"
                          className="pet-button-primary"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <div>
                          <span className="font-medium">{servico.dsservico}</span>
                          <p className="text-sm text-gray-600">ID: {servico.cdservico}</p>
                        </div>
                        <div>
                          <span className="text-green-600 font-semibold">
                            {servico.vrservico ? `R$ ${servico.vrservico.toFixed(2)}` : 'Não informado'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Pai: {servico.cdservicopai || 'Nenhum'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingId(servico.cdservico)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(servico.cdservico)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
