import { GraphQLError } from 'graphql';
import { AppError } from '../errors/app.error.ts';

/**
 * Custom error masking hook for graphql-yoga v5.
 * Wired via `maskedErrors: { maskError }` in createYoga().
 *
 * - AppError subclasses (ValidationError, AuthenticationError, …) surface
 *   their message and code as GraphQL extensions.
 * - In dev mode all other errors are passed through unmasked.
 * - In production unknown errors return a generic message.
 */
export function maskError(error: unknown, message: string, isDev?: boolean): Error {
  // Log for debugging (replace with a proper logger in production)
  console.error('GraphQL Error:', error);

  // Yoga wraps resolver errors in a GraphQLError; unwrap to the original.
  const originalError = (error as any)?.originalError ?? error;

  if (originalError instanceof AppError) {
    // Convert to GraphQLError so extensions appear in the response payload.
    return new GraphQLError(originalError.message, {
      extensions: {
        code: originalError.code,
        statusCode: originalError.statusCode,
      },
    });
  }

  // In development surface the real error; in production hide internals.
  if (isDev) {
    return error as Error;
  }

  return new Error(message);
}
