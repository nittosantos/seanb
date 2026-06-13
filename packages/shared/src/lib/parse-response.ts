import { z } from 'zod';

export function parseResponse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  return schema.parse(data);
}
