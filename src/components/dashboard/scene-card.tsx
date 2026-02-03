'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Scene } from '@/lib/types';
import { Card } from '../ui/card';
import { Film, Sunrise, Bed, DoorClosed } from 'lucide-react';
import React from 'react';

const iconMap: { [key: string]: React.ElementType } = {
  Film,
  Sunrise,
  Bed,
  DoorClosed,
};

export function SceneCard({ scene }: { scene: Scene }) {
  const { toast } = useToast();
  const Icon = iconMap[scene.iconName];

  const handleActivate = () => {
    toast({
      title: 'Scene Activated',
      description: `"${scene.name}" scene is now active.`,
    });
  };

  return (
    <Card
      className="p-0 overflow-hidden"
    >
      <Button
        variant="ghost"
        className="h-24 w-full flex-col justify-center gap-2 text-base font-semibold hover:bg-accent/10"
        onClick={handleActivate}
      >
        {Icon && <Icon className="h-6 w-6 text-accent" />}
        <span>{scene.name}</span>
      </Button>
    </Card>
  );
}
