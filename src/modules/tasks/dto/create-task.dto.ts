import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../../../../generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement Authentication' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Setup JWT and Passport', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.Todo })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: 'uuid-of-project' })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({ example: 'uuid-of-user', required: false })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
