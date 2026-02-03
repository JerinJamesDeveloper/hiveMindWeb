import { LoginCredentials, AuthResponse } from '../models/auth';
import { User } from '../models/user';

export interface AuthRepository {
    signup(credentials: LoginCredentials, name: string): Promise<AuthResponse>;
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    sendOtp(email: string): Promise<void>;
}
