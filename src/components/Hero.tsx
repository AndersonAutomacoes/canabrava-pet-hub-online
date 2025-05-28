
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, Clock, Star } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Cuidado completo para seu{' '}
                <span className="text-orange-600">melhor amigo</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Serviços profissionais de pet shop com produtos de qualidade premium. 
                Agende online e garante o melhor para seu animal de estimação.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold"
                onClick={() => window.location.href = '/agendamento'}
              >
                Agendar Serviço
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg font-semibold"
                onClick={() => window.location.href = '/produtos'}
              >
                Ver Produtos
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Cuidado</h3>
                <p className="text-sm text-gray-600">Amoroso</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Segurança</h3>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Rapidez</h3>
                <p className="text-sm text-gray-600">no Atendimento</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Qualidade</h3>
                <p className="text-sm text-gray-600">Premium</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-6xl">🐕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Seu Pet Merece o Melhor</h3>
                    <p className="text-gray-600 px-6">
                      Profissionais especializados e produtos de alta qualidade
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
