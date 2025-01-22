import React from "react";
import { StatusType, StatusOption } from "src/types/components";

export const STATUS_OPTIONS: Record<StatusType, StatusOption> = {
  "시술 마취 중": { color: "#FFD700", countType: "countdown" },  // 골드 (더 밝은 톤)
  "제모 마취 중": { color: "#DDA0DD", countType: "countdown" },  // 연한 자주색 (플럼)
  "머미 중": { color: "#98FB98", countType: "countdown" },       // 연한 녹색 (페일그린)
  "시술 중": { color: "#FFA07A", countType: "countup" },       // 연한 살구색 (라이트 살몬)
  "대기중": { color: "#87CEEB", countType: "countup" },         // 하늘색 (스카이블루)
} as const;

interface StatusButtonsProps {
  selectedStatus: StatusType | null;
  onSelect: (status: StatusType) => void;
  error?: string;  // 에러 메시지 추가
}

const StatusButtons = ({ selectedStatus, onSelect, error }: StatusButtonsProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(STATUS_OPTIONS).map(([status, option]) => (
          <button
            key={status}
            onClick={() => onSelect(status as StatusType)}
            className={`px-4 py-2 rounded-md ${
              selectedStatus === status
                ? 'ring-2 ring-offset-2 ring-[#007ACC]'
                : error  // 에러가 있을 때 빨간 테두리 추가
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
            style={{ backgroundColor: option.color }}
          >
            {status}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default StatusButtons;