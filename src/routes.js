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
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
// configuração do multer
const upload = multer(multercfg);

/*
  LOGIN ADMINISTRADOR
*/
routes.post('/authentication', AuthenticationController.store);

/*
  ENTREGADORES VER ENCOMENDAS POR ID
*/

// lista de entregar geral filtro por id
routes.get('/deliveryman/:id/orders', DeliveryController.index);
// lista de encomendas retiradas
routes.get('/deliveryman/:id/active', DeliveryController.active);
// lista de encomendas entregues
routes.get('/deliveryman/:id/deliveries', DeliveryController.deliveries);
// lista de encomendas canceladas
routes.get('/deliveryman/:id/canceled', DeliveryController.canceled);
// retirar encomenda, id do entregador e id da encomenda
routes.put('/deliveryman/:id/withdraw/:withId', DeliveryController.withdraw);
// entregador entrega a encomenda e anexa a assinatura
routes.put(
  '/deliveryman/:id/receive/:receiveId',
  upload.single('signature'),
  DeliveryController.receive
);

/*
  ENTREGAS COM PROBLEMA
*/

// id da encomenda com problema
routes.get('/delivery/:id/problems', DeliveryProblemsController.list);
// cadastra um problema de acordo com id da encomenda
routes.post('/delivery/:id/problems', DeliveryProblemsController.store);

/*
  ROTAS AUTENTICADAS
*/

routes.use(authMiddleware);

/* CADASTRO DE DESTINATÁRIOS */
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);
routes.get('/recipient', RecipientController.index);

/* CADASTRO DE ENTREGADORES */
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

/* UPLOAD DE ARQUIVOS */
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files', FileController.index);

/* UPLOAD DE ASSINATURA */
routes.post('/signature', upload.single('file'), SignatureController.store);
routes.get('/signature', SignatureController.index);

/* CADASTRO DE ENCOMENDAS */
routes.get('/order/', OrderController.index);
routes.post('/order', OrderController.store);
routes.put('/order/:id', OrderController.update);
routes.delete('/order/:id', OrderController.delete);

/* ROTA PARA DISTRIVUIDORA VER TODOS OS PROBLEMAS */

// empresa vê todas as encomendas com problemas
routes.get('/delivery/problems', DeliveryProblemsController.index);
// empresa cancela uma encomenda pelo ID
routes.delete(
  '/delivery/problem/:id/cancel-delivery',
  DeliveryProblemsController.delete
);

export default routes;
