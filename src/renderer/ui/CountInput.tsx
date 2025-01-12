import React from "react";
import { Input } from "./Input";

interface CountdownInputProps {
  minutes: string;
  seconds: string;
  onChangeMinutes: (value: string) => void;
  onChangeSeconds: (value: string) => void;
  currentTimer?: string;
}

export default function CountdownInput({ minutes, seconds, onChangeMinutes, onChangeSeconds, currentTimer }: CountdownInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      {/* 실시간 타이머 표시 */}
      {currentTimer && (
        <div className="text-center text-lg font-bold">
          현재 타이머: {currentTimer}
        </div>
      )}
      <div className="flex space-x-2">
        <div>
          <label className="block text-sm font-medium mb-1">타이머 설정 (분)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={minutes}
            onChange={(e) => onChangeMinutes(e.target.value)}
            placeholder="분"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">타이머 설정 (초)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={seconds}
            onChange={(e) => onChangeSeconds(e.target.value)}
            placeholder="초"
            min="0"
            max="59"
          />
        </div>
      </div>
    </div>
  );
}
