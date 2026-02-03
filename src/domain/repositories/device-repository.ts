import { Device } from '../models/device';

export interface DeviceRepository {
    getDevices(token?: string): Promise<Device[]>;
    addDevice(device: Omit<Device, 'id'>, token?: string): Promise<Device>;
    deleteDevice(id: string, token?: string): Promise<void>;
    updateDevice(id: string, device: Partial<Device>, token?: string): Promise<Device>;
}
