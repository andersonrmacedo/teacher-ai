export interface Questao {
  enunciado: string;
  alternativas: string[];
  resposta_correta: string;
  tipo: string;
}

export interface AtividadeGerada {
  disciplina: string;
  serie: string;
  tema: string;
  questoes: Questao[];
}

export interface ActivityData {
  disciplina: string;
  serie: string;
  tema: string;
  prova_aluno: { questoes: Questao[] };
  gabarito_professor: { questoes: Questao[] };
}
