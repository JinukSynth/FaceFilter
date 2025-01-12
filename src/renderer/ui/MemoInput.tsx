// MemoInput.tsx
import React from "react";

interface MemoInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MemoInput: React.FC<MemoInputProps> = ({ value, onChange, className }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[#1A365D]">메모</label>
      <textarea
        className="w-full px-4 py-2 mt-1 border border-[#E2E8F0] rounded-md 
                  focus:ring-2 focus:ring-[#007ACC] focus:ring-opacity-25
                  bg-[#F8FAFC] text-[#1A365D] placeholder-gray-400
                  resize-none min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="메모를 입력하세요"
      />
    </div>
  );
};

export default MemoInput;