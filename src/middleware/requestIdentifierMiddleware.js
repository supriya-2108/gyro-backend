import { generateUuid } from '../helpers/commonHelper.js';

export default function requestIdentifierMiddleware(req, res, next) {
    req.uuid = generateUuid();
    next();
}
