import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../generated/prisma/enums';

export class User {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'ahmed@example.com' })
  email!: string;

  @ApiProperty({ example: 'Ahmed Reda' })
  name!: string;

  @ApiProperty({ enum: Role, default: Role.User })
  role!: Role;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
