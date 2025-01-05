import { Users } from '@rocket.chat/models';
import express from 'express';
import { RateLimit } from 'express-rate-limit';
import { WebApp } from 'meteor/webapp';
import { authenticationMiddleware } from '../../../../app/api/server/middlewares/authentication';

const apiServer = express();
apiServer.disable('x-powered-by');

// Define rate-limiting middleware
const rateLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.',
    },
});

const router = express.Router();

// Apply the rate limiter to all routes
router.use(rateLimiter);

// Apply the authentication middleware
router.use(authenticationMiddleware({ rejectUnauthorized: false }));

router.post('/oauth/authorize', async (req, res, next) => {
    try {
        if (req.body.allow !== 'yes') {
            return res.status(401).send({
                error: 'access_denied',
                error_description: 'The user denied access to your application',
            });
        }

        // Ensure the access token exists
        if (!req.body.token && !req.body.access_token) {
            return res.status(401).send('No token');
        }

        const user = await Users.findOne(
            {
                'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(req.body.access_token || req.body.token),
            },
            { projection: { _id: 1 } }
        );

        if (!user) {
            return res.status(401).send('Invalid token');
        }

        res.locals.user = { id: user._id };
        return next();
    } catch (error) {
        return next(error);
    }
});

// Mount the router
apiServer.use('/api', router);

WebApp.connectHandlers.use(apiServer);
