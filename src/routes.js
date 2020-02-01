import { Router } from 'express';

import AuthenticationController from './app/controllers/AuthenticationController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/authentication', AuthenticationController.store);

routes.use(authMiddleware);
routes.post('/recipient', RecipientController.store);

export default routes;
