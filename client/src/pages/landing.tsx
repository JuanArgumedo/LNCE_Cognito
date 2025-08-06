import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import Carousel from '../components/carousel';
import { Users, Target, HandHeart, Award, CloudSun, Leaf, Building } from 'lucide-react';

// Default carousel slides
const defaultSlides = [
  {
    id: '1',
    title: '¿Quiénes somos?',
    content: 'Somos el centro nacional de investigación y desarrollo para comunidades energéticas, promoviendo la democratización del sector energético y la participación ciudadana en la transición hacia un modelo energético más sostenible y descentralizado.',
    icon: '👥',
    backgroundColor: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
  },
  {
    id: '2',
    title: 'Objetivos del laboratorio',
    content: 'Facilitar la creación, desarrollo y gestión de comunidades energéticas, proporcionando herramientas tecnológicas, asesoramiento técnico y monitoreo de indicadores clave para maximizar la eficiencia energética y el impacto social.',
    icon: '🎯',
    backgroundColor: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
  },
  {
    id: '3',
    title: '¿Cómo participar?',
    content: 'Únete registrándote en nuestra plataforma, presenta tu propuesta de comunidad energética, sube la documentación requerida y nuestro equipo te acompañará en todo el proceso de validación, implementación y seguimiento de tu proyecto.',
    icon: '🤝',
    backgroundColor: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
  },
  {
    id: '4',
    title: 'Beneficios de las comunidades energéticas',
    content: 'Reducción de costos energéticos, mayor autonomía energética, impacto ambiental positivo, fortalecimiento del tejido social local y acceso a tecnologías de vanguardia para la generación y gestión de energías renovables.',
    icon: '🏆',
    backgroundColor: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)'
  }
];

export default function Landing() {
  const { data: carouselSlides } = useQuery({
    queryKey: ['/api/carousel'],
    retry: false,
  });

  const slides = (carouselSlides && Array.isArray(carouselSlides) && carouselSlides.length > 0) ? carouselSlides : defaultSlides;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 slide-in">
            Laboratorio Nacional de<br />Comunidades Energéticas
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-secondary slide-in">
            Impulsando la transición energética a través de comunidades sostenibles
          </p>
          <div className="mx-auto mt-8 w-full max-w-4xl h-64 bg-white/10 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <CloudSun className="h-16 w-16 mx-auto mb-4 text-secondary" />
              <p className="text-lg text-secondary">Infraestructura de Energía Renovable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Conoce más sobre nosotros</h2>
            <p className="text-gray-600 text-lg">Descubre cómo las comunidades energéticas están transformando el futuro</p>
          </div>
          
          <Carousel slides={slides} autoRotate interval={5000} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover-lift">
              <div className="flex justify-center mb-4">
                <CloudSun className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">150+</h3>
              <p className="text-gray-600">Comunidades Registradas</p>
            </Card>
            
            <Card className="text-center p-6 hover-lift">
              <div className="flex justify-center mb-4">
                <Leaf className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">25 MW</h3>
              <p className="text-gray-600">Capacidad Instalada</p>
            </Card>
            
            <Card className="text-center p-6 hover-lift">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">12,000+</h3>
              <p className="text-gray-600">Familias Beneficiadas</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
