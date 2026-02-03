import { useState, useEffect } from 'react';
import { ApiKey } from '@/domain/models/api-key';
import { apiKeyService } from '@/infrastructure/services/api-key-service';

export function useApiKeys() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchApiKeys();
    }, []);

    async function fetchApiKeys() {
        try {
            const data = await apiKeyService.getApiKeys();
            setApiKeys(data);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    async function createApiKey(name: string) {
        const newKey = await apiKeyService.createApiKey(name);
        setApiKeys([...apiKeys, newKey]);
        return newKey;
    }

    async function deleteApiKey(id: string) {
        await apiKeyService.deleteApiKey(id);
        setApiKeys(apiKeys.filter(k => k.id !== id));
    }

    return { apiKeys, loading, error, createApiKey, deleteApiKey, refresh: fetchApiKeys };
}
