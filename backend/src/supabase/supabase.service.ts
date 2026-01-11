import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ActivityData } from '../activities/interfaces/activity.interface';

@Injectable()
export class SupabaseService {
  client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    ) as SupabaseClient;
  }

  async insertActivity(data: ActivityData): Promise<ActivityData[] | null> {
    console.log('Salvando no Supabase:', JSON.stringify(data, null, 2));
    const { data: result, error } = await this.client
      .from('activities')
      .insert([data])
      .select();
    console.log('Resultado do Supabase:', result, error);

    if (error) {
      console.error('Erro ao inserir no Supabase:', error);
      throw error;
    }

    return result as ActivityData[] | null;
  }
}
