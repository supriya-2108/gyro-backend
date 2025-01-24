import constants from '../config/constants.js';

export default function accumulateRequestDataMiddleware(req, res, next) {

    let allRequestData = {};

    const paramTypes = [ constants.requestInputTypes.body, constants.requestInputTypes.params, constants.requestInputTypes.query ];
    for ( const param of paramTypes ) {
        if ( req[param] && Object.keys(req[param]).length > 0 ) {
            if ( typeof req[param] === 'string' ) {
                req[param] = JSON.parse(req[param]);
            }
            allRequestData = { ...allRequestData, ...req[param] };
        }
    }

    req.allRequestData = allRequestData;
    next();

}
