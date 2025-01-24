import constants from '../config/constants.js';
import { unauthenticatedResponse } from '../responses/errorResponse.js';
import loggerHelper from '../helpers/logHelper.js';
import { verifyToken } from '../helpers/jwtHelper.js';

const logger = loggerHelper.getInstance({ appName: constants.appName });

export default function authenticationMiddleware(req, res, next) {

    if ( !req.headers.authorization ) {
        logger.error({
            message: 'authorization header missing',
            traces: [ `uuid::${ req.uuid }`, ],
        });
        return unauthenticatedResponse(res, 'Unauthenticated', new Error('Unauthenticated'));
    }

    const token = req.headers.authorization;

    let userDetails;

    try {
        userDetails = verifyToken(token);
    } catch ( err ) {
        logger.error({
            message: 'Invalid auth token',
            traces: [ `uuid::${ req.uuid }`, ],
        });
        return unauthenticatedResponse(res, 'Unauthenticated', new Error('Unauthenticated'));
    }

    req.userData = userDetails;

    next();
}
