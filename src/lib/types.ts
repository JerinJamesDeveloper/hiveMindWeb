export type DeviceType = 'light' | 'thermostat' | 'switch' | 'fan' | 'tv';

export type Device = {
  id: string;
  name: string;
  room: string;
  type: DeviceType;
  state: 'on' | 'off' | number; // number for thermostat
  iconName?: string;
  apiKeyId?: string;
};

export type Scene = {
  id: string;
  name: string;
  iconName: string;
};

export type User = {
  id: string;
  name: string;
  avatar: string; // URL to avatar image
};

export type ApiKey = {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  userId: string;
};

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
