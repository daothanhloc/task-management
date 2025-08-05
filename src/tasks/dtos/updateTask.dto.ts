/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/constants';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsString()
  @IsOptional()
  description: string;
}
