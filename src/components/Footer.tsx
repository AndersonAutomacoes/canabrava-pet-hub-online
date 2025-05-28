
import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">Pet Shop</h3>
            <p className="text-gray-300">
              Cuidando do seu pet com amor e dedicação há anos. 
              Produtos de qualidade e serviços especializados.
            </p>
            <div className="flex items-center space-x-2 text-orange-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Feito com amor para pets</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">Serviços</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Banho e Tosa</li>
              <li>Consultas Veterinárias</li>
              <li>Vacinação</li>
              <li>Hotel para Pets</li>
              <li>Adestramento</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">Produtos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Ração Premium</li>
              <li>Brinquedos</li>
              <li>Acessórios</li>
              <li>Medicamentos</li>
              <li>Higiene</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-400">Contato</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>contato@petshop.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Rua dos Pets, 123 - São Paulo</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Pet Shop. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
