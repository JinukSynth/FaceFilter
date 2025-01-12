import React from "react";
import { StatusType, StatusOption } from "src/types/components";

export const STATUS_OPTIONS: Record<StatusType, StatusOption> = {
  "시술 마취 중": { color: "#FFD700", countType: "countdown" },  // 골드 (더 밝은 톤)
  "제모 마취 중": { color: "#DDA0DD", countType: "countdown" },  // 연한 자주색 (플럼)
  "머미 중": { color: "#98FB98", countType: "countdown" },       // 연한 녹색 (페일그린)
  "시술 중": { color: "#FFA07A", countType: "countup" },       // 연한 살구색 (라이트 살몬)
  "대기중": { color: "#87CEEB", countType: "countup" },         // 하늘색 (스카이블루)
} as const;

type StatusButtonsProps = {
  selectedStatus: StatusType | null;
  onSelect: (status: StatusType) => void;
  className?: string;
};

export default function StatusButtons({
  selectedStatus,
  onSelect,
  className
}: StatusButtonsProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {Object.entries(STATUS_OPTIONS).map(([status, { color }]) => (
        <button
          key={status}
          className={`w-full py-2.5 text-black rounded-md shadow-sm
                     transition-colors duration-200
                     ${selectedStatus === status 
                       ? 'ring-2 ring-offset-1'
                       : 'hover:opacity-90'}`}
          style={{
            backgroundColor: color
          }}
          onClick={() => onSelect(status as StatusType)}
        >
          {status}
        </button>
      ))}
    </div>
  );
}