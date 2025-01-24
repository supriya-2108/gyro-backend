import {Router} from 'express';
const adminOperationRouter = Router();
import { check, validationResult } from 'express-validator';
import { createProduct, updateProduct, deleteProduct, getProductsList, getOrdersList } from '../controllers/gyro_admin_operation_controller.js';

adminOperationRouter.post('/create_product',[
    check('product_id','Product id is required').not().isEmpty(),
    check('name','Name is required').not().isEmpty(),
    check('description','Description is required').not().isEmpty(),
    check('price','Price is required').not().isEmpty(),
    check('image','Image is required').not().isEmpty(),
    check('category','Category is required').not().isEmpty(),
    check('quantity','Quantity is required').not().isEmpty(),
],
 createProduct
)

adminOperationRouter.patch('/update_product/:id',
 updateProduct
)

adminOperationRouter.delete('/delete_product/:id',
 deleteProduct
)

adminOperationRouter.get('/get_products_list',
 getProductsList
)

adminOperationRouter.get('/get_orders_list',
 getOrdersList
)

export default adminOperationRouter;