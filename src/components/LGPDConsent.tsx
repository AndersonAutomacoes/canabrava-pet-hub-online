
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Cookie } from 'lucide-react';
import { hasLGPDConsent, setLGPDConsent, getLGPDConsent } from '@/utils/lgpd';

export const LGPDConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [consents, setConsents] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const hasConsent = hasLGPDConsent();
    setShowConsent(!hasConsent);
    
    if (hasConsent) {
      const savedConsent = getLGPDConsent();
      if (savedConsent) {
        setConsents({
          necessary: savedConsent.necessary,
          analytics: savedConsent.analytics,
          marketing: savedConsent.marketing
        });
      }
    }
  }, []);

  const handleAcceptAll = () => {
    setLGPDConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
    setShowConsent(false);
  };

  const handleAcceptSelected = () => {
    setLGPDConsent(consents);
    setShowConsent(false);
  };

  const handleRejectAll = () => {
    setLGPDConsent({
      necessary: true,
      analytics: false,
      marketing: false
    });
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black bg-opacity-50">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Política de Privacidade e Cookies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Utilizamos cookies e coletamos dados para melhorar sua experiência. 
            Você pode escolher quais tipos de cookies aceitar:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={consents.necessary} 
                disabled
                id="necessary"
              />
              <label htmlFor="necessary" className="text-sm">
                <strong>Cookies Necessários</strong> - Essenciais para o funcionamento do site
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={consents.analytics}
                onCheckedChange={(checked) => 
                  setConsents(prev => ({ ...prev, analytics: !!checked }))
                }
                id="analytics"
              />
              <label htmlFor="analytics" className="text-sm">
                <strong>Cookies de Análise</strong> - Nos ajudam a entender como você usa o site
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={consents.marketing}
                onCheckedChange={(checked) => 
                  setConsents(prev => ({ ...prev, marketing: !!checked }))
                }
                id="marketing"
              />
              <label htmlFor="marketing" className="text-sm">
                <strong>Cookies de Marketing</strong> - Para personalizar anúncios
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button 
              onClick={handleAcceptAll}
              className="bg-green-600 hover:bg-green-700"
            >
              Aceitar Todos
            </Button>
            <Button 
              onClick={handleAcceptSelected}
              variant="outline"
            >
              Aceitar Selecionados
            </Button>
            <Button 
              onClick={handleRejectAll}
              variant="ghost"
            >
              Rejeitar Todos
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Ao continuar navegando, você concorda com nossa{' '}
            <a href="/privacy" className="text-green-600 hover:underline">
              Política de Privacidade
            </a>
            {' '}e{' '}
            <a href="/terms" className="text-green-600 hover:underline">
              Termos de Uso
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
