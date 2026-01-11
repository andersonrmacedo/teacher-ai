import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

@Module({
  providers: [AiService],
  exports: [AiService], // 👈 MUITO IMPORTANTE
})
export class AiModule {}
