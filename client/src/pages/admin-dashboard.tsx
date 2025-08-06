import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Newspaper, 
  Images, 
  CheckCircle, 
  ShieldQuestion, 
  BarChart3, 
  Settings, 
  FileUp, 
  Clock 
} from 'lucide-react';

export default function AdminDashboard() {
  const { toast } = useToast();

  const { data: communities = [] } = useQuery({
    queryKey: ['/api/communities'],
    retry: false,
  });

  const approveCommunityMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/communities/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
      toast({
        title: 'Estado actualizado',
        description: 'El estado de la comunidad ha sido actualizado exitosamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Error al actualizar el estado',
        variant: 'destructive',
      });
    },
  });

  const handleApprove = (id: string) => {
    approveCommunityMutation.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: string) => {
    approveCommunityMutation.mutate({ id, status: 'rejected' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />En Revisión</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Panel de Administración</h1>
        <p className="text-gray-600 text-lg">Gestiona contenidos y procesos del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Gestionar Noticias */}
        <Card className="p-6 hover-lift">
          <div className="flex items-center mb-4">
            <Newspaper className="h-8 w-8 text-primary mr-4" />
            <h3 className="text-xl font-bold text-gray-800">Gestionar Noticias</h3>
          </div>
          <p className="text-gray-600 mb-4">Crear, editar y publicar noticias y anuncios</p>
          <Button className="w-full bg-primary text-white hover:bg-primary/90">
            <FileUp className="h-4 w-4 mr-2" />
            Nueva Noticia
          </Button>
        </Card>

        {/* Editar Carrusel */}
        <Card className="p-6 hover-lift">
          <div className="flex items-center mb-4">
            <Images className="h-8 w-8 text-green-600 mr-4" />
            <h3 className="text-xl font-bold text-gray-800">Editar Carrusel</h3>
          </div>
          <p className="text-gray-600 mb-4">Modificar contenido del carrusel principal</p>
          <Button className="w-full bg-green-600 text-white hover:bg-green-700">
            <Images className="h-4 w-4 mr-2" />
            Editar Carrusel
          </Button>
        </Card>

        {/* Gestión de Usuarios */}
        <Card className="p-6 hover-lift">
          <div className="flex items-center mb-4">
            <ShieldQuestion className="h-8 w-8 text-purple-600 mr-4" />
            <h3 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h3>
          </div>
          <p className="text-gray-600 mb-4">Agregar nuevos administradores y gestionar roles</p>
          <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
            <ShieldQuestion className="h-4 w-4 mr-2" />
            Gestionar Usuarios
          </Button>
        </Card>

        {/* Analíticas */}
        <Card className="p-6 hover-lift">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-orange-600 mr-4" />
            <h3 className="text-xl font-bold text-gray-800">Analíticas</h3>
          </div>
          <p className="text-gray-600 mb-4">Ver estadísticas del sistema y comunidades</p>
          <Button className="w-full bg-orange-600 text-white hover:bg-orange-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Reportes
          </Button>
        </Card>

        {/* Configuración */}
        <Card className="p-6 hover-lift">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-gray-600 mr-4" />
            <h3 className="text-xl font-bold text-gray-800">Configuración</h3>
          </div>
          <p className="text-gray-600 mb-4">Ajustes generales del sistema</p>
          <Button className="w-full bg-gray-600 text-white hover:bg-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </Card>
      </div>

      {/* Solicitudes Pendientes */}
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-primary mb-6">Solicitudes de Comunidades Pendientes</h3>
        
        {communities.filter(c => c.status === 'pending').length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay solicitudes pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communities
              .filter(community => community.status === 'pending')
              .map((community) => (
                <div key={community.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{community.name}</h4>
                      <p className="text-gray-600">{community.type} • {community.location}</p>
                      <p className="text-sm text-gray-500">Capacidad: {community.capacity} kW</p>
                    </div>
                    {getStatusBadge(community.status)}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{community.description}</p>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApprove(community.id)}
                      disabled={approveCommunityMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => handleReject(community.id)}
                      disabled={approveCommunityMutation.isPending}
                      variant="destructive"
                    >
                      Rechazar
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* Actividad Reciente */}
      <Card className="p-6 mt-8">
        <h3 className="text-2xl font-bold text-primary mb-6">Todas las Comunidades</h3>
        <div className="space-y-4">
          {communities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay comunidades registradas</p>
            </div>
          ) : (
            communities.map((community) => (
              <div key={community.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{community.name}</h4>
                  <p className="text-sm text-gray-600">{community.type} • {community.location} • {community.capacity} kW</p>
                </div>
                {getStatusBadge(community.status)}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
