import { DeviceRepository } from '@/domain/repositories/device-repository';
import { Device } from '@/domain/models/device';
import { axiosClient } from '../http/axios-client';

export class DeviceService implements DeviceRepository {
    private getHeaders(token?: string) {
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    }

    async getDevices(token?: string): Promise<Device[]> {
        const response = await axiosClient.get<any[]>('/devices', this.getHeaders(token));
        return response.data.map(device => ({
            ...device,
            apiKeyId: device.apiKeyId || device.api_key_id
        }));
    }

    async addDevice(device: Omit<Device, "id">, token?: string): Promise<Device> {
        try {
            console.log("Add device payload:", device);
            const payload = {
                ...device,
                api_key_id: device.apiKeyId
            };
            const response = await axiosClient.post<Device>("/devices/add", payload, this.getHeaders(token));
            return response.data;
        } catch (error: any) {
            console.error("Add device failed");
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Response data:", error.response.data);
            }
            throw error;
        }
    }

    async deleteDevice(id: string, token?: string): Promise<void> {
        await axiosClient.delete(`/devices/${id}`, this.getHeaders(token));
    }

    async updateDevice(id: string, device: Partial<Device>, token?: string): Promise<Device> {
        const payload = {
            ...device,
            api_key_id: device.apiKeyId
        };
        const response = await axiosClient.patch<Device>(`/devices/${id}`, payload, this.getHeaders(token));
        return response.data;
    }
}

export const deviceService = new DeviceService();
