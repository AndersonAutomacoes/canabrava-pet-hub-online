
import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🐾</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">PetShop Canabrava</h3>
                <p className="text-sm text-gray-400">Cuidando do seu melhor amigo</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Há mais de 15 anos oferecendo os melhores cuidados para seu pet 
              com amor, carinho e profissionalismo.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-600">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-pink-600 hover:border-pink-600">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-blue-400 hover:border-blue-400">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <div className="space-y-3">
              <a href="/" className="block text-gray-300 hover:text-green-400 transition-colors">
                Início
              </a>
              <a href="/#services" className="block text-gray-300 hover:text-green-400 transition-colors">
                Serviços
              </a>
              <a href="/produtos" className="block text-gray-300 hover:text-green-400 transition-colors">
                Produtos
              </a>
              <a href="/#blog" className="block text-gray-300 hover:text-green-400 transition-colors">
                Blog
              </a>
              <a href="/#about" className="block text-gray-300 hover:text-green-400 transition-colors">
                Sobre Nós
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-6">Nossos Serviços</h4>
            <div className="space-y-3">
              <div className="text-gray-300">🛁 Banho e Tosa</div>
              <div className="text-gray-300">🩺 Consulta Veterinária</div>
              <div className="text-gray-300">💆 SPA Premium</div>
              <div className="text-gray-300">🚚 Entrega de Produtos</div>
              <div className="text-gray-300">📱 Agendamento Online</div>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-6">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Rua das Flores, 123</p>
                  <p className="text-gray-300">Canabrava, SP - CEP: 12345-678</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <p className="text-gray-300">(71) 99722-7741</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <p className="text-gray-300">contato@petshopcanabrava.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <p className="text-gray-300">Seg-Sex: 8h às 18h</p>
                  <p className="text-gray-300">Sábado: 8h às 16h</p>
                  <p className="text-gray-300">Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 PetShop Canabrava. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg animate-pulse"
          title="Fale conosco no WhatsApp"
          onClick={() => window.open('https://wa.me/5571997227741?text=Olá! Gostaria de mais informações sobre os serviços do PetShop Canabrava.', '_blank')}
        >
          <span className="text-2xl">💬</span>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
