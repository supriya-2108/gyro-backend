import Joi from 'joi';
import constants from '../config/constants.js';

const schemas = {
    'POST/api/v1/user/': Joi.object().keys({
        username: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        password: Joi.string().required(),
    }),
    'POST/api/v1/auth/login/': Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    }),
    'POST/api/v1/product/': Joi.object().keys({
        name: Joi.string().required(),
        b2b_price: Joi.number().required(),
        retail_price: Joi.number().required(),
    }),
    'POST/api/v1/inventory-change/': Joi.object({
        warehouse_id: Joi.number().positive().integer().required(),
        product_id: Joi.number().positive().integer().required(),
        quantity: Joi.number().positive().integer().required(),
        change_type: Joi.string().valid(...Object.values(constants.inventoryChangeType)).required(),
        b2b_price: Joi.when(constants.inventoryChangeColumn.changeType, {
            is: constants.inventoryChangeType.inward,
            then: Joi.number().positive().required(),
        }),
        retail_price: Joi.when(constants.inventoryChangeColumn.changeType, {
            is: constants.inventoryChangeType.inward,
            then: Joi.number().positive().required(),
        }),
    }),
};

export default schemas;
