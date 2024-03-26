import {StatusCode} from '.';

export class AppError extends Error {
  statusCode: StatusCode;
  data?: object;
  constructor(message: string, statusCode: StatusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalError extends AppError {
  data: Record<string, unknown>;

  constructor(message: string, data: Record<string, unknown>) {
    super(message, StatusCode.SERVER_ERROR);
    this.data = data;
  }
}

export class ValidationError extends AppError {
  data?: object;

  constructor(message: string, data?: string[]) {
    super(message, StatusCode.BAD_REQUEST);
    this.data = data;
  }
}

export class AuthenticationError extends AppError {
  data?: object;

  constructor(message: string, data?: object) {
    super(message, StatusCode.UNAUTHORIZED);
    this.data = data;
  }
}

export class AuthorizationError extends AppError {
  data?: object;

  constructor(message: string, data?: object) {
    super(message, StatusCode.FORBIDDEN);
    this.data = data;
  }
}

export class ResourceNotFound extends AppError {
  data: Record<string, unknown>;

  constructor(message: string, query?: Record<string, unknown> | string) {
    super(message, StatusCode.NOT_FOUND);
    this.data = {query};
  }
}
