import type { Scene, User } from '@/lib/types';

export const users: User[] = [
  {
    id: 'user-001',
    name: 'Alex Ryder',
    avatar: 'https://picsum.photos/seed/1/100/100',
  },
];

export const scenes: Scene[] = [
  {
    id: 'scene-movie',
    name: 'Movie Night',
    iconName: 'Film',
  },
  {
    id: 'scene-morning',
    name: 'Good Morning',
    iconName: 'Sunrise',
  },
  {
    id: 'scene-sleep',
    name: 'Good Night',
    iconName: 'Bed',
  },
  {
    id: 'scene-away',
    name: 'Away',
    iconName: 'DoorClosed',
  },
];
