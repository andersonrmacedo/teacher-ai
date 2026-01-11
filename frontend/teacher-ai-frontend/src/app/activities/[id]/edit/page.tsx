"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Activity = {
  id: string;
  disciplina: string;
  serie: string;
  tema: string;
  created_at: string;
};

export default function EditActivityPage() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [disciplina, setDisciplina] = useState("");
  const [serie, setSerie] = useState("");
  const [tema, setTema] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function fetchActivity() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:3000/activities/${id}`);
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setActivity(data);
        
        // Preencher os campos do formulário
        setDisciplina(data.disciplina || "");
        setSerie(data.serie || "");
        setTema(data.tema || "");
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar atividade");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchActivity();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`http://localhost:3000/activities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disciplina,
          serie,
          tema,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      setSuccessMessage("Atividade atualizada com sucesso!");
      
      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        router.push(`/activities/${id}`);
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar atividade");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/activities/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando atividade...</p>
        </div>
      </div>
    );
  }

  if (error && !activity) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Erro ao carregar atividade</h2>
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => router.push('/activities')} 
              className="mt-4"
              variant="outline"
            >
              Voltar à lista
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={() => router.push('/')} 
            variant="outline"
            disabled={saving}
          >
            ← Dashboard
          </Button>
          <Button 
            onClick={() => router.push('/activities')} 
            variant="outline"
            disabled={saving}
          >
            ← Atividades
          </Button>
          <Button 
            onClick={handleCancel} 
            variant="outline"
            disabled={saving}
          >
            ← Cancelar
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Atividade</h1>
        {activity && (
          <p className="text-gray-500 text-sm">
            Criada em {formatDate(activity.created_at)}
          </p>
        )}
      </div>

      {/* Mensagens de feedback */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Atividade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="disciplina" className="text-sm font-medium text-gray-700">
              Disciplina
            </label>
            <Input
              id="disciplina"
              placeholder="Ex: Matemática"
              value={disciplina}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisciplina(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="serie" className="text-sm font-medium text-gray-700">
              Série
            </label>
            <Input
              id="serie"
              placeholder="Ex: 5º ano"
              value={serie}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerie(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tema" className="text-sm font-medium text-gray-700">
              Tema
            </label>
            <Input
              id="tema"
              placeholder="Ex: Frações"
              value={tema}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTema(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-4">
              <strong>Nota:</strong> As questões não podem ser editadas através desta interface.
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleSave}
                disabled={saving || !disciplina.trim() || !serie.trim() || !tema.trim()}
                className="flex-1"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
              
              <Button 
                onClick={handleCancel}
                variant="outline"
                disabled={saving}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}