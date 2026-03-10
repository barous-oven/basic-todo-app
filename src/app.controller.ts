import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TaskGroupModel } from 'generated/prisma/models/TaskGroup';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const taskGroup: TaskGroupModel = {
      id: 1,
      name: 'Example Task Group',
      tasks: [],
    };
    console.log('Task Group:', taskGroup);
    return this.appService.getHello();
  }
}
