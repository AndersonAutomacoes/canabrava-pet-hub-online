import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CreditCard, MapPin, User, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FreteCalculator from './FreteCalculator';

const CheckoutFlow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    cep: '',
    endereco: '',
    cidade: 'Salvador',
    estado: 'BA',
    complemento: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [observations, setObservations] = useState('');
  const [freteValor, setFreteValor] = useState(0);
  const [fretePrazo, setFretePrazo] = useState(1);
  
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Calcular peso total dos produtos
  const pesoTotal = cartItems.reduce((total, item) => {
    const peso = item.produto.peso || 0.5; // peso padrão de 0.5kg se não especificado
    return total + (peso * item.quantidade);
  }, 0);

  const handleFreteCalculado = (valor: number, prazo: number) => {
    setFreteValor(valor);
    setFretePrazo(prazo);
  };

  const handleAddressSubmit = () => {
    if (!deliveryAddress.endereco || !deliveryAddress.cep) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha endereço e CEP.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      toast({
        title: "Método de pagamento",
        description: "Selecione um método de pagamento.",
        variant: "destructive",
      });
      return;
    }
    setStep(3);
  };

  const handleOrderConfirm = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Criar pedido com valor do frete incluído
      const subtotal = getCartTotal();
      const total = subtotal + freteValor;
      
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          user_id: user.id,
          total,
          endereco_entrega: `${deliveryAddress.endereco}, ${deliveryAddress.cidade}, ${deliveryAddress.estado}, ${deliveryAddress.cep}${deliveryAddress.complemento ? ` - ${deliveryAddress.complemento}` : ''}`,
          metodo_pagamento: paymentMethod,
          observacoes: observations || null,
          status: 'pendente'
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // Criar itens do pedido
      const pedidoItens = cartItems.map(item => ({
        pedido_id: pedido.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.produto.preco,
        subtotal: item.produto.preco * item.quantidade
      }));

      const { error: itensError } = await supabase
        .from('pedido_itens')
        .insert(pedidoItens);

      if (itensError) throw itensError;

      // Limpar carrinho
      await clearCart();
      
      setStep(4);
      
      toast({
        title: "Pedido confirmado!",
        description: `Seu pedido #${pedido.id.slice(-8)} foi criado com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Pedido Confirmado!
            </h2>
            <p className="text-gray-600 mb-6">
              Seu pedido foi processado com sucesso. Você receberá um e-mail de confirmação em breve.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/produtos'}
                className="bg-green-600 hover:bg-green-700 mr-4"
              >
                Continuar Comprando
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* ... keep existing code (step indicator) */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              <span className={`ml-2 ${step >= stepNumber ? 'text-green-600' : 'text-gray-600'}`}>
                {stepNumber === 1 && 'Endereço'}
                {stepNumber === 2 && 'Pagamento'}
                {stepNumber === 3 && 'Confirmação'}
              </span>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-4 ${
                  step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Endereço de Entrega</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="endereco">Endereço *</Label>
                    <Input
                      id="endereco"
                      value={deliveryAddress.endereco}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, endereco: e.target.value})}
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={deliveryAddress.cidade}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, cidade: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        value={deliveryAddress.estado}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, estado: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        value={deliveryAddress.cep}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, cep: e.target.value})}
                        placeholder="00000-000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={deliveryAddress.complemento}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, complemento: e.target.value})}
                        placeholder="Apt, casa, etc."
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddressSubmit} className="w-full bg-green-600 hover:bg-green-700">
                    Continuar para Pagamento
                  </Button>
                </CardContent>
              </Card>

              {/* Calculadora de Frete */}
              <FreteCalculator 
                pesoTotal={pesoTotal}
                onFreteCalculado={handleFreteCalculado}
              />
            </div>
          )}

          {/* ... keep existing code for steps 2 and 3 */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Método de Pagamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro na Entrega</SelectItem>
                  </SelectContent>
                </Select>

                <div>
                  <Label htmlFor="observations">Observações (opcional)</Label>
                  <Textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Informações adicionais sobre a entrega..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handlePaymentSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                    Revisar Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirmar Pedido</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                  <p className="text-gray-700">
                    {deliveryAddress.endereco}<br/>
                    {deliveryAddress.cidade}, {deliveryAddress.estado}<br/>
                    CEP: {deliveryAddress.cep}
                    {deliveryAddress.complemento && <><br/>{deliveryAddress.complemento}</>}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Método de Pagamento</h3>
                  <p className="text-gray-700">
                    {paymentMethod === 'pix' && 'PIX'}
                    {paymentMethod === 'cartao_credito' && 'Cartão de Crédito'}
                    {paymentMethod === 'cartao_debito' && 'Cartão de Débito'}
                    {paymentMethod === 'dinheiro' && 'Dinheiro na Entrega'}
                  </p>
                </div>

                {freteValor > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Entrega</h3>
                      <p className="text-gray-700">
                        Frete: R$ {freteValor.toFixed(2)} - {fretePrazo === 1 ? '24 horas' : `${fretePrazo} dias úteis`}
                      </p>
                    </div>
                  </>
                )}

                {observations && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Observações</h3>
                      <p className="text-gray-700">{observations}</p>
                    </div>
                  </>
                )}

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleOrderConfirm} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo do Pedido - Atualizado com frete */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.produto.nome}</p>
                    <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                  </div>
                  <p className="font-semibold">
                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>R$ {getCartTotal().toFixed(2)}</span>
              </div>
              
              {freteValor > 0 && (
                <div className="flex justify-between items-center">
                  <span>Frete:</span>
                  <span>R$ {freteValor.toFixed(2)}</span>
                </div>
              )}
              
              {freteValor === 0 && step > 1 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Frete:</span>
                  <span className="font-semibold">GRÁTIS</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">
                  R$ {(getCartTotal() + freteValor).toFixed(2)}
                </span>
              </div>

              {pesoTotal > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                  Peso total: {pesoTotal.toFixed(2)} kg
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
