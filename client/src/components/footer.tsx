import { Building, Globe, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Laboratorio Nacional de Comunidades Energéticas</h3>
            <p className="text-secondary">
              Impulsando la transición energética a través de comunidades sostenibles y tecnología avanzada.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Útiles</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-secondary hover:text-white transition-colors duration-300">Sobre Nosotros</a></li>
              <li><a href="#" className="text-secondary hover:text-white transition-colors duration-300">Documentación</a></li>
              <li><a href="#" className="text-secondary hover:text-white transition-colors duration-300">Soporte Técnico</a></li>
              <li><a href="#" className="text-secondary hover:text-white transition-colors duration-300">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Logos Institucionales</h4>
            <div className="flex flex-wrap gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover-lift">
                <Building className="text-white h-8 w-8" />
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover-lift">
                <Globe className="text-white h-8 w-8" />
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover-lift">
                <Leaf className="text-white h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary mt-8 pt-8 text-center">
          <p className="text-secondary">
            &copy; 2024 Laboratorio Nacional de Comunidades Energéticas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
