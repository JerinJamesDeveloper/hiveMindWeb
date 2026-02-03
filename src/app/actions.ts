'use server';

import {
  smartHomeSuggestions,
  type SmartHomeSuggestionsOutput,
} from '@/ai/flows/smart-home-suggestions';
import type { DeviceType } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { deviceService } from '@/infrastructure/services/device-service';
import { apiKeyService } from '@/infrastructure/services/api-key-service';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}


// Mock data for the GenAI flow input
const mockInput = {
  userId: 'user-12345',
  historicalUsageData: JSON.stringify({
    daily_avg_kwh: 15,
    peak_hours: '6-9pm',
    lighting_usage_hours: 8,
    thermostat_schedule: '22C day, 19C night',
  }),
  preferences: JSON.stringify({
    automation_level: 'high',
    away_mode: 'enabled',
    preferred_temp_range: [20, 23],
  }),
};

export async function getSmartSuggestions(): Promise<{
  suggestions?: SmartHomeSuggestionsOutput['suggestions'];
  error?: string;
}> {
  try {
    const result = await smartHomeSuggestions(mockInput);
    if (!result || !result.suggestions) {
      return { error: 'Failed to generate suggestions. The AI returned an empty response.' };
    }
    return { suggestions: result.suggestions };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while contacting the AI. Please try again later.' };
  }
}

const iconMap: { [key: string]: string } = {
  light: 'Lightbulb',
  thermostat: 'Thermometer',
  fan: 'Wind',
  tv: 'Tv2',
  switch: 'ToggleLeft',
};

export async function addDevice(formData: FormData) {
  const name = formData.get('name') as string;
  const room = formData.get('room') as string;
  const type = formData.get('type') as DeviceType;
  const apiKeyId = formData.get('apiKeyId') as string;
  const userId = formData.get('userId') as string;

  if (!userId || !name || !room || !type || !apiKeyId) {
    return;
  }

  const newDevice = {
    name,
    room,
    type,
    state: 'off' as const,
    status: 'online' as const,
    iconName: iconMap[type] || 'ToggleLeft',
    apiKeyId,
  };

  const token = await getAuthToken();
  await deviceService.addDevice(newDevice, token);
  revalidatePath('/automations');
}

export async function deleteDevice(id: string, userId: string) {
  if (!userId) {
    return;
  }
  const token = await getAuthToken();
  await deviceService.deleteDevice(id, token);
  revalidatePath('/automations');
}

export async function generateApiKey(userId: string, username: string) {
  if (!userId) {
    return;
  }

  const token = await getAuthToken();
  await apiKeyService.createApiKey(username, token);

  revalidatePath('/dashboard');
  revalidatePath('/automations');
}

export async function deleteApiKey(id: string, userId: string) {
  if (!userId) {
    return;
  }
  const token = await getAuthToken();
  await apiKeyService.deleteApiKey(id, token);
  revalidatePath('/dashboard');
  revalidatePath('/automations');
}
