import validateSchema from '../helpers/joiSchemaValidationHelper.js';
import logHelper from '../helpers/logHelper.js';
import constants from '../config/constants.js';
import { badRequestResponse } from '../responses/errorResponse.js';
import apiSchema from '../schemas/apiSchema.js';

const logger = logHelper.getInstance({ appName: constants.appName });

export default function requestParamsValidatorMiddleware(req, res, next) {
    const allParams = req.allRequestData;

    const routerPathKey = req.method.toUpperCase() + req.baseUrl + req.route.path;

    const schema = apiSchema[routerPathKey];

    if ( !schema ) {
        return next();
    }
    

    try {
        validateSchema(schema, allParams);
    } catch ( err ) {
        logger.error({
            error: err.toString(),
            errorMessage: err.message,
            message: 'Invalid request params provided',
            identifier: req.uuid,
        });
        return badRequestResponse(res, 'Invalid request params provided', err);
    }
    next();
}
