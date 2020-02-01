import { Router } from 'express';

import AuthenticationController from './app/controllers/AuthenticationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/authentication', AuthenticationController.store);

routes.use(authMiddleware);
routes.post('/recipient', (req, res) => res.json({ message: 'recipient' }));

export default routes;
