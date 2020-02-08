import { Router } from 'express';

// multer para uploads de arquivos
import multer from 'multer';
import multercfg from './config/multer';

import AuthenticationController from './app/controllers/AuthenticationController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

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

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
