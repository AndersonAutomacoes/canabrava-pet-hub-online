
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !orderId) {
        toast({
          title: "Erro",
          description: "Parâmetros de pagamento inválidos.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        // Verificar pagamento
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId, orderId }
        });

        if (verificationError) throw verificationError;

        if (verificationData.status === 'paid') {
          setPaymentVerified(true);
          
          // Buscar detalhes do pedido
          const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('*, pedido_itens(*, produtos(nome))')
            .eq('id', orderId)
            .single();

          if (!pedidoError && pedido) {
            setOrderDetails(pedido);
          }

          toast({
            title: "Pagamento confirmado!",
            description: "Seu pagamento foi processado com sucesso.",
          });
        } else {
          toast({
            title: "Pagamento pendente",
            description: "Seu pagamento ainda está sendo processado.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível verificar o pagamento.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId, toast]);

  if (loading) {
    return (
      <PageLayout
        title="Verificando Pagamento"
        subtitle="Aguarde enquanto confirmamos seu pagamento"
        containerSize="sm"
      >
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={paymentVerified ? "Pagamento Confirmado" : "Pagamento Pendente"}
      subtitle={paymentVerified ? "Seu pedido foi processado com sucesso" : "Verificando status do pagamento"}
      containerSize="md"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              paymentVerified ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {paymentVerified ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <CreditCard className="w-8 h-8 text-yellow-600" />
              )}
            </div>
            <CardTitle className={`text-2xl ${
              paymentVerified ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {paymentVerified ? 'Pagamento Confirmado!' : 'Pagamento em Processamento'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentVerified && orderDetails && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Detalhes do Pedido
                  </h3>
                  <p className="text-green-700">
                    <strong>Pedido:</strong> #{orderDetails.id.slice(-8)}<br/>
                    <strong>Total:</strong> R$ {orderDetails.total.toFixed(2)}<br/>
                    <strong>Status:</strong> Pago<br/>
                    <strong>Data:</strong> {new Date(orderDetails.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Itens do Pedido:</h4>
                  <div className="space-y-2">
                    {orderDetails.pedido_itens?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.produtos.nome}</span>
                        <span>Qtd: {item.quantidade} - R$ {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Você receberá um e-mail de confirmação em breve com todos os detalhes do seu pedido.
                  </p>
                </div>
              </div>
            )}

            {!paymentVerified && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">
                  Seu pagamento ainda está sendo processado. Isso pode levar alguns minutos.
                  Se o problema persistir, entre em contato com nosso suporte.
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button 
                onClick={() => window.location.href = '/produtos'}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Continuar Comprando
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;
