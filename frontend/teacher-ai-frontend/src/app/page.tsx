"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Teacher AI
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Crie atividades educacionais personalizadas com inteligência artificial
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
        {/* Criar Nova Atividade */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <PlusCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Criar Nova Atividade</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6 text-sm">
              Gere atividades personalizadas com IA baseadas na disciplina, série e tema desejados
            </p>
            <Button 
              onClick={() => router.push('/activities/new')}
              className="w-full"
              size="lg"
            >
              Começar Agora
            </Button>
          </CardContent>
        </Card>

        {/* Ver Atividades */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Minhas Atividades</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6 text-sm">
              Visualize, edite e gerencie todas as atividades que você criou
            </p>
            <Button 
              onClick={() => router.push('/activities')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Ver Atividades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-12 text-sm text-gray-500">
        <p>Simplifique a criação de atividades educacionais com o poder da IA</p>
      </div>
    </div>
  );
}

