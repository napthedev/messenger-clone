import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateObject = (obj: object, Schema: any) => {
  return validateOrReject(plainToClass(Schema, obj));
};
