import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { AiModule } from '../ai/ai.module';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  imports: [AiModule], // 👈 AQUI
  controllers: [ActivitiesController],
  providers: [ActivitiesService, SupabaseService],
})
export class ActivitiesModule {}
