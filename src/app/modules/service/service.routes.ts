import express, { NextFunction, Request, Response } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import { serviceController } from './service.controller';
import { ServiceValidation } from './service.validation';

const router = express.Router();

router.get('/', serviceController.getAllService);

router.get('/:id', serviceController.getServiceById);

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single('file'),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = ServiceValidation.create.parse(JSON.parse(req.body.data));
    return serviceController.createService(req, res, next);
  }
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ServiceValidation.update.parse(JSON.parse(req.body.data));
    return serviceController.updateService(req, res, next);
  }
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  serviceController.deleteService
);

export const ServiceRoutes = router;
