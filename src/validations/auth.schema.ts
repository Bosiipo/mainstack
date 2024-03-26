import * as yup from 'yup';

export const GetTokenSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const RevokeTokenSchema = yup.object({
  token: yup.string().required(),
});
