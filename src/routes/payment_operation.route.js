import express from 'express';
const paymentRouter = express.Router();
import { createPayment, executePayment } from '../controllers/payment_operation_controller.js';

paymentRouter.get('/create-payment', createPayment);
paymentRouter.get('/execute-payment', executePayment);

export default paymentRouter;