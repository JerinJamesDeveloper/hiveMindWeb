import { AuthRepository } from '@/domain/repositories/auth-repository';
import { LoginCredentials, AuthResponse } from '@/domain/models/auth';

export class LoginUseCase {
    constructor(private authRepository: AuthRepository) { }

    async execute(credentials: LoginCredentials): Promise<AuthResponse> {
        // Add any business logic here (e.g., validation before repo call)
        if (!credentials.email) {
            throw new Error('Email is required');
        }
        return this.authRepository.login(credentials);
    }
}
