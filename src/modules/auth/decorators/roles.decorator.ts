import { SetMetadata } from '@nestjs/common';

import { ROLES_KEY } from '../../../common/constants';
import { ROLES } from '../../../common/constants/roles';

export const Roles = (...roles: Array<keyof typeof ROLES>) =>
  SetMetadata(ROLES_KEY, roles);
