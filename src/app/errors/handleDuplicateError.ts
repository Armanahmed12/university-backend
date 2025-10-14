/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/error.js';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  //  extract the value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate key Error',
    errorSources: errorSources,
  };
};

export default handleDuplicateError;
