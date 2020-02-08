import { Router } from 'express';

// multer para uploads de arquivos
import multer from 'multer';
import multercfg from './config/multer';

import AuthenticationController from './app/controllers/AuthenticationController';
import RecipientController from './app/controllers/RecipientController';

import FileController from './app/controllers/FileController';

import CourierController from './app/controllers/CourierController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
// configuração do multer
const upload = multer(multercfg);

routes.post('/authentication', AuthenticationController.store);

routes.use(authMiddleware);

// rotas autenticadas

routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);
routes.get('/recipient', RecipientController.index);

routes.post('/courier', CourierController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
