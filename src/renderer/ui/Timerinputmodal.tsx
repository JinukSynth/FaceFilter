import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Input } from './Input';

interface TimerInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
  status: string;
}

export function TimerInputModal({ isOpen, onClose, onConfirm, status }: TimerInputModalProps) {
  const [minutes, setMinutes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConfirm = () => {
    const parsedMinutes = parseInt(minutes, 10);
    if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
      setError('올바른 시간을 입력해주세요 (1분 이상)');
      return;
    }
    onConfirm(parsedMinutes), setMinutes('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{status} 타이머 설정 </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="minutes" className="text-sm font-medium">타이머 시간 (분)</label>
            <Input className="w-full p-2 border rounded-md" id="minutes" type="number" min="1" value={minutes}
              onChange={(e) => {
                setMinutes(e.target.value);
                setError('');
              }}
              placeholder="분 단위로 입력하세요"
            />
            {error && (
              <span className="text-red-500 text-sm">{error}</span>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            확인
          </button>
          
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 ml-2">
            취소
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}