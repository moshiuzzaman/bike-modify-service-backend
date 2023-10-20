import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { reviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(ReviewValidation.create),
  auth(ENUM_USER_ROLE.USER),
  reviewController.createReview
);

router.get(
  '/',

  reviewController.getAllReview
);

router.get(
  '/service/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  reviewController.getReviewByServiceId
);

export const ReviewRoutes = router;
