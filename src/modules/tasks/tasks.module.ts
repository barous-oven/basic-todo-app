import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { LLMTaskController, TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController, LLMTaskController],
  providers: [TasksService],
})
export class TasksModule {}
