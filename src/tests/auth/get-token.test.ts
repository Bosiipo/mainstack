import * as request from 'supertest';

import app from '../../server';
import {StatusCode} from '../../responses';
import {config} from '../../config';
import auth from '../../lib/auth';

describe('Authorization - Get Token', () => {
  it('returns an error when credential is not supplied', async () => {
    const response = await request(app).post('/v1/auth').send({});
    expect(response.statusCode).toEqual(StatusCode.BAD_REQUEST);
    expect(response.body.message).toEqual(
      'Please check your input and try again'
    );
  });
  it('returns an error when incorrect credential is supplied', async () => {
    const response = await request(app).post('/v1/auth').send({
      username: 'invalid',
      password: 'invalid',
    });
    expect(response.statusCode).toEqual(StatusCode.UNAUTHORIZED);
    expect(response.body.message).toEqual('Incorrent credentials');
  });
  it('successfully generate a token with correct credential', async () => {
    const response = await request(app).post('/v1/auth').send({
      username: config.user,
      password: config.pass,
    });
    expect(response.statusCode).toEqual(StatusCode.OK);
    expect(response.body.message).toEqual('Token generated successfully');

    const token = response.body.data.token;

    const decodeResponse = auth.verify(token);
    expect(decodeResponse.verified).toBe(true);
  });
});
