import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { BookingRoutes } from '../modules/booking/boking.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { ServiceRoutes } from '../modules/service/service.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/service',
    route: ServiceRoutes,
  },
  {
    path: '/booking',
    route: BookingRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
