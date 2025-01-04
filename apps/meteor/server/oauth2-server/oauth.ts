import { OAuthServer } from '@rocket.chat/oauth';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { Users } from '@rocket.chat/models';
import { Accounts } from 'meteor/accounts-base';
import { settings } from '../../../../app/settings/server';

const app = express();

// Apply rate limiting to prevent DoS attacks
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests, please try again later.',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all routes
app.use(apiLimiter);

app.post('/oauth/authorize', async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Debugging middleware example (can be removed or extended as needed)
		console.debugMiddleware(req);

		// Check if the request allows authorization
		if (req.body.allow !== 'yes') {
			return res.status(401).send({
				error: 'access_denied',
				error_description: 'The user denied access to your application.',
			});
		}

		// Validate access token
		if (req.body.token && req.body.access_token) {
			req.body.access_token = req.body.token;
		}

		if (!req.body.access_token) {
			return res.status(401).send('No token');
		}

		// Find the user using the hashed token
		const user = await Users.findOne(
			{ 'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(req.body.access_token) },
			{ projection: { _id: 1 } }
		);

		// Handle invalid user
		if (!user) {
			return res.status(401).send('Invalid token');
		}

		// Set the user ID in the response
		res.locals.user = { id: user._id };

		return next();
	} catch (error) {
		console.error('Error in /oauth/authorize:', error);
		res.status(500).send({ error: 'Internal Server Error' });
	}
});

// Add other routes as necessary
app.post('/oauth/token', async (req: Request, res: Response) => {
	// Example route for token management (placeholder for your implementation)
	res.status(501).send({ error: 'Not implemented' });
});

export default app;
