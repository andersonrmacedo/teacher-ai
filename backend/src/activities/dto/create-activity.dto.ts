export class CreateActivityDto {
  disciplina: string;
  serie: string;
  tema: string;
  quantidade_questoes: number;
  dificuldade?: 'facil' | 'media' | 'dificil';
  tipo_questao?:
    | 'multipla_escolha'
    | 'dissertativa'
    | 'verdadeiro_falso'
    | 'misto';
  tipoQuestao?:
    | 'multipla_escolha'
    | 'dissertativa'
    | 'verdadeiro_falso'
    | 'misto'; // Para compatibilidade com frontend
}
