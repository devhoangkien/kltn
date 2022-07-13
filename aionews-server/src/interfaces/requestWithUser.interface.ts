import { Request } from 'express';
import { Auth } from '@app/modules/auth/auth.model';

interface RequestWithUser extends Request {
  user: Auth;
}

export default RequestWithUser;