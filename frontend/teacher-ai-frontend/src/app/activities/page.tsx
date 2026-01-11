"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Pencil, Trash2 } from "lucide-react";

type Activity = {
  id: string;
  disciplina: string;
  serie: string;
  tema: string;
  created_at: string;
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<{
    id: string;
    disciplina: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3000/activities");

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar atividades"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleView = (id: string) => {
    router.push(`/activities/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/activities/${id}/edit`);
  };

  const handleDelete = (id: string, disciplina: string) => {
    setActivityToDelete({ id, disciplina });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/activities/${activityToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      // Recarregar a lista
      setLoading(true);
      const activitiesResponse = await fetch(
        "http://localhost:3000/activities"
      );
      const data = await activitiesResponse.json();
      setActivities(data);
      setLoading(false);

      // Fechar modal
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    } catch (err) {
      setError(
        `Erro ao excluir atividade: ${
          err instanceof Error ? err.message : "Erro desconhecido"
        }`
      );
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-lg font-semibold mb-2">
              Erro ao carregar atividades
            </h2>
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-2 py-4 md:container md:mx-auto md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <Button 
          onClick={() => router.push('/')} 
          variant="outline" 
          className="mb-4 ml-2 md:ml-0"
        >
          ← Voltar ao Dashboard
        </Button>
        
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 px-2 md:px-0">Minhas Atividades</h1>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base px-2 md:px-0">Gerencie suas atividades criadas</p>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <p className="text-gray-500 text-base md:text-lg">Nenhuma atividade encontrada</p>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Crie sua primeira atividade para começar!
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Tabela */}
          <div className="hidden md:block bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {activity.disciplina}
                    </TableCell>
                    <TableCell>{activity.serie}</TableCell>
                    <TableCell>{activity.tema}</TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(activity.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(activity.id)}
                        className="h-8 w-8 p-0"
                        title="Visualizar atividade"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(activity.id)}
                        className="h-8 w-8 p-0"
                        title="Editar atividade"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete(activity.id, activity.disciplina)
                        }
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Excluir atividade"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-2 px-2">
            {activities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow w-full">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-semibold leading-tight">{activity.disciplina}</CardTitle>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.serie} • {activity.tema}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(activity.created_at)}
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-1.5">
                      <Button 
                        onClick={() => handleView(activity.id)}
                        className="flex-1 h-8 text-xs"
                        size="sm"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        onClick={() => handleEdit(activity.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                    <Button 
                      onClick={() => handleDelete(activity.id, activity.disciplina)}
                      variant="destructive"
                      size="sm"
                      className="w-full h-8 text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Atividade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a atividade{" "}
              <strong>&ldquo;{activityToDelete?.disciplina}&rdquo;</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActivityToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
