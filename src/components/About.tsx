
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Users, Award, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '15+', label: 'Anos de Experiência', icon: '📅' },
    { number: '5000+', label: 'Pets Atendidos', icon: '🐕' },
    { number: '4.9', label: 'Avaliação Média', icon: '⭐' },
    { number: '100%', label: 'Amor e Dedicação', icon: '❤️' }
  ];

  const team = [
    {
      name: 'Dr. Carlos Silva',
      role: 'Veterinário Chefe',
      experience: '15 anos',
      specialty: 'Clínica Geral e Cirurgia',
      image: '👨‍⚕️'
    },
    {
      name: 'Maria Santos',
      role: 'Tosadora Profissional',
      experience: '8 anos',
      specialty: 'Tosa por Raça',
      image: '💇‍♀️'
    },
    {
      name: 'João Oliveira',
      role: 'Especialista em Banho',
      experience: '6 anos',
      specialty: 'Tratamentos Especiais',
      image: '👨‍💼'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sobre o PetShop Canabrava
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Há mais de 15 anos cuidando dos pets da região com amor, carinho e profissionalismo. 
            Somos uma família dedicada ao bem-estar do seu melhor amigo.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">Nossa História</h3>
            <p className="text-gray-600 leading-relaxed">
              O PetShop Canabrava nasceu do amor pelos animais e do desejo de oferecer 
              o melhor cuidado para os pets da nossa comunidade. Fundado em 2009 por 
              uma família apaixonada por animais, começamos como um pequeno negócio local 
              e crescemos até nos tornarmos referência em cuidados pet na região.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nosso compromisso sempre foi tratar cada pet como se fosse nosso próprio 
              animal de estimação, oferecendo serviços de qualidade, produtos premium 
              e um atendimento humanizado que faz toda a diferença.
            </p>
            <div className="flex items-center space-x-4">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-gray-700 font-medium">
                "Cada pet é único e merece cuidado especial"
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🏪</div>
                <h4 className="text-xl font-semibold text-gray-800">
                  PetShop Canabrava
                </h4>
                <p className="text-gray-600">
                  Seu local de confiança para cuidados pet
                </p>
                <div className="flex justify-center space-x-2">
                  <span className="text-2xl">🐕</span>
                  <span className="text-2xl">🐱</span>
                  <span className="text-2xl">🐰</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Nossa Equipe Especializada
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-6xl mb-4">{member.image}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-green-600 font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">{member.experience} de experiência</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Especialidade:</strong> {member.specialty}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Visite Nossa Loja</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>Rua das Flores, 123 - Canabrava, SP</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5" />
                  <span>Seg-Sex: 8h-18h | Sáb: 8h-16h</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-lg mb-4 opacity-90">
                Venha nos conhecer pessoalmente!
              </p>
              <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <MapPin className="w-4 h-4 mr-2" />
                Ver no Mapa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
