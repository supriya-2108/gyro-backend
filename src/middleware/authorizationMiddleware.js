import routePermission from '../config/routePermission.js';
import constants from '../config/constants.js';
import { internalServerErrorResponse, unauthorisedResponse } from '../responses/errorResponse.js';
import loggerHelper from '../helpers/logHelper.js';

const logger = loggerHelper.getInstance({ appName: constants.appName });

import rolePermissionGlobal from '../globals/rolePermissionGlobal.js';

export default async function authorizationMiddleware(req, res, next) {

    const routerPathKey = req.method.toUpperCase() + req.baseUrl + req.route.path;
    const permissionsRequiredForRouter = routePermission[routerPathKey];

    if ( !permissionsRequiredForRouter ) {
        return next();
    }

    try {

        const userRoles = req.userData.roles;

        if ( !userRoles || !Array.isArray(userRoles) && userRoles.length === 0 ) {
            logger.error({
                message: 'User does not have permission for the route',
                traces: [ `identifier::${ req.uuid }` ],
            });
            return unauthorisedResponse(res, 'Unauthorised', new Error('Unauthorised'));
        }

        let allPermissions = [];

        let rolePermissionGlobalInstance = await rolePermissionGlobal.getInstance();

        for ( let roleId of userRoles ) {
            allPermissions = [ ...allPermissions, ...rolePermissionGlobalInstance.getPermissionsOfRole(roleId) ];
        }

        const found = permissionsRequiredForRouter.some(r => allPermissions.indexOf(r) >= 0);

        if ( !found ) {
            logger.error({
                message: 'User does not have permission for the route',
                traces: [ `identifier::${ req.uuid }`, `routePermission::${ permissionsRequiredForRouter }` ],
            });
            return unauthorisedResponse(res, 'Unauthorised', new Error('Unauthorised'));
        }

    } catch ( err ) {
        logger.error({
            message: 'Something went wrong',
            errorMessage: err.message,
            traces: [ `identifier::${ req.uuid }` ],
        });
        return internalServerErrorResponse(res, 'Something went wrong', err);
    }
    return next();
}
