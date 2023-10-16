import express from 'express';

import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingController } from './booking.controller';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(BookingValidation.create),
  auth(ENUM_USER_ROLE.USER),
  BookingController.createBooking
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookingController.getAllBooking
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  BookingController.getBookingById
);

router.get(
  '/user/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookingController.getBookingsByUserId
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookingController.updateBooking
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookingController.deleteBooking
);

export const BookingRoutes = router;

