import { ApiKeyRepository } from '@/domain/repositories/api-key-repository';
import { ApiKey } from '@/domain/models/api-key';
import { axiosClient } from '../http/axios-client';

export class ApiKeyService implements ApiKeyRepository {
    private getHeaders(token?: string) {
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    }

    async getApiKeys(token?: string): Promise<ApiKey[]> {
        const response = await axiosClient.get<any[]>('/api-keys', this.getHeaders(token));
        return response.data.map(key => ({
            ...key,
            id: String(key.id || key.api_key_id || key._id || ''),
            createdAt: key.createdAt || key.created_at || new Date().toISOString()
        }));
    }

    async createApiKey(name: string, token?: string): Promise<ApiKey> {
        try {
            console.log('Creating API key:', token);
            const response = await axiosClient.post<any>('/api-keys', { name }, this.getHeaders(token));
            const key = response.data;
            return {
                ...key,
                id: String(key.id || key.api_key_id || key._id || ''),
                createdAt: key.createdAt || key.created_at || new Date().toISOString()
            };
        } catch (error) {
            console.error('Error creating API key:', error);
            console.log('Error API key:', error);
            throw error;
        }

    }

    async deleteApiKey(id: string, token?: string): Promise<void> {
        await axiosClient.delete(`/api-keys/${id}`, this.getHeaders(token));
    }
}

export const apiKeyService = new ApiKeyService();
