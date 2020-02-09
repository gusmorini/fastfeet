import { Router } from 'express';

// multer para uploads de arquivos
import multer from 'multer';
import multercfg from './config/multer';

import AuthenticationController from './app/controllers/AuthenticationController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import SignatureController from './app/controllers/SignatureController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
// configuração do multer
const upload = multer(multercfg);

// rotas não autenticadas
routes.post('/authentication', AuthenticationController.store);
// rotas dos entregadores não autenticados
routes.get('/deliveryman/:id/orders', DeliveryController.index);
routes.get('/deliveryman/:id/deliveries', DeliveryController.deliveries);
routes.get('/deliveryman/:id/canceled', DeliveryController.canceled);
// retirar encomenda, id do entregador e id da encomenda
routes.put('/deliveryman/:id/withdraw/:withId', DeliveryController.withdraw);
routes.put('/deliveryman/:id/receive/:receiveId', DeliveryController.receive);

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
routes.get('/files', FileController.index);

routes.post('/signature', upload.single('file'), SignatureController.store);
routes.get('/signature', SignatureController.index);

routes.get('/order', OrderController.index);
routes.post('/order', OrderController.store);
routes.put('/order/:id', OrderController.update);
routes.delete('/order/:id', OrderController.delete);

export default routes;
