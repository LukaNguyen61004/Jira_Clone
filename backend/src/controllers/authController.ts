import { Request, Response } from "express";
import { AuthService } from "../services/authServices";
import { RegisterRequest, LoginResquest } from "../types";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const data = req.body as RegisterRequest;

            const { user, token } = await AuthService.register(data);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 100
            });

            res.status(201).json({
                message: 'User regsitered successfully',
                user
            });

        } catch (error) {
            console.error('Register error', error);

            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const data = req.body as LoginResquest;

            const { user, token } = await AuthService.login(data);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 100
            });

            res.json({
                message: 'Login successful',
                user,
                token
            });

        } catch (error) {
            console.error('Login error:', error);

            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });

        }
    }
    
    static async getCurrentUser(req: Request, res: Response) {
        try {

            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const user = await AuthService.getUserById(userId);
            res.json({ user });

        } catch (error) {
            console.error('Get current user error:', error);

            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: 'Server error' });
        }
    }

    static async logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    }
}