// src/types/components.ts

export type StatusType = "시술 마취 중" | "제모 마취 중" | "머미 중" | "시술 중" | "대기중";
export type CountType = "countdown" | "countup";

export interface StatusOption {
  color: string;
  countType: CountType;
}

export interface CellData {
  row: number;
  col: number;
  patientName: string;
  status: StatusType | null;
  startTime: number;
  endTime?: number;
  memo?: string;
  timerActive?: boolean;
  timestamp: number;
  sender_id?: string;
}

export interface Section {
  label: string;
  rooms: string[];
}

// 섹션 타입 정의
export type SectionType = 'surgery' | 'co2' | 'co2etc';

export interface CellProps {
  // section: SectionType;
  roomName: string;
  row: number;
  col: number;
  data?: CellData | null;
  onUpdate?: (data: CellData) => Promise<void>;
  onReset?: () => Promise<void>;
  allCellsData: Record<string, CellData>;  // 추가된 부분
}