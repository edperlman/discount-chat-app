import { OAuthServer } from 'oauth2-server';
import { RateLimiter } from 'meteor/ddp-rate-limiter';
import { OAuthApps, Users } from '@rocket.chat/models'; // Import Rocket.Chat models
import { Meteor } from 'meteor/meteor';

export const oauth = new OAuthServer({
  model: {}, // Your OAuth server model
});

// Add rate limiting rules for `/oauth/authorize` and `/oauth/token`
RateLimiter.addRule({
  type: 'method',
  name: '/oauth/authorize', // Rate limit the authorize endpoint
  connectionId() {
    return true; // Apply to all connections
  },
}, 100, 15 * 1000); // Allow 100 requests every 15 seconds

RateLimiter.addRule({
  type: 'method',
  name: '/oauth/token', // Rate limit the token endpoint
  connectionId() {
    return true; // Apply to all connections
  },
}, 100, 15 * 1000); // Allow 100 requests every 15 seconds

export default function setupRoutes(app) {
  app.post(
    '/oauth/authorize',
    async (req, res, next) => {
      const request = new OAuthServer.Request(req);
      const response = new OAuthServer.Response(res);

      try {
        await oauth.authorize(request, response, {
          authenticateHandler: {
            async handle() {
              const clientId = req.body.client_id || req.query.client_id;

              if (!clientId) {
                throw new Error('Missing parameter: client_id');
              }

              // Use `Users` model to fetch and update user data
              const user = await Users.findOne({ _id: res.locals.user.id });
              if (!user) {
                throw new Error('User not found');
              }

              if (req.body.allow === 'yes') {
                await Users.updateOne(
                  { _id: res.locals.user.id },
                  { $addToSet: { allowedClients: clientId } }
                );
              }

              return { id: user._id };
            },
          },
        });

        res.locals.oauth = { response };
        next();
      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    '/oauth/token',
    async (req, res, next) => {
      const request = new OAuthServer.Request(req);
      const response = new OAuthServer.Response(res);

      try {
        const token = await oauth.token(request, response);

        // Example: Use `OAuthApps` model to validate app
        const app = await OAuthApps.findOne({ clientId: req.body.client_id });
        if (!app) {
          throw new Error('Invalid OAuth application');
        }

        res.json(token);
      } catch (err) {
        res.status(err.status || 500).json(err);
      }
    }
  );
}
