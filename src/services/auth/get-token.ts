import {config} from '../../config';
import auth from '../../lib/auth';
import {AuthenticationError} from '../../responses/errors';

type GetTokenInput = {
  username: string;
  password: string;
};

export const getToken = async (input: GetTokenInput) => {
  if (input.username === config.user && input.password === config.pass) {
    return auth.generate();
  }

  throw new AuthenticationError('Incorrent credentials');
};
