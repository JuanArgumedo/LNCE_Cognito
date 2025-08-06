import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, ArrowRight, CloudSun, Wind, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function News() {
  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ['/api/news'],
    retry: false,
  });

  const defaultNews = [
    {
      id: '1',
      title: 'Nueva regulación facilita la creación de comunidades energéticas',
      content: 'El gobierno aprueba un marco regulatorio simplificado...',
      excerpt: 'El gobierno aprueba un marco regulatorio simplificado que reduce los trámites administrativos para la constitución de comunidades energéticas locales...',
      category: 'Tecnología',
      createdAt: '2024-01-15T00:00:00Z',
      imageUrl: null
    },
    {
      id: '2',
      title: 'Convocatoria abierta para proyectos piloto de energía eólica comunitaria',
      content: 'Se abren 50 millones de euros en fondos...',
      excerpt: 'Se abren 50 millones de euros en fondos para impulsar proyectos innovadores de energía eólica gestionados por comunidades locales...',
      category: 'Innovación',
      createdAt: '2024-01-12T00:00:00Z',
      imageUrl: null
    },
    {
      id: '3',
      title: 'Nueva plataforma de monitoreo inteligente para comunidades energéticas',
      content: 'Presentamos nuestra nueva herramienta...',
      excerpt: 'Presentamos nuestra nueva herramienta de análisis en tiempo real que permite optimizar el consumo y la producción energética comunitaria...',
      category: 'Digitalización',
      createdAt: '2024-01-08T00:00:00Z',
      imageUrl: null
    }
  ];

  const articles = news.length > 0 ? news : defaultNews;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tecnología':
        return <CloudSun className="h-4 w-4" />;
      case 'innovación':
        return <Wind className="h-4 w-4" />;
      case 'digitalización':
        return <Zap className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error al cargar las noticias</h1>
          <p className="text-gray-600">Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Noticias y Anuncios</h1>
          <p className="text-gray-600 text-lg">Mantente informado sobre las últimas novedades del sector energético</p>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="md:flex">
                  <Skeleton className="w-full md:w-48 h-48" />
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover-lift">
                <div className="md:flex">
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    {getCategoryIcon(article.category)}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(article.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        {getCategoryIcon(article.category)}
                        <span className="ml-1">{article.category}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-3">
                      {article.title}
                    </h2>
                    <p className="text-gray-700 mb-4">
                      {article.excerpt}
                    </p>
                    <Button variant="ghost" className="text-accent hover:text-primary font-medium p-0">
                      Leer más <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {!isLoading && articles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay noticias disponibles</h3>
            <p className="text-gray-500">Vuelve más tarde para ver las últimas actualizaciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}
