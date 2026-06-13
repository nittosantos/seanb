import {
  BadRequestException,
  Body,
  PipeTransform,
  Query,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

function formatZodError(error: ZodError) {
  return {
    message: 'Validation failed',
    errors: error.flatten().fieldErrors,
  };
}

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(formatZodError(result.error));
    }

    return result.data;
  }
}

export function ZodBody(schema: ZodSchema) {
  return Body(new ZodValidationPipe(schema));
}

export function ZodQuery(schema: ZodSchema) {
  return Query(new ZodValidationPipe(schema));
}
