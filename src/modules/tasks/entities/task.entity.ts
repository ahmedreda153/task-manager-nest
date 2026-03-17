import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../../generated/prisma/enums';

export class Task {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @ApiProperty({ enum: TaskStatus })
  status!: TaskStatus;

  @ApiProperty()
  projectId!: string;

  @ApiProperty({ required: false, nullable: true })
  assigneeId?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
