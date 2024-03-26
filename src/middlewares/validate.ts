import * as yup from 'yup';
import {ValidationError} from '../responses/errors';

export const validate = async <T>(
  schema: yup.ISchema<T>,
  data: unknown
): Promise<T> => {
  try {
    const result = await schema.validate(data);
    return result;
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      throw new ValidationError(
        'Please check your input and try again',
        error.errors
      );
    }
    throw error;
  }
};
