import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Home, 
  TrendingUp, 
  Leaf, 
  Sun, 
  Wind, 
  Droplets, 
  Wrench,
  CheckCircle,
  ArrowUp
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  description: string;
}

function KPICard({ title, value, change, changeType, icon, description }: KPICardProps) {
  return (
    <Card className="p-6 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
        </div>
        <div className="text-3xl text-gray-400">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          <ArrowUp className="h-3 w-3 inline mr-1" />
          {change}
        </span>
        <span className="text-gray-600 text-sm ml-1">{description}</span>
      </div>
    </Card>
  );
}

interface Community {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  description?: string;
  status: string;
  createdAt?: string;
  production?: string;
  efficiency?: string;
}

export default function MonitoringDashboard() {
  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ['/api/communities'],
    retry: false,
  });

  const approvedCommunities = communities.filter(c => c.status === 'approved');

  const getEnergyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'solar':
        return <Sun className="h-4 w-4" />;
      case 'eolica':
        return <Wind className="h-4 w-4" />;
      case 'hidraulica':
        return <Droplets className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getEnergyTypeBadge = (type: string) => {
    const colors = {
      solar: 'bg-yellow-100 text-yellow-800',
      eolica: 'bg-blue-100 text-blue-800',
      hidraulica: 'bg-cyan-100 text-cyan-800',
      biomasa: 'bg-green-100 text-green-800',
      mixta: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {getEnergyTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activa
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Wrench className="h-3 w-3 mr-1" />
            Mantenimiento
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  // Mock monitoring data
  const mockCommunities = [
    {
      id: '1',
      name: 'Solar Valle Verde',
      location: 'Andalucía',
      type: 'solar',
      capacity: 500,
      production: '45.2 MWh',
      efficiency: '92.1%',
      status: 'approved'
    },
    {
      id: '2',
      name: 'Eólica Montaña Azul',
      location: 'Galicia',
      type: 'eolica',
      capacity: 2000,
      production: '180.5 MWh',
      efficiency: '88.7%',
      status: 'approved'
    },
    {
      id: '3',
      name: 'Hidráulica Río Claro',
      location: 'Asturias',
      type: 'hidraulica',
      capacity: 800,
      production: '95.3 MWh',
      efficiency: '95.8%',
      status: 'maintenance'
    }
  ];

  const displayCommunities = approvedCommunities.length > 0 ? 
    approvedCommunities.map(c => ({
      ...c,
      production: `${Math.round(c.capacity * 0.09)} MWh`,
      efficiency: `${Math.round(85 + Math.random() * 15)}%`,
    })) : 
    mockCommunities;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Monitoreo de Comunidades</h1>
        <p className="text-gray-600 text-lg">Dashboard de producción energética y KPIs</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Producción Total"
          value="1,250 MWh"
          change="+12.5%"
          changeType="positive"
          icon={<Zap className="h-8 w-8 text-yellow-500" />}
          description="vs mes anterior"
        />
        
        <KPICard
          title="Comunidades Activas"
          value={displayCommunities.filter(c => c.status === 'approved').length.toString()}
          change="+3"
          changeType="positive"
          icon={<Home className="h-8 w-8 text-green-500" />}
          description="nuevas este mes"
        />
        
        <KPICard
          title="Eficiencia Media"
          value="87.3%"
          change="+2.1%"
          changeType="positive"
          icon={<TrendingUp className="h-8 w-8 text-blue-500" />}
          description="optimización"
        />
        
        <KPICard
          title="CO₂ Evitado"
          value="450 Tn"
          change="+15%"
          changeType="positive"
          icon={<Leaf className="h-8 w-8 text-green-500" />}
          description="impacto ambiental"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Producción Energética Mensual</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Gráfico de producción energética</p>
              <p className="text-sm text-gray-500">Datos en tiempo real próximamente</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Mix Energético por Tipo</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <Sun className="h-8 w-8 text-yellow-500" />
                <Wind className="h-8 w-8 text-blue-500" />
                <Droplets className="h-8 w-8 text-cyan-500" />
                <Leaf className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-gray-600">Distribución de energías renovables</p>
              <p className="text-sm text-gray-500">Solar 60%, Eólica 25%, Hidráulica 10%, Biomasa 5%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Community Performance Table */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-primary mb-6">Rendimiento por Comunidad</h3>
        
        {displayCommunities.length === 0 ? (
          <div className="text-center py-8">
            <Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay comunidades activas para mostrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comunidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eficiencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayCommunities.map((community) => (
                  <tr key={community.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{community.name}</div>
                      <div className="text-sm text-gray-500">{community.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEnergyTypeBadge(community.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {community.capacity} kW
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {community.production}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {community.efficiency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(community.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
