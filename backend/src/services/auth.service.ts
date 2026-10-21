import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db.ts';
import type { AuthResponse, LoginInput, RegisterInput } from '../types/auth.ts';
import { AuthenticationError, ConflictError } from '../errors/app.error.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use';
const SALT_ROUNDS = 10;

export class AuthService {
  static async register(input: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await db.orm.public.User.where({ email: input.email }).first();

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const user = await db.orm.public.User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async login(input: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await db.orm.public.User.where({ email: input.email }).first();

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const validPassword = await bcrypt.compare(input.password, user.password);

    if (!validPassword) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static verifyToken(token: string): { userId: number; email: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}