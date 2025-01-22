import { useEffect, useState } from "react";
import { StatusType } from "../../types/components";
import { STATUS_OPTIONS } from "../ui/StatesButtons";

interface ModalState {
 isOpen: boolean;
 patientName: string;
 memo: string;
 status: StatusType | null;
 countdownMinutes: string;
 countdownSeconds: string;
 errors: {
   patientName?: string;
   status?: string;
   countdown?: string;
 };
}

interface UseModalStateProps {
 cellData: any;  
 onSubmit: (data: any) => void; 
}

export function useModalState({ cellData, onSubmit }: UseModalStateProps) {
  const initialState: ModalState = {
    isOpen: false,
    patientName: "",
    memo: "",
    status: null,
    countdownMinutes: "",
    countdownSeconds: "0",
    errors: {}
  };

 const [modalState, setModalState] = useState<ModalState>(initialState);

  useEffect(() => {
    if (modalState.isOpen) {
      const timer = setTimeout(() => {
        setModalState(prev => ({
          ...prev,
          patientName: cellData?.patientName || "",
          memo: cellData?.memo || "",
          status: cellData?.status || null,
          countdownMinutes: cellData?.countdownMinutes || "",
          countdownSeconds: cellData?.countdownSeconds || "0"
        }));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [modalState.isOpen, cellData]);

 const safeParseInt = (value: string): number => {
   const parsed = parseInt(value);
   return isNaN(parsed) ? 0 : Math.max(0, parsed);
 };

 const validateForm = (): boolean => {
   const errors: ModalState['errors'] = {};
   
   if (!modalState.patientName.trim()) {
     errors.patientName = "환자 이름을 입력해주세요";
   }

   if (!modalState.status) {
     errors.status = "상태를 선택해주세요";
   } else if (STATUS_OPTIONS[modalState.status].countType === "countdown") {
     const minutes = safeParseInt(modalState.countdownMinutes);
     const seconds = safeParseInt(modalState.countdownSeconds);
     
     if (minutes === 0 && seconds === 0) {
       errors.countdown = "시간을 입력해주세요";
     }
   }

   setModalState(prev => ({ ...prev, errors }));
   return Object.keys(errors).length === 0;
 };

  // openModal 함수 수정
const openModal = () => {
  const updateState = async () => {
    await new Promise<void>(resolve => {
      setModalState({
        isOpen: true,
        patientName: cellData?.patientName || "",
        memo: cellData?.memo || "",
        status: cellData?.status || null,
        countdownMinutes: cellData?.countdownMinutes || "",
        countdownSeconds: cellData?.countdownSeconds || "0",
        errors: {}
      });
      resolve();
    });
  };

  updateState();
};

 const closeModal = () => {
   setModalState(prev => ({ ...prev, isOpen: false }));
 };

 const resetModalState = () => {
   setModalState({
     isOpen: false,
     patientName: "",
     memo: "",
     status: null,
     countdownMinutes: "",
     countdownSeconds: "0",
     errors: {}
   });
 };

 const handlePatientNameChange = (patientName: string) => {
  console.log("이름 입력 시도:", patientName);
  setModalState(prev => {
    const newState = { ...prev, patientName };
    console.log("새로운 모달 상태:", newState);
    return newState;
  });
};

 const handleMemoChange = (memo: string) => {
   setModalState(prev => ({ ...prev, memo }));
 };

 const handleStatusChange = (status: StatusType) => {
   setModalState(prev => {
     // 이전 상태가 countdown이고 새로운 상태가 countup일 때
     if (
       prev.status && 
       STATUS_OPTIONS[prev.status].countType === "countdown" &&
       STATUS_OPTIONS[status].countType === "countup"
     ) {
       // countup으로 전환 시 countdown 관련 데이터 초기화
       return {
         ...prev,
         status,
         countdownMinutes: "",
         countdownSeconds: "0"
       };
     }
     return { ...prev, status };
   });
 };

 const handleCountdownMinutesChange = (minutes: string) => {
   setModalState(prev => ({ ...prev, countdownMinutes: minutes }));
 };

 const handleCountdownSecondsChange = (seconds: string) => {
   setModalState(prev => ({ ...prev, countdownSeconds: seconds }));
 };

 const handleSubmit = () => {
   if (validateForm()) {
     const currentTime = Math.floor(Date.now() / 1000);
     
     if (modalState.status && STATUS_OPTIONS[modalState.status]) {
       const { countType } = STATUS_OPTIONS[modalState.status];
       
       let submitData;
       
       if (countType === "countdown") {
         const minutes = safeParseInt(modalState.countdownMinutes);
         const seconds = safeParseInt(modalState.countdownSeconds);
         const totalSeconds = Math.max(1, (minutes * 60) + seconds);
         
         submitData = {
           patientName: modalState.patientName.trim(),
           memo: modalState.memo.trim(),
           status: modalState.status,
           startTime: undefined,  // countdown일 때는 startTime 제거
           endTime: currentTime + totalSeconds,
           countdownMinutes: minutes.toString(),
           countdownSeconds: seconds.toString()
         };
       } else {
         submitData = {
           patientName: modalState.patientName.trim(),
           memo: modalState.memo.trim(),
           status: modalState.status,
           startTime: currentTime,
           endTime: undefined,  // countup일 때는 endTime 제거
           countdownMinutes: "",
           countdownSeconds: "0"
         };
       }
       
       onSubmit(submitData);
       closeModal();
     }
   }
 };

 return {
   modalState,
   openModal,
   closeModal,
   resetModalState,
   handlePatientNameChange,
   handleMemoChange,
   handleStatusChange,
   handleCountdownMinutesChange,
   handleCountdownSecondsChange,
   handleSubmit
 };
}