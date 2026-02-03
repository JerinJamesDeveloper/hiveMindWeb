export interface LoginCredentials {
    email: string;
    password?: string;
    otp?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
}
