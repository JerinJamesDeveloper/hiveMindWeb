export type DeviceType = 'light' | 'thermostat' | 'fan' | 'tv' | 'switch';

export interface Device {
    id: string;
    name: string;
    type: DeviceType;
    room: string;
    state: 'on' | 'off' | number;
    status: 'online' | 'offline';
    lastSeen?: string;
    iconName?: string;
    apiKeyId?: string;
    // Add other fields as per original firebase structure if known, generic for now
}
