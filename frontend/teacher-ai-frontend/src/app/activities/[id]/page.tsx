"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Activity = {
  id: string;
  disciplina: string;
  serie: string;
  tema: string;
  created_at: string;
  prova_aluno: {
    questoes: Array<{
      enunciado: string;
      tipo: string;
      alternativas?: string[];
    }>;
  };
};

export default function ActivityDetailPage() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (error) {
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

  if (!activity) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Atividade não encontrada</p>
          <Button onClick={() => router.push('/activities')} className="mt-4">
            Voltar à lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={() => router.push('/')} 
            variant="outline"
          >
            ← Dashboard
          </Button>
          <Button 
            onClick={() => router.push('/activities')} 
            variant="outline"
          >
            ← Atividades
          </Button>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activity.disciplina}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {activity.serie}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {activity.tema}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Criado em {formatDate(activity.created_at)}
          </p>
        </div>
      </div>

      {/* Questões */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Questões</h2>
        
        {activity.prova_aluno.questoes.map((questao, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">
                Questão {index + 1}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({questao.tipo})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-800">
                {questao.enunciado}
              </div>
              
              {questao.alternativas && questao.alternativas.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Alternativas:</p>
                  <ul className="space-y-1">
                    {questao.alternativas.map((alternativa, altIndex) => (
                      <li 
                        key={altIndex} 
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                          {String.fromCharCode(65 + altIndex)}
                        </span>
                        <span>{alternativa}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}