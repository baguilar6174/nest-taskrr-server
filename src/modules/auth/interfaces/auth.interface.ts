import { ROLES } from '../../../common/constants';

export interface IPayloadToken {
  sub: string;
  role: ROLES;
}

export interface IAuthTokenResult {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  role: string;
  sub: string;
  isExpired: boolean;
}
