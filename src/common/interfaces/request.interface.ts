import { Request } from 'express';
import { User } from '../../../generated/prisma/client';

export type AuthenticatedUser = Pick<User, 'id' | 'email' | 'role'>;

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
