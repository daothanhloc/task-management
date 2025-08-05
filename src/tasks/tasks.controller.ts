import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { FindOneDto } from './dtos/findOne.dto';
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/createTask.dto';
import { UpdateTaskDto } from './dtos/updateTask.dto';
import { FilterTasksDto } from './dtos/filterTasks.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(@Query() { status }: FilterTasksDto): Promise<Task[]> {
    return this.taskService.getTasks(status);
  }

  @Get(':id')
  getTaskById(@Param() { id }: FindOneDto): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() taskData: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(taskData);
  }

  @Patch(':id')
  updateTask(
    @Param() { id }: FindOneDto,
    @Body() taskData: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, taskData);
  }

  @Delete(':id')
  deleteTask(@Param() { id }: FindOneDto): Promise<void> {
    return this.taskService.deteleTask(id);
  }
}
