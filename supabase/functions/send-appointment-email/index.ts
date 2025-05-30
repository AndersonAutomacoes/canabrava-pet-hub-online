
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailRequest {
  agendamentoId: number;
  clienteEmail: string;
  petNome: string;
  servicoNome: string;
  dataHora: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agendamentoId, clienteEmail, petNome, servicoNome, dataHora }: AppointmentEmailRequest = await req.json();

    console.log('Enviando email de confirmação de agendamento:', {
      agendamentoId,
      clienteEmail,
      petNome,
      servicoNome,
      dataHora
    });

    const emailResponse = await resend.emails.send({
      from: "PetShop <onboarding@resend.dev>",
      to: [clienteEmail],
      subject: "Confirmação de Agendamento - PetShop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🐾 Agendamento Confirmado!</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <p style="font-size: 18px; color: #334155; margin-bottom: 20px;">
              Olá! Seu agendamento foi confirmado com sucesso.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">📋 Detalhes do Agendamento</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 10px;"><strong>ID:</strong> #${agendamentoId}</li>
                <li style="margin-bottom: 10px;"><strong>Pet:</strong> ${petNome}</li>
                <li style="margin-bottom: 10px;"><strong>Serviço:</strong> ${servicoNome}</li>
                <li style="margin-bottom: 10px;"><strong>Data e Hora:</strong> ${new Date(dataHora).toLocaleString('pt-BR')}</li>
              </ul>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>📍 Importante:</strong> Chegue 15 minutos antes do horário agendado.
                Traga a carteirinha de vacinação do seu pet.
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              Se precisar cancelar ou remarcar, entre em contato conosco com pelo menos 2 horas de antecedência.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #64748b; font-size: 12px;">
                Atenciosamente,<br>
                <strong>Equipe PetShop</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
