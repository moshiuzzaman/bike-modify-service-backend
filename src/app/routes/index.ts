import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { ServiceRoutes } from '../modules/service/service.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path:'/service',
    route:ServiceRoutes,
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
