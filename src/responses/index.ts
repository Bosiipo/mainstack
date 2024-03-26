import {Response} from 'express';

export enum StatusCode {
  CREATED = 201,
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export const sendSuccessResponse = (
  response: Response,
  status: StatusCode,
  message?: string,
  data?: unknown
) => {
  return response.status(status).json({
    status: 'success',
    message: message || 'Success',
    data,
  });
};

export const sendFailureResponse = (
  response: Response,
  status: StatusCode,
  message?: string,
  errors?: object
) =>
  response.status(status).json({
    status: 'error',
    message: message || 'Something went wrong',
    errors,
  });
