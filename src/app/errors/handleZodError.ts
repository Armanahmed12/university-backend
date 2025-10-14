import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error.js';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    return {
      path: issue.path.join('.'),
      message: issue.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'validation Error',
    errorSources,
  };
};

export default handleZodError;
