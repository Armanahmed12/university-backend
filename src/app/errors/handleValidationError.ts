import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error.js';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (eachError: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: eachError.path,
        message: eachError.message,
      };
    }
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation Error',
    errorSources,
  };
};

export default handleValidationError;
