import { Analytics } from '@rocket.chat/core-services';
import express, { type Request } from 'express';
import { WebApp } from 'meteor/webapp';

import { authenticationMiddleware, hasPermissionMiddleware } from '../../app/api/server/middlewares/authentication';
import { getCheckoutUrl, fallback } from '../../app/cloud/server/functions/getCheckoutUrl';
import { getSeatsRequestLink } from '../app/license/server/getSeatsRequestLink';
import rateLimit from 'express-rate-limit';

const apiServer = express();
apiServer.disable('x-powered-by');
WebApp.connectHandlers.use(apiServer);

// Define rate limiter middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.',
    },
});

// Create the router
const router = express.Router();

// Apply rate limiter middleware
router.use(apiLimiter);

// Apply authentication middleware
router.use(authenticationMiddleware({ rejectUnauthorized: false, cookies: true }));

// Define the `/requestSeats` route
router.get('/requestSeats', async (req, res, next) => {
    try {
        if (!req.user || !hasPermissionMiddleware(req.user._id, 'manage-cloud')) {
            return res.status(403).send({
                status: 'error',
                message: 'Access denied. You do not have the required permissions.',
            });
        }

        const seatsRequestLink = getSeatsRequestLink();
        return res.send({
            status: 'success',
            data: seatsRequestLink,
        });
    } catch (error) {
        next(error);
    }
});

// Define the `/checkoutUrl` route
router.post('/checkoutUrl', async (req: Request, res, next) => {
    try {
        const checkoutUrl = await getCheckoutUrl(req.body);
        return res.send({
            status: 'success',
            data: checkoutUrl || fallback,
        });
    } catch (error) {
        next(error);
    }
});

// Connect the router to the API server
apiServer.use('/api', router);

export default apiServer;
