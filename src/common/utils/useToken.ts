import * as jwt from 'jsonwebtoken';

import {
  IAuthTokenResult,
  IUseToken,
} from '../../modules/auth/interfaces/auth.interface';

export const useToken = (token: string): IUseToken | string => {
  try {
    const { sub, role, exp } = jwt.decode(token) as IAuthTokenResult;
    const currentDate = new Date();
    const expiresDate = new Date(exp);
    const isExpired = +expiresDate <= +currentDate / 1000;
    return {
      sub,
      isExpired,
      role,
    };
  } catch (error) {
    return 'Token is invalid';
  }
};
