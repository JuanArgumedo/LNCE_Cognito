import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SendHorizontal, Upload, CheckCircle, Clock, X } from 'lucide-react';

const communitySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['solar', 'eolica', 'hidraulica', 'biomasa', 'mixta'], {
    required_error: 'Selecciona un tipo de energía',
  }),
  location: z.string().min(1, 'La ubicación es requerida'),
  capacity: z.coerce.number().min(1, 'La capacidad debe ser mayor a 0'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
});

type CommunityForm = z.infer<typeof communitySchema>;

interface Community {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function CommunityDashboard() {
  const { toast } = useToast();
  const [files, setFiles] = useState<{
    technical_study?: File;
    economic_analysis?: File;
    legal_docs?: File;
  }>({});

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ['/api/communities'],
    retry: false,
  });

  const form = useForm<CommunityForm>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: '',
      location: '',
      capacity: 0,
      description: '',
    },
  });

  const createCommunityMutation = useMutation({
    mutationFn: async (data: CommunityForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await fetch('/api/communities', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la comunidad');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
      toast({
        title: 'Solicitud enviada',
        description: 'Tu solicitud de comunidad ha sido enviada exitosamente',
      });
      form.reset();
      setFiles({});
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Error al enviar la solicitud',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CommunityForm) => {
    createCommunityMutation.mutate(data);
  };

  const handleFileChange = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />En Revisión</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><X className="h-3 w-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Gestión de Comunidad</h1>
        <p className="text-gray-600 text-lg">Crea y gestiona tu comunidad energética</p>
      </div>

      {/* Community Creation Form */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Crear Nueva Comunidad Energética</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Comunidad</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="Ej: Comunidad Solar Valle Verde"
                        className="transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Energía</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solar">Solar</SelectItem>
                        <SelectItem value="eolica">Eólica</SelectItem>
                        <SelectItem value="hidraulica">Hidráulica</SelectItem>
                        <SelectItem value="biomasa">Biomasa</SelectItem>
                        <SelectItem value="mixta">Mixta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="Ciudad, Provincia"
                        className="transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad Estimada (kW)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        placeholder="100"
                        className="transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Proyecto</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      rows={4}
                      placeholder="Describe tu proyecto de comunidad energética..."
                      className="transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Documentos de Validación</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estudio de Viabilidad Técnica
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('technical_study', e)}
                    className="transition-all duration-300"
                  />
                  {files.technical_study && (
                    <p className="text-sm text-green-600 mt-1">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      {files.technical_study.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Análisis Económico
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.xls,.xlsx"
                    onChange={(e) => handleFileChange('economic_analysis', e)}
                    className="transition-all duration-300"
                  />
                  {files.economic_analysis && (
                    <p className="text-sm text-green-600 mt-1">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      {files.economic_analysis.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documentación Legal
                  </label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange('legal_docs', e)}
                    className="transition-all duration-300"
                  />
                  {files.legal_docs && (
                    <p className="text-sm text-green-600 mt-1">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      {files.legal_docs.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-300"
              disabled={createCommunityMutation.isPending}
            >
              <SendHorizontal className="h-4 w-4 mr-2" />
              {createCommunityMutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </form>
        </Form>
      </Card>

      {/* Community Status */}
      <Card className="p-6">
        <h3 className="text-2xl font-bold text-primary mb-6">Estado de Solicitudes</h3>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No tienes solicitudes de comunidades</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communities.map((community) => (
              <div key={community.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{community.name}</h4>
                  <p className="text-sm text-gray-600">
                    {community.type} • {community.location} • {community.capacity} kW
                  </p>
                  <p className="text-sm text-gray-500">
                    Enviado el {formatDate(community.createdAt)}
                  </p>
                </div>
                {getStatusBadge(community.status)}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
