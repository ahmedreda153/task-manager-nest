import { HttpStatus } from '@nestjs/common';

export const PRISMA_ERROR_MAP: Record<
  string,
  { statusCode: number; message: string } | undefined
> = {
  P2000: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Provided value is too long for the column type.',
  },
  P2002: {
    statusCode: HttpStatus.CONFLICT,
    message:
      'Unique constraint violation: A record with this value already exists.',
  },
  P2003: {
    statusCode: HttpStatus.BAD_REQUEST,
    message:
      'Foreign key constraint violation: A related record could not be found.',
  },
  P2005: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Stored value is invalid for the field type.',
  },
  P2006: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'The provided value is not valid.',
  },
  P2011: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Null constraint violation: A required value is missing.',
  },
  P2012: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Missing a required value.',
  },
  P2014: {
    statusCode: HttpStatus.BAD_REQUEST,
    message:
      'Required relation violation: This change would break a required relationship.',
  },
  P2015: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'A related record could not be found.',
  },
  P2018: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'The required connected records were not found.',
  },
  P2021: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'The database table does not exist.',
  },
  P2022: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'The database column does not exist.',
  },
  P2024: {
    statusCode: HttpStatus.GATEWAY_TIMEOUT,
    message: 'Connection timeout: The database took too long to respond.',
  },
  P2025: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'The requested record was not found or has already been deleted.',
  },
  P2028: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message:
      'Transaction API error: The database operation failed to complete.',
  },
  P2034: {
    statusCode: HttpStatus.CONFLICT,
    message: 'Transaction failed due to a write conflict. Please try again.',
  },
};
