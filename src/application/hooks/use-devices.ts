import { useState, useEffect } from 'react';
import { Device } from '@/domain/models/device';
import { deviceService } from '@/infrastructure/services/device-service';

export function useDevices() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    async function fetchDevices() {
        try {
            const data = await deviceService.getDevices();
            setDevices(data);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return { devices, loading, error, refresh: fetchDevices };
}
