import {NextFunction, Request, Response} from 'express';
import * as AuthSchema from '../validations/auth.schema';
import * as AuthService from '../services/auth';
import {validate} from '../middlewares/validate';
import {sendSuccessResponse, StatusCode} from '../responses';

export class AuthController {
  async getToken(req: Request, res: Response, next: NextFunction) {
    try {
      const params = await validate(AuthSchema.GetTokenSchema, {
        username: req.body.username,
        password: req.body.password,
      });
      const response = await AuthService.getToken(params);
      return sendSuccessResponse(
        res,
        StatusCode.OK,
        'Token generated successfully',
        {token: response}
      );
    } catch (error) {
      return next(error);
    }
  }
}
