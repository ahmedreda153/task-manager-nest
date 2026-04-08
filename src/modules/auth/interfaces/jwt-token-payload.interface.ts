import { Role } from '../../../../generated/prisma/enums';

export interface JwtTokenPayload {
  sub: string;
  role: Role;
  email: string;
}
