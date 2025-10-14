import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error.js';

const handleCastError = (
  error: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSources = [
    {
      path: error.path,
      message: error.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Cast Error',
    errorSources,
  };
};

export default handleCastError;
