"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import GenerateActivity from "@/components/GenerateActivity";

export default function NewActivityPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => router.push('/')} 
          variant="outline" 
          className="mb-4"
        >
          ← Voltar ao Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Criar Nova Atividade
        </h1>
        <p className="text-gray-600">
          Preencha os campos abaixo para gerar uma atividade personalizada com IA
        </p>
      </div>

      {/* Componente de Geração */}
      <GenerateActivity />
    </div>
  );
}