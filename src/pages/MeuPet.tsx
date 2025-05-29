
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Activity, Scissors, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, formatDateTime } from '@/utils/dateFormatters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Pet {
  cdPet: number;
  nmPet: string;
  nmRaca?: string;
  dsPorte?: string;
  nuIdade?: number;
  dtNascimento?: string;
}

interface Agendamento {
  cdAgendamento: number;
  dtStart: string;
  flComparecimento: boolean;
  cdPet: number;
  servico?: {
    dsservico: string;
  };
}

const MeuPet = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPetData();
    }
  }, [user]);

  const fetchPetData = async () => {
    if (!user) return;

    try {
      // Buscar cliente pelo user_id
      const { data: clienteData } = await supabase
        .from('Clientes')
        .select('cdCliente')
        .eq('nuTelefoneWhatsapp', user.phone || user.id)
        .single();

      if (clienteData) {
        const cdCliente = clienteData.cdCliente;

        // Buscar pets do cliente
        const { data: petsData, error: petsError } = await supabase
          .from('Pet')
          .select('*')
          .eq('cdCliente', cdCliente)
          .order('nmPet');

        if (petsError) throw petsError;

        // Buscar agendamentos do cliente com informações do serviço
        const { data: agendamentosData, error: agendamentosError } = await supabase
          .from('Agendamento')
          .select(`
            cdAgendamento,
            dtStart,
            flComparecimento,
            cdPet,
            cdServico
          `)
          .eq('cdCliente', cdCliente)
          .order('dtStart', { ascending: false });

        if (agendamentosError) throw agendamentosError;

        // Buscar informações dos serviços separadamente
        if (agendamentosData && agendamentosData.length > 0) {
          const servicoIds = [...new Set(agendamentosData.map(a => a.cdServico))];
          const { data: servicosData } = await supabase
            .from('servico')
            .select('cdservico, dsservico')
            .in('cdservico', servicoIds);

          // Combinar agendamentos com serviços
          const agendamentosComServicos = agendamentosData.map(agendamento => ({
            ...agendamento,
            servico: servicosData?.find(s => s.cdservico === agendamento.cdServico)
          }));

          setAgendamentos(agendamentosComServicos);
        } else {
          setAgendamentos([]);
        }

        setPets(petsData || []);
      } else {
        // Se não encontrou cliente, criar um novo
        const { data: newCliente, error: clienteError } = await supabase
          .from('Clientes')
          .insert({
            dsNome: user.email?.split('@')[0] || 'Cliente',
            nuTelefoneWhatsapp: user.phone || user.id,
            cdEmpresa: 1
          })
          .select()
          .single();

        if (!clienteError) {
          setPets([]);
          setAgendamentos([]);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do pet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageLayout
        title="Meu Pet"
        subtitle="Área restrita para clientes"
        containerSize="sm"
      >
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Faça login para ver os dados do seu pet.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout title="Meu Pet" containerSize="lg">
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  const agendamentosRealizados = agendamentos.filter(a => a.flComparecimento).length;
  const proximosAgendamentos = agendamentos.filter(a => !a.flComparecimento).length;

  return (
    <PageLayout
      title="Meu Pet"
      subtitle="Informações e histórico do seu companheiro"
      breadcrumbs={[
        { label: 'Meu Pet', current: true }
      ]}
      containerSize="lg"
    >
      <div className="space-y-8">
        {/* Pets Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.length > 0 ? pets.map((pet) => (
            <Card key={pet.cdPet} className="overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🐕</span>
                </div>
                <CardTitle className="text-xl">{pet.nmPet}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pet.nmRaca && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raça:</span>
                    <span className="font-medium">{pet.nmRaca}</span>
                  </div>
                )}
                {pet.dsPorte && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Porte:</span>
                    <Badge variant="secondary">{pet.dsPorte}</Badge>
                  </div>
                )}
                {pet.nuIdade && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Idade:</span>
                    <span className="font-medium">{pet.nuIdade} anos</span>
                  </div>
                )}
                {pet.dtNascimento && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nascimento:</span>
                    <span className="font-medium">{formatDate(pet.dtNascimento)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )) : (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhum pet cadastrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Cadastre seu primeiro pet para começar a usar nossos serviços.
                </p>
                <Button onClick={() => window.location.href = '/agendamento'}>
                  Cadastrar Pet
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Histórico de Agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Histórico de Serviços</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agendamentos.length > 0 ? (
              <div className="space-y-4">
                {agendamentos.map((agendamento) => {
                  const pet = pets.find(p => p.cdPet === agendamento.cdPet);
                  return (
                    <div 
                      key={agendamento.cdAgendamento}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Scissors className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {agendamento.servico?.dsservico || 'Serviço não identificado'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Pet: {pet?.nmPet} • {formatDateTime(agendamento.dtStart)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={agendamento.flComparecimento ? "default" : "secondary"}
                        className={agendamento.flComparecimento ? "bg-green-600" : ""}
                      >
                        {agendamento.flComparecimento ? "Realizado" : "Agendado"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Nenhum serviço encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Seu pet ainda não tem histórico de serviços.
                </p>
                <Button onClick={() => window.location.href = '/agendamento'}>
                  Agendar Serviço
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="text-center py-6">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{pets.length}</h3>
              <p className="text-gray-600">Pets Cadastrados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center py-6">
              <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{agendamentosRealizados}</h3>
              <p className="text-gray-600">Serviços Realizados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center py-6">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{proximosAgendamentos}</h3>
              <p className="text-gray-600">Próximos Agendamentos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default MeuPet;
