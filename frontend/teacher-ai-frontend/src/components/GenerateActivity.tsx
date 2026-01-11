"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/client-only";

type Questao = {
  tipo: string;
  enunciado: string;
  alternativas: string[];
};

type Activity = {
  disciplina: string;
  serie: string;
  tema: string;
  prova_aluno: {
    questoes: Questao[];
  };
};

export default function GenerateActivity() {
  const [disciplina, setDisciplina] = useState("");
  const [serie, setSerie] = useState("");
  const [tema, setTema] = useState("");

  const [quantidadeQuestoes, setQuantidadeQuestoes] = useState(5);
  const [dificuldade, setDificuldade] = useState<string | undefined>();
  const [tipoQuestao, setTipoQuestao] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setActivity(null);

    try {
      const response = await fetch(
        "http://localhost:3000/activities/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            disciplina,
            serie,
            tema,
            quantidade_questoes: quantidadeQuestoes,
            dificuldade,
            tipo_questao: tipoQuestao,
          }),
        }
      );

      const data = await response.json();
      setActivity(data.data);
    } catch (error) {
      console.error("Erro ao gerar atividade", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gerar atividade com IA</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Disciplina (ex: Matemática)"
          value={disciplina}
          onChange={(e) => setDisciplina(e.target.value)}
        />

        <Input
          placeholder="Série (ex: 5º ano)"
          value={serie}
          onChange={(e) => setSerie(e.target.value)}
        />

        <Input
          placeholder="Tema (ex: Frações)"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
        />

        <Input
          type="number"
          min={1}
          max={30}
          placeholder="Quantidade de questões"
          value={quantidadeQuestoes}
          onChange={(e) => setQuantidadeQuestoes(Number(e.target.value))}
        />

        <ClientOnly>
          <Select onValueChange={setDificuldade}>
            <SelectTrigger>
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facil">Fácil</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="dificil">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </ClientOnly>

        <ClientOnly>
          <Select onValueChange={setTipoQuestao}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de questão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multipla_escolha">Múltipla escolha</SelectItem>
              <SelectItem value="dissertativa">Dissertativa</SelectItem>
              <SelectItem value="verdadeiro_falso">Verdadeiro / Falso</SelectItem>
              <SelectItem value="misto">Misto</SelectItem>
            </SelectContent>
          </Select>
        </ClientOnly>

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? "Gerando..." : "Gerar atividade"}
        </Button>

        {/* RESULTADO */}
        {activity && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Atividade gerada</h3>

            {activity.prova_aluno.questoes.map((q, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <p className="font-medium">
                  {index + 1}. {q.enunciado}
                </p>

                {q.alternativas.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1">
                    {q.alternativas.map((alt, i) => (
                      <li key={i}>{alt}</li>
                    ))}
                  </ul>
                )}

                <p className="text-sm text-muted-foreground">
                  Tipo: {q.tipo}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
