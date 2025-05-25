
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleScheduleService = () => {
    navigate('/agendamento');
  };

  const handleViewProducts = () => {
    navigate('/produtos');
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative py-20 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                Cuidamos do seu
                <span className="text-green-600 block">melhor amigo</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                No PetShop Canabrava, oferecemos serviços completos de cuidado para pets, 
                produtos de qualidade e muito amor para seu companheiro de quatro patas.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">500+</div>
                <div className="text-sm text-gray-600">Pets Atendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">15</div>
                <div className="text-sm text-gray-600">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">4.9</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                onClick={handleScheduleService}
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar Serviço</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center space-x-2"
                onClick={handleViewProducts}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Ver Produtos</span>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">Atendimento com amor</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                <span className="text-sm text-gray-600">Profissionais qualificados</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 transform rotate-3 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
                      🐕
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Max</h3>
                      <p className="text-gray-600">Golden Retriever</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Último banho:</span>
                      <span className="text-green-600 font-semibold">Há 2 semanas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Próxima consulta:</span>
                      <span className="text-blue-600 font-semibold">15/01/2025</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={scrollToServices}
                  >
                    Ver Serviços
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
              🦴
            </div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-xl animate-pulse">
              ❤️
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
