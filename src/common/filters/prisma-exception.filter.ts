import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import { PRISMA_ERROR_MAP } from './prisma-errors.config';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorConfig = PRISMA_ERROR_MAP[exception.code];

    if (errorConfig) {
      const { statusCode, message } = errorConfig;

      return response.status(statusCode).json({
        status: statusCode >= 500 ? 'error' : 'fail',
        message: message,
        ...(process.env.NODE_ENV === 'development' && {
          data: {
            code: exception.code,
            meta: exception.meta,
          },
        }),
      });
    }

    super.catch(exception, host);
  }
}
