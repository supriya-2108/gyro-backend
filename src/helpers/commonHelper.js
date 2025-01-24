import crypto from 'crypto';
import constants from '../config/constants.js' ;

const generateUuid = () => {
    return crypto.randomUUID();
};

const generateSha512Hash = (valueToHash) => {
    return crypto.createHmac('sha512', constants.hashingKey)
        .update(valueToHash)
        .digest('hex');
};

export { generateUuid, generateSha512Hash };
