
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { pedidoId } = await req.json();
    if (!pedidoId) throw new Error("Order ID is required");

    logStep("Processing payment for order", { pedidoId });

    // Buscar detalhes do pedido
    const { data: pedido, error: pedidoError } = await supabaseClient
      .from('pedidos')
      .select('*, pedido_itens(*, produtos(nome, preco))')
      .eq('id', pedidoId)
      .eq('user_id', user.id)
      .single();

    if (pedidoError || !pedido) throw new Error("Order not found");

    logStep("Order found", { total: pedido.total, itemsCount: pedido.pedido_itens?.length });

    // Verificar se a chave secreta do Stripe está configurada
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    // Verificar se não é uma chave pública
    if (stripeSecretKey.startsWith("pk_")) {
      throw new Error("Cannot use publishable key. Please use secret key (starts with sk_)");
    }

    logStep("Stripe secret key verified", { keyType: stripeSecretKey.substring(0, 3) });

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Verificar se cliente já existe no Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    } else {
      logStep("Creating new Stripe customer");
    }

    // Criar line items baseado nos itens do pedido
    const lineItems = pedido.pedido_itens?.map((item: any) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.produtos.nome,
        },
        unit_amount: Math.round(item.preco_unitario * 100), // Converter para centavos
      },
      quantity: item.quantidade,
    })) || [];

    logStep("Line items created", { itemsCount: lineItems.length });

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${pedidoId}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        order_id: pedidoId,
        user_id: user.id,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Atualizar pedido com session ID
    await supabaseClient
      .from('pedidos')
      .update({ 
        stripe_payment_intent_id: session.id,
        status: 'aguardando_pagamento'
      })
      .eq('id', pedidoId);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
