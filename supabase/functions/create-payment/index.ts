
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

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      throw new Error("No authorization header provided");
    }

    logStep("Authorization header found", { headerPrefix: authHeader.substring(0, 20) });

    // Criar cliente Supabase usando service role key para operações administrativas
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { 
        auth: { 
          persistSession: false,
          autoRefreshToken: false
        } 
      }
    );

    // Verificar token do usuário de forma mais robusta
    const token = authHeader.replace("Bearer ", "");
    logStep("Attempting to verify user token", { tokenPrefix: token.substring(0, 20) });
    
    let user;
    try {
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      
      if (userError) {
        logStep("Auth error details", { 
          errorMessage: userError.message, 
          errorCode: userError.status,
          errorName: userError.name 
        });
        throw new Error(`Authentication error: ${userError.message}`);
      }
      
      user = userData.user;
      if (!user) {
        logStep("No user data returned from token verification");
        throw new Error("User not found in token");
      }
      
      if (!user.email) {
        logStep("User found but no email available", { userId: user.id });
        throw new Error("User email not available");
      }
      
      logStep("User authenticated successfully", { 
        userId: user.id, 
        email: user.email,
        emailVerified: user.email_confirmed_at ? true : false
      });
      
    } catch (authError) {
      logStep("Token verification failed", { error: authError.message });
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    const requestBody = await req.json();
    const { pedidoId } = requestBody;
    
    if (!pedidoId) {
      logStep("ERROR: No order ID provided");
      throw new Error("Order ID is required");
    }

    logStep("Processing payment for order", { pedidoId, userId: user.id });

    // Buscar detalhes do pedido
    const { data: pedido, error: pedidoError } = await supabaseClient
      .from('pedidos')
      .select('*, pedido_itens(*, produtos(nome, preco))')
      .eq('id', pedidoId)
      .eq('user_id', user.id)
      .single();

    if (pedidoError) {
      logStep("Database error when fetching order", { error: pedidoError.message });
      throw new Error(`Database error: ${pedidoError.message}`);
    }
    
    if (!pedido) {
      logStep("Order not found", { pedidoId, userId: user.id });
      throw new Error("Order not found or access denied");
    }

    logStep("Order found", { 
      orderId: pedido.id,
      total: pedido.total, 
      itemsCount: pedido.pedido_itens?.length,
      currentStatus: pedido.status
    });

    // Verificar se a chave secreta do Stripe está configurada
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      logStep("ERROR: Stripe secret key not configured");
      throw new Error("Stripe secret key not configured");
    }

    // Verificar se não é uma chave pública
    if (stripeSecretKey.startsWith("pk_")) {
      logStep("ERROR: Publishable key provided instead of secret key");
      throw new Error("Cannot use publishable key. Please use secret key (starts with sk_)");
    }

    // Log apenas os primeiros caracteres da chave para segurança
    logStep("Stripe secret key verified", { keyPrefix: stripeSecretKey.substring(0, 7) });

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Verificar se cliente já existe no Stripe
    let customerId;
    try {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing Stripe customer found", { customerId });
      } else {
        logStep("No existing Stripe customer found, will create during checkout");
      }
    } catch (stripeError) {
      logStep("Error checking Stripe customer", { error: stripeError.message });
      // Continue sem customer ID, será criado automaticamente
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

    if (lineItems.length === 0) {
      logStep("ERROR: No line items found for order");
      throw new Error("Order has no items");
    }

    logStep("Line items created", { itemsCount: lineItems.length });

    // Criar sessão de checkout
    const sessionConfig = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment" as const,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${pedidoId}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        order_id: pedidoId,
        user_id: user.id,
      },
    };

    logStep("Creating Stripe checkout session", { 
      hasCustomer: !!customerId,
      customerEmail: user.email,
      itemsCount: lineItems.length
    });

    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionConfig);
      logStep("Checkout session created successfully", { 
        sessionId: session.id, 
        url: session.url 
      });
    } catch (stripeError) {
      logStep("Error creating Stripe checkout session", { error: stripeError.message });
      throw new Error(`Stripe error: ${stripeError.message}`);
    }

    // Atualizar pedido com session ID
    try {
      const { error: updateError } = await supabaseClient
        .from('pedidos')
        .update({ 
          stripe_payment_intent_id: session.id,
          status: 'aguardando_pagamento'
        })
        .eq('id', pedidoId);

      if (updateError) {
        logStep("Error updating order with session ID", { error: updateError.message });
        throw new Error(`Database update error: ${updateError.message}`);
      }

      logStep("Order updated with session ID", { pedidoId, sessionId: session.id });
    } catch (dbError) {
      logStep("Database error during order update", { error: dbError.message });
      // Continue mesmo se a atualização falhar, a sessão foi criada
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-payment", { 
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
