import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import type { ActivityData } from './interfaces/activity.interface';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: ActivityData) {
    return this.service.create(dto);
  }

  @Post('generate')
  generate(@Body() dto: CreateActivityDto) {
    return this.service.generate(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ActivityData) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
