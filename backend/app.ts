import express, { type NextFunction, type Request, type Response } from 'express';
import logger from 'morgan';
import cors from 'cors';
import { createYoga } from 'graphql-yoga';
import helmet from 'helmet';

import type { GraphQLContext } from './src/types/GraphQLContext.ts';
import authRouter from './src/routes/auth.router.ts';
import { schema } from './src/graphql/schema.ts';
import { AuthService } from './src/services/auth.service.ts';
import { maskError } from './src/graphql/errorFormatter.ts';

const app = express();

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Apply Helmet with proper configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline only for dev
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // For development with external resources
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

app.get('/ping', (req, res) => {
  res.sendStatus(204);
});

// app.use('/api/expenses', authMiddleware, expensesRouter);
// app.use('/api/users', authMiddleware, usersRouter);
// app.use('/api/categories', authMiddleware, categoriesRouter);
app.use('/api/auth', authRouter);



const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  // Yoga ships its own CORS handling, separate from the `cors()` middleware
  // above — and its default reflects back whatever Origin it is sent. Turn
  // it off so /graphql respects the same allowlist as the REST routes.
  cors: false,
  // By default Yoga replaces every resolver error with "Unexpected error." so a
  // production server never leaks internals. In development you want the details of what went bad.
  maskedErrors: {
    maskError,
    isDev: process.env.NODE_ENV !== 'production',
  },
  context: async ({ request }): Promise<GraphQLContext> => {
    // Extract token from Authorization header
    // Note: yoga uses the Web API `request.headers.get()`, not Node's req.headers
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : '';

    console.log('token', token);
    if (token) {
      try {
        const user = AuthService.verifyToken(token);
        console.log('user', user);
        return { user };
      } catch {
        // Invalid token - continue as unauthenticated
        return {};
      }
    }

    return {};
  },
});
app.use(yoga.graphqlEndpoint, yoga);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export default app;
