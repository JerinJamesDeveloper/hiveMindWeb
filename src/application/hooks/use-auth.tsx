'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/domain/models/user';
import { LoginCredentials } from '@/domain/models/auth';
import { authService } from '@/infrastructure/services/auth-service';
import { LoginUseCase } from '../use-cases/auth/login-use-case';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: LoginCredentials, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // UseCase instantiation (Dependency Injection could be more sophisticated)
    const loginUseCase = new LoginUseCase(authService);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const user = await authService.getCurrentUser();
            setUser(user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(credentials: LoginCredentials) {
        const response = await loginUseCase.execute(credentials);
        setUser(response.user);
    }

    async function signup(credentials: LoginCredentials, name: string) {
        const response = await authService.signup(credentials, name);
        setUser(response.user);
    }

    async function logout() {
        await authService.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
