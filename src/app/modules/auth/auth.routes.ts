import express, { NextFunction, Request, Response } from 'express';

import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import validateRequest from '../../middlewares/validateRequest';
import { authController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signUp',
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = AuthValidation.register.parse(JSON.parse(req.body.data));
    return authController.registerUser(req, res, next);
  }
);

router.post(
  '/login',
  validateRequest(AuthValidation.login),
  authController.loginUser
);

export const AuthRoutes = router;
