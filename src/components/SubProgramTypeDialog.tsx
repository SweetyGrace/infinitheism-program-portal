
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

interface SubProgramTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'HDB' | 'MSD') => void;
}

export const SubProgramTypeDialog = ({ isOpen, onClose, onSelect }: SubProgramTypeDialogProps) => {
  const [selectedType, setSelectedType] = useState<'HDB' | 'MSD'>('HDB');

  const handleConfirm = () => {
    onSelect(selectedType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Sub-Program Type</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Label>What type of sub-program would you like to create?</Label>
          <RadioGroup value={selectedType} onValueChange={(value: 'HDB' | 'MSD') => setSelectedType(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="HDB" id="hdb" />
              <Label htmlFor="hdb">HDB</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MSD" id="msd" />
              <Label htmlFor="msd">MSD</Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Create Sub-Program</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
