/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/constants';

export class FilterTasksDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
