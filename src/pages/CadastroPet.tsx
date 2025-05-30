
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PawPrint, ArrowLeft } from 'lucide-react';

const CadastroPet = () => {
  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState({
    nome: '',
    raca: '',
    idade: '',
    porte: 'PEQUENO',
    documento: '',
    dataNascimento: ''
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para cadastrar um pet.",
        variant: "destructive",
      });
      return;
    }

    if (!petData.nome) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do pet é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Buscar ou criar cliente
      let clienteId;
      const { data: clienteData } = await supabase
        .from('Clientes')
        .select('cdCliente')
        .eq('nuTelefoneWhatsapp', user.phone || user.id)
        .single();

      if (clienteData) {
        clienteId = clienteData.cdCliente;
      } else {
        const { data: newCliente, error: clienteError } = await supabase
          .from('Clientes')
          .insert({
            dsNome: user.email?.split('@')[0] || 'Cliente',
            nuTelefoneWhatsapp: user.phone || user.id,
            cdEmpresa: 1
          })
          .select()
          .single();

        if (clienteError) throw clienteError;
        clienteId = newCliente.cdCliente;
      }

      // Obter próximo ID para o pet
      const { data: maxPetData } = await supabase
        .from('Pet')
        .select('cdPet')
        .order('cdPet', { ascending: false })
        .limit(1);

      const nextPetId = maxPetData && maxPetData.length > 0 ? maxPetData[0].cdPet + 1 : 1;

      // Criar pet
      const { error: petError } = await supabase
        .from('Pet')
        .insert({
          cdPet: nextPetId,
          cdCliente: clienteId,
          nmPet: petData.nome,
          nmRaca: petData.raca || null,
          nuIdade: petData.idade ? parseInt(petData.idade) : null,
          dtNascimento: petData.dataNascimento || null,
          dsDocumento: petData.documento || null,
          dsPorte: petData.porte
        });

      if (petError) throw petError;

      toast({
        title: "Pet cadastrado!",
        description: "O pet foi cadastrado com sucesso.",
      });

      // Limpar formulário
      setPetData({
        nome: '',
        raca: '',
        idade: '',
        porte: 'PEQUENO',
        documento: '',
        dataNascimento: ''
      });

    } catch (error) {
      console.error('Erro ao cadastrar pet:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o pet. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto pet-card border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle>Login Necessário</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">Para cadastrar um pet, você precisa estar logado.</p>
              <Button className="w-full pet-button-primary" onClick={() => window.location.href = '/auth'}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Cadastrar Pet
              </h1>
              <p className="text-gray-600">
                Adicione as informações do seu pet
              </p>
            </div>
          </div>

          <Card className="pet-card border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <PawPrint className="w-5 h-5" />
                <span>Informações do Pet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nome" className="text-slate-700 font-medium">
                      Nome do Pet *
                    </Label>
                    <Input
                      id="nome"
                      type="text"
                      value={petData.nome}
                      onChange={(e) => setPetData({...petData, nome: e.target.value})}
                      placeholder="Nome do seu pet"
                      className="bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="raca" className="text-slate-700 font-medium">
                      Raça
                    </Label>
                    <Input
                      id="raca"
                      type="text"
                      value={petData.raca}
                      onChange={(e) => setPetData({...petData, raca: e.target.value})}
                      placeholder="Raça do pet"
                      className="bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="idade" className="text-slate-700 font-medium">
                      Idade (anos)
                    </Label>
                    <Input
                      id="idade"
                      type="number"
                      value={petData.idade}
                      onChange={(e) => setPetData({...petData, idade: e.target.value})}
                      placeholder="Idade em anos"
                      min="0"
                      max="30"
                      className="bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="porte" className="text-slate-700 font-medium">
                      Porte
                    </Label>
                    <Select value={petData.porte} onValueChange={(value) => setPetData({...petData, porte: value})}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-300 shadow-lg z-50">
                        <SelectItem value="PEQUENO">Pequeno</SelectItem>
                        <SelectItem value="MEDIO">Médio</SelectItem>
                        <SelectItem value="GRANDE">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dataNascimento" className="text-slate-700 font-medium">
                      Data de Nascimento
                    </Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={petData.dataNascimento}
                      onChange={(e) => setPetData({...petData, dataNascimento: e.target.value})}
                      className="bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="documento" className="text-slate-700 font-medium">
                      Documento/Chip
                    </Label>
                    <Input
                      id="documento"
                      type="text"
                      value={petData.documento}
                      onChange={(e) => setPetData({...petData, documento: e.target.value})}
                      placeholder="Número do chip ou documento"
                      className="bg-white border-slate-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => window.history.back()}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 pet-button-primary"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar Pet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CadastroPet;
