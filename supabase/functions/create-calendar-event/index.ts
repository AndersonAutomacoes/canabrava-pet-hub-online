
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CalendarEventRequest {
  petNome: string;
  servicoNome: string;
  clienteNome: string;
  dataInicio: string;
  dataFim: string;
  observacoes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { petNome, servicoNome, clienteNome, dataInicio, dataFim, observacoes }: CalendarEventRequest = await req.json();

    console.log('Criando evento no Google Calendar:', {
      petNome,
      servicoNome,
      clienteNome,
      dataInicio,
      dataFim
    });

    // Obter token de acesso do Google Calendar
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error("Credenciais do Google Calendar não configuradas");
    }

    // Renovar access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Erro ao renovar token: ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();

    // Criar evento no Google Calendar
    const calendarId = "andersonnunesautomacoes@gmail.com";
    const event = {
      summary: `🐾 ${servicoNome} - ${petNome}`,
      description: `Cliente: ${clienteNome}\nPet: ${petNome}\nServiço: ${servicoNome}${observacoes ? `\nObservações: ${observacoes}` : ''}`,
      start: {
        dateTime: dataInicio,
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: dataFim,
        timeZone: "America/Sao_Paulo",
      },
      colorId: "10", // Verde para agendamentos
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    };

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      throw new Error(`Erro ao criar evento: ${calendarResponse.statusText} - ${errorText}`);
    }

    const createdEvent = await calendarResponse.json();

    console.log("Evento criado com sucesso:", createdEvent.id);

    return new Response(JSON.stringify({ 
      success: true, 
      eventId: createdEvent.id,
      eventLink: createdEvent.htmlLink 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao criar evento no Google Calendar:", error);
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
