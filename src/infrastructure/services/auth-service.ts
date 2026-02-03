import { AuthRepository } from '@/domain/repositories/auth-repository';
import { LoginCredentials, AuthResponse } from '@/domain/models/auth';
import { User } from '@/domain/models/user';
import { axiosClient } from '../http/axios-client';

export class AuthService implements AuthRepository {
    private setTokenCookie(token: string) {
        if (typeof window !== 'undefined') {
            const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
            document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; ${secure}`;
        }
    }

    private removeTokenCookie() {
        if (typeof window !== 'undefined') {
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        }
    }

    async signup(credentials: LoginCredentials, name: string): Promise<AuthResponse> {
        const response = await axiosClient.post<AuthResponse>('/auth/signup', { ...credentials, name });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.setTokenCookie(response.data.token);
        }
        return response.data;
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            this.setTokenCookie(response.data.token);
        }
        return response.data;
    }

    async logout(): Promise<void> {
        await axiosClient.post('/auth/logout');
        localStorage.removeItem('token');
        this.removeTokenCookie();
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            if (!token && typeof document !== 'undefined') {
                const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
                token = match ? decodeURIComponent(match[1]) : null;
            }

            if (!token) return null;

            const response = await axiosClient.get<User>('/auth/me');
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async sendOtp(email: string): Promise<void> {
        await axiosClient.post('/auth/send-otp', { email });
    }
}

export const authService = new AuthService();
