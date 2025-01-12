import React, { useLayoutEffect, useRef } from "react";
import { Input } from "../ui/Input";
import { StatusType } from "../../types/components";

interface InputWithFocusProps {
  modalState: {
    isOpen: boolean;
    patientName: string;
    memo: string;
    status: StatusType | null;
    countdownMinutes: string;
    countdownSeconds: string;
  };
  handlePatientNameChange: (value: string) => void;
}

const InputWithFocus = ({ modalState, handlePatientNameChange }: InputWithFocusProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (modalState.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalState.isOpen]);

  return (
    <Input 
      ref={inputRef}
      type="text" 
      tabIndex={0}
      className="w-full px-4 py-2 border border-[#E2E8F0] rounded-md 
                focus:ring-2 focus:ring-[#007ACC] focus:ring-opacity-25
                bg-[#F8FAFC] text-[#1A365D]" 
      value={modalState.patientName}
      onChange={(e) => handlePatientNameChange(e.target.value)}
      placeholder="환자 이름을 입력하세요"
    />
  );
};

export default InputWithFocus;