import { useState, useEffect } from 'react';
import { CellData, StatusType } from '../../types/components';
import { STATUS_OPTIONS } from '../ui/StatesButtons';

interface TimerState {
 time: string | null;
 isBlinking: boolean;
 currentTimer: string;
}

interface UseTimerProps {
 cellData: CellData | null;
 showStatusDialog: boolean;
}

const formatTime = (seconds: number): string => {
 const mins = Math.floor(seconds / 60);
 const secs = Math.floor(seconds % 60);
 return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const useTimer = ({ cellData, showStatusDialog }: UseTimerProps): TimerState => {
 const [time, setTime] = useState<string | null>(null);
 const [isBlinking, setIsBlinking] = useState(false);
 const [currentTimer, setCurrentTimer] = useState<string>("--:--");
 const [previousTimerType, setPreviousTimerType] = useState<"countdown" | "countup" | null>(null);

 const resetTimerState = () => {
   setTime(null);
   setIsBlinking(false);
   setCurrentTimer("--:--");
 };

 const getCurrentTimerType = (status: string | null): "countdown" | "countup" | null => {
   if (!status) return null;
   
   const isValidStatus = (s: string): s is StatusType => {
     return s in STATUS_OPTIONS;
   };
   
   if (!isValidStatus(status)) return null;
   return STATUS_OPTIONS[status].countType;
 };

 const updateTimerState = (currentTime: number) => {
  if (!cellData?.status) {
    resetTimerState();
    return;
  }

  const currentType = getCurrentTimerType(cellData.status);
  if (currentType !== previousTimerType) {
    setPreviousTimerType(currentType);
    if (currentType === "countup") {
      setIsBlinking(false);
      // countup으로 변경 시 startTime이 없다면 현재 시간을 startTime으로 설정
      if (cellData.startTime === undefined) {
        cellData.startTime = currentTime;
      }
    }
  }

  // countdown이 완료된 후 countup으로 변경 시
  if (currentType === "countup" && cellData.endTime !== undefined) {
    const elapsed = currentTime - (cellData.startTime ?? currentTime);
    setTime(formatTime(elapsed));
    setIsBlinking(false);
    return;
  }

  if (cellData.endTime !== undefined) {
    const remaining = Math.max((cellData.endTime ?? 0) - currentTime, 0);
    
    if (remaining === 0) {
      if (currentType === "countdown") {
        setTime("완료!");
        setIsBlinking(true);
      } else {
        const elapsed = currentTime - (cellData.startTime ?? currentTime);
        setTime(formatTime(elapsed));
        setIsBlinking(false);
      }
    } else {
      setTime(formatTime(remaining));
      setIsBlinking(false);
    }
  } else if (cellData.startTime !== undefined) {
    const elapsed = currentTime - cellData.startTime;
    setTime(formatTime(elapsed));
    setIsBlinking(false);
  }
};

 const updateModalTimerState = (currentTime: number) => {
   if (!cellData?.status || !showStatusDialog) {
     setCurrentTimer("--:--");
     return;
   }

   if (cellData.endTime !== undefined) {
     const remaining = Math.max(cellData.endTime - currentTime, 0);
     if (remaining === 0) {
       setCurrentTimer("--:--");
     } else {
       setCurrentTimer(formatTime(remaining));
     }
   } else if (cellData.startTime !== undefined) {
     const elapsed = currentTime - cellData.startTime;
     setCurrentTimer(formatTime(elapsed));
   }
 };

 // 타이머 타입 변경 감지를 위한 useEffect 
 useEffect(() => {
   const currentType = getCurrentTimerType(cellData?.status ?? null);
   if (currentType !== previousTimerType) {
     setPreviousTimerType(currentType);
     
     if (currentType === "countup") {
       setIsBlinking(false);
     }
   }
 }, [cellData?.status]);

 // 메인 타이머 로직
 useEffect(() => {
   if (!cellData?.status) {
     resetTimerState();
     return;
   }

   updateTimerState(Math.floor(Date.now() / 1000));

   const timer = window.setInterval(() => {
     updateTimerState(Math.floor(Date.now() / 1000));
   }, 1000);

   return () => {
     clearInterval(timer);
     resetTimerState();
   };
 }, [cellData?.endTime, cellData?.startTime, cellData?.status]);

 // 모달 타이머 로직
 useEffect(() => {
   if (!showStatusDialog || !cellData?.status) {
     setCurrentTimer("--:--");
     return;
   }

   updateModalTimerState(Math.floor(Date.now() / 1000));

   const timer = setInterval(() => {
     updateModalTimerState(Math.floor(Date.now() / 1000));
   }, 1000);

   return () => {
     clearInterval(timer);
     setCurrentTimer("--:--");
   };
 }, [cellData?.endTime, cellData?.startTime, cellData?.status, showStatusDialog]);

 return {
   time,
   isBlinking,
   currentTimer,
 };
};