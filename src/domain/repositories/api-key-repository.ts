import { ApiKey } from '../models/api-key';

export interface ApiKeyRepository {
    getApiKeys(token?: string): Promise<ApiKey[]>;
    createApiKey(name: string, token?: string): Promise<ApiKey>;
    deleteApiKey(id: string, token?: string): Promise<void>;
}
