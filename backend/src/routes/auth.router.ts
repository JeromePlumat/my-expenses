import { Router, type Request, type Response } from 'express';
import { AuthService } from '../services/auth.service.ts';
import type { RegisterInput, LoginInput } from '../types/auth.ts';
import { UsersService } from '../services/users.service.ts';

const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const input: RegisterInput = req.body;
    const result = await AuthService.register(input);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ error: message });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const input: LoginInput = req.body;
    const result = await AuthService.login(input);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ error: message });
  }
});

export default authRouter;