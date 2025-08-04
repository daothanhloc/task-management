import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { FindOneDto } from './dtos/findOne.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get(':id')
  getTaskById(@Param() { id }: FindOneDto) {
    return this.taskService.getTaskById(id);
  }
}
