import jwt from 'jsonwebtoken';
import constants from '../config/constants.js';
import loggerHelper from './logHelper.js';

const logger = loggerHelper.getInstance({ appName: constants.appName });
const generateToken = (tokenClaims, tokenDurationInSeconds) => {
    try {
        return jwt.sign(tokenClaims, constants.jwtSecret, {
            algorithm: constants.jwtAlgorithm,
            expiresIn: tokenDurationInSeconds + 's',
        });
    } catch ( err ) {
        logger.error({
            message: 'Failed to generate token',
            errorMessage: err.message,
        });
        throw err;
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, constants.jwtSecret, {
            algorithms: [ constants.jwtAlgorithm ],
        });
    } catch ( err ) {
        logger.error({
            message: 'Failed to verify token',
            errorMessage: err.message,
        });
        throw err;
    }
};

export { generateToken, verifyToken };
