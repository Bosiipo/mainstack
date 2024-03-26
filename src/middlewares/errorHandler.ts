import * as express from 'express';
import logger from '../lib/logger';
import {sendFailureResponse, StatusCode} from '../responses';
import {AppError} from '../responses/errors';

export default (
  err: Error & {type?: string},
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
) => {
  // if (err.type === 'entity.parse.failed') {
  //   return sendFailureResponse(
  //     res,
  //     StatusCode.BAD_REQUEST,
  //     'Invalid JSON body'
  //   );
  // }
  if (err instanceof AppError) {
    return sendFailureResponse(res, err.statusCode, err.message, err.data);
  }

  logger.error(
    {
      message: err.message,
      stack: err.stack,
      ts: Date.now(),
    },
    'INTERNAL_ERROR'
  );
  return sendFailureResponse(
    res,
    StatusCode.SERVER_ERROR,
    'Something went wrong. Please try again later'
  );
};
