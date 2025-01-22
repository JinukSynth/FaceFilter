import React from "react";
import { Input } from "./Input";

interface CountdownInputProps {
  minutes: string;
  seconds: string;
  onChangeMinutes: (value: string) => void;
  onChangeSeconds: (value: string) => void;
  currentTimer?: string;
  error?: string;  // 에러 메시지 추가
}

const CountdownInput = ({ minutes, seconds, onChangeMinutes, onChangeSeconds, currentTimer, error }: CountdownInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={minutes}
          onChange={(e) => onChangeMinutes(e.target.value)}
          placeholder="분"
          className={`w-20 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        <span>분</span>
        <Input
          type="number"
          value={seconds}
          onChange={(e) => onChangeSeconds(e.target.value)}
          placeholder="초"
          className={`w-20 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        <span>초</span>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CountdownInput; 