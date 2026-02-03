'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addDevice } from '@/app/actions';
import { useRef, useState, useTransition } from 'react';
import type { ApiKey } from '@/lib/types';

export function AddDeviceDialog({ apiKeys, userId, onSuccess }: { apiKeys: ApiKey[], userId: string, onSuccess?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAction = async (formData: FormData) => {
    formData.append('userId', userId);
    startTransition(async () => {
      await addDevice(formData);
      formRef.current?.reset();
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={apiKeys.length === 0}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Enter the details for your new smart home device.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKeyId" className="text-right">
              API Key
            </Label>
            <Select name="apiKeyId" required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an API Key" />
              </SelectTrigger>
              <SelectContent>
                {apiKeys.map((key) => (
                  <SelectItem key={key.id} value={key.id}>{key.name} - ({key.key.slice(0, 10)}...)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" className="col-span-3" placeholder="e.g., Bedroom Lamp" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">
              Room
            </Label>
            <Input id="room" name="room" className="col-span-3" placeholder="e.g., Bedroom" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select name="type" required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="thermostat">Thermostat</SelectItem>
                <SelectItem value="switch">Switch</SelectItem>
                <SelectItem value="fan">Fan</SelectItem>
                <SelectItem value="tv">TV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Device'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}