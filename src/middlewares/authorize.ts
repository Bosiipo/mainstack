import {NextFunction, Request, Response} from 'express';
import {sendFailureResponse, StatusCode} from '../responses';
import auth from '../lib/auth';
import {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';
import {AuthorizationError} from '../responses/errors';

export const authorize = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader)
      return sendFailureResponse(
        response,
        StatusCode.UNAUTHORIZED,
        'Authorization header not found'
      );

    const [bearer, token] = authHeader.split(' ');
    if (!(bearer?.toLowerCase() === 'bearer' && token))
      return sendFailureResponse(
        response,
        StatusCode.UNAUTHORIZED,
        'Invalid authorization header'
      );

    auth.verify(token);
    return next();
  } catch (error) {
    let localError = null;
    if (error instanceof TokenExpiredError)
      localError = new AuthorizationError(
        'Token has expired. Please login again'
      );
    else if (error instanceof JsonWebTokenError)
      localError = new AuthorizationError('Invalid token');
    return next(localError || error);
  }
};
