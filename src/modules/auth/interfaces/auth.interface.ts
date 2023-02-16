import { ROLES } from '../../../common/constants';

export interface IPayloadToken {
  sub: string;
  role: ROLES;
}
