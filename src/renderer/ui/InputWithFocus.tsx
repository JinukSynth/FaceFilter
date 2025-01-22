import React, { useLayoutEffect, useRef } from "react";
import { Input } from "../ui/Input";
import { StatusType } from "../../types/components";

interface InputWithFocusProps {
  modalState: {
    patientName: string;
    errors?: {
      patientName?: string;
    };
  };
  handlePatientNameChange: (value: string) => void;
}

const InputWithFocus = ({ modalState, handlePatientNameChange }: InputWithFocusProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1">
      <Input 
        ref={inputRef}
        type="text" 
        tabIndex={0}
        className={`w-full px-4 py-2 border rounded-md 
                   ${modalState.errors?.patientName 
                     ? 'border-red-500 focus:ring-red-500' 
                     : 'border-[#E2E8F0] focus:ring-[#007ACC]'}
                   focus:ring-2 focus:ring-opacity-25
                   bg-[#F8FAFC] text-[#1A365D]`}
        value={modalState.patientName}
        onChange={(e) => handlePatientNameChange(e.target.value)}
        placeholder="환자 이름을 입력하세요"
      />
      {modalState.errors?.patientName && (
        <p className="text-sm text-red-500">{modalState.errors.patientName}</p>
      )}
    </div>
  );
};

export default InputWithFocus;