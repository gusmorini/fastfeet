import { Router } from 'express';

import AuthenticationController from './app/controllers/AuthenticationController';

const routes = new Router();

routes.get('/authentication', AuthenticationController.store);

export default routes;
