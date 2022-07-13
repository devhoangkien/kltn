import { SetMetadata } from '@nestjs/common';
import {ADMIN_ROLE} from '@app/modules/auth/auth.model'

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ADMIN_ROLE[]) => SetMetadata(ROLES_KEY, roles);
