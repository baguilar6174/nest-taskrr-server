import { SetMetadata } from '@nestjs/common';

import { ADMIN_KEY } from '../../../common/constants';
import { ROLES } from '../../../common/constants/roles';

export const AdminAccess = () => SetMetadata(ADMIN_KEY, ROLES.ADMIN);
