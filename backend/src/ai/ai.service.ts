import { Injectable, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import { AtividadeGerada } from '../activities/interfaces/activity.interface';

@Injectable()
export class AiService implements OnModuleInit {
  private openai!: OpenAI;

  onModuleInit() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY não encontrada no ambiente');
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async testarIA(): Promise<string | null> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Crie uma pergunta simples de matemática para o 5º ano',
        },
      ],
    });

    return response.choices[0].message.content;
  }

  async gerarAtividade(dto: {
    disciplina: string;
    serie: string;
    tema: string;
    quantidade: number;
    dificuldade?: string;
    tipo_questao?: string;
  }): Promise<AtividadeGerada> {
    const tipoQuestao = dto.tipo_questao || 'multipla_escolha';

    let formatoQuestoes = '';

    switch (tipoQuestao) {
      case 'dissertativa':
        formatoQuestoes = `
      {
        "enunciado": "Pergunta dissertativa aqui",
        "alternativas": [],
        "resposta_correta": "Resposta esperada detalhada",
        "tipo": "dissertativa"
      }`;
        break;
      case 'verdadeiro_falso':
        formatoQuestoes = `
      {
        "enunciado": "Afirmação para julgar",
        "alternativas": ["Verdadeiro", "Falso"],
        "resposta_correta": "Verdadeiro ou Falso",
        "tipo": "verdadeiro_falso"
      }`;
        break;
      case 'misto':
        formatoQuestoes = `
      {
        "enunciado": "Questão (pode ser múltipla escolha, dissertativa ou V/F)",
        "alternativas": ["opções se for múltipla escolha, vazio se dissertativa"],
        "resposta_correta": "Resposta correta",
        "tipo": "multipla_escolha ou dissertativa ou verdadeiro_falso"
      }`;
        break;
      default: // multipla_escolha
        formatoQuestoes = `
      {
        "enunciado": "Pergunta de múltipla escolha",
        "alternativas": ["opção A", "opção B", "opção C", "opção D"],
        "resposta_correta": "opção correta",
        "tipo": "multipla_escolha"
      }`;
    }

    const prompt = `
Você é um professor especialista.

Crie uma atividade escolar com as seguintes informações:
- Disciplina: ${dto.disciplina}
- Série: ${dto.serie}
- Tema: ${dto.tema}
- Quantidade de questões: ${dto.quantidade}
- Dificuldade: ${dto.dificuldade || 'média'}
- Tipo de questão: ${tipoQuestao}

Retorne SOMENTE um JSON válido, no formato:

{
  "disciplina": "${dto.disciplina}",
  "serie": "${dto.serie}",
  "tema": "${dto.tema}",
  "questoes": [${formatoQuestoes}
  ]
}

IMPORTANTE: 
- Para questões dissertativas, deixe o array "alternativas" vazio
- Para questões verdadeiro/falso, use apenas ["Verdadeiro", "Falso"]
- Para tipo "misto", varie os tipos de questão
- Sempre inclua o campo "tipo" em cada questão
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('IA não retornou resposta');

    // Remove marcações de bloco de código
    const cleanContent = content.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleanContent) as AtividadeGerada;
    } catch {
      console.error('Erro ao parsear JSON da IA:', cleanContent);
      throw new Error('IA retornou JSON inválido');
    }
  }
}
