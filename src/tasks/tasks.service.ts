import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/createTask.dto';
import { TaskStatus } from 'src/constants';
import { UpdateTaskDto } from './dtos/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks(status: string): Promise<Task[]> {
    try {
      if (status) {
        return await this.taskRepository.findBy({ status });
      } else {
        return await this.taskRepository.find();
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Can not found task');
      }
      return task;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create(taskData);
      task.status = TaskStatus.NEW;
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateTask(id: number, taskData: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Not found task, please check id');
      }
      for (const key in taskData) {
        task[key] = taskData[key] as string;
      }
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deteleTask(id: number): Promise<void> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Not found task, please check id');
      }
      await this.taskRepository.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
