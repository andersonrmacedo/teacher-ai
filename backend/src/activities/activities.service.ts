import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { AiService } from '../ai/ai.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AtividadeGerada, ActivityData } from './interfaces/activity.interface';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ActivitiesService {
  private supabase: SupabaseClient;

  constructor(
    private readonly aiService: AiService,
    private readonly supabaseService: SupabaseService,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
    ) as SupabaseClient;
  }

  async generate(dto: CreateActivityDto) {
    // 1. Gerar atividade com IA (usar tipoQuestao do frontend ou tipo_questao)
    const tipoQuestao =
      dto.tipoQuestao || dto.tipo_questao || 'multipla_escolha';

    const atividadeGerada: AtividadeGerada =
      await this.aiService.gerarAtividade({
        disciplina: dto.disciplina,
        serie: dto.serie,
        tema: dto.tema,
        quantidade: dto.quantidade_questoes, // Mapear quantidade_questoes para quantidade
        dificuldade: dto.dificuldade,
        tipo_questao: tipoQuestao,
      });

    // 2. Transformar para formato do Supabase
    const dataToSave: ActivityData = {
      disciplina: atividadeGerada.disciplina,
      serie: atividadeGerada.serie,
      tema: atividadeGerada.tema,
      // Prova do aluno: sem as respostas corretas
      prova_aluno: {
        questoes: atividadeGerada.questoes.map((q) => ({
          enunciado: q.enunciado,
          tipo: q.tipo,
          alternativas: q.alternativas,
          resposta_correta: '', // Vazio para o aluno
        })),
      },
      // Gabarito do professor: com as respostas corretas
      gabarito_professor: {
        questoes: atividadeGerada.questoes.map((q) => ({
          enunciado: q.enunciado,
          tipo: q.tipo,
          alternativas: q.alternativas,
          resposta_correta: q.resposta_correta, // Completo para o professor
        })),
      },
    };

    // 3. Salvar no Supabase
    const savedActivity = await this.supabaseService.insertActivity(dataToSave);

    return {
      message: 'Atividade criada e salva com sucesso',
      data: savedActivity?.[0] || null,
    };
  }

  async findAll(): Promise<ActivityData[] | null> {
    const { data, error } = await this.supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      throw error;
    }

    return data as ActivityData[] | null;
  }

  async findById(id: string): Promise<ActivityData> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await this.supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar atividade no Supabase:', error);
      throw new HttpException(
        `Erro ao buscar atividade: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!data) {
      throw new NotFoundException('Atividade não encontrada');
    }

    return data as ActivityData;
  }

  async create(activityData: ActivityData): Promise<ActivityData> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await this.supabase
      .from('activities')
      .insert([activityData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar atividade no Supabase:', error);
      throw error;
    }

    return data as ActivityData;
  }

  async update(id: string, dto: ActivityData): Promise<ActivityData> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data, error } = await this.supabase
      .from('activities')
      .update({
        disciplina: dto.disciplina,
        serie: dto.serie,
        tema: dto.tema,
        prova_aluno: dto.prova_aluno,
        gabarito_professor: dto.gabarito_professor,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar atividade no Supabase:', error);
      throw new HttpException(
        `Erro ao atualizar atividade: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!data) {
      throw new HttpException('Atividade não encontrada', HttpStatus.NOT_FOUND);
    }

    return data as ActivityData;
  }
}
