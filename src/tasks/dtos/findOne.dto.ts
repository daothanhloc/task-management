/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumberString } from 'class-validator';

export class FindOneDto {
  @IsNumberString()
  id: number;
}
