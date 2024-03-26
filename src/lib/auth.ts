import {sign, verify} from 'jsonwebtoken';
import {config} from '../config';

class Authorization {
  private secretKey: string;

  constructor() {
    this.secretKey = config.secretKey as string;
  }

  generate(): string {
    const token = sign({login: Date.now()}, this.secretKey, {
      expiresIn: '1h',
    });

    return token;
  }

  verify(token: string): {verified: boolean} {
    verify(token, this.secretKey);
    return {verified: true};
  }
}

export default new Authorization();
