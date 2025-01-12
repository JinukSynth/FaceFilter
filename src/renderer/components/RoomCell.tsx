// import React, { useEffect, useRef } from "react";
// import { CellProps, StatusType } from "../../types/components";
// import MemoInput from "../ui/MemoInput";
// import StatusButtons, { STATUS_OPTIONS } from "../ui/StatesButtons";
// import CountdownInput from "../ui/CountInput";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/Dialog";
// import { useTimer } from "../hooks/useTimer";
// import { useFirebaseCell } from "../hooks/useFirebase";
// import { useModalState } from "../hooks/useModalState";
// import { Button } from "../ui/Button";
// import { Input } from "../ui/Input";

// interface InputWithFocusProps {
//   modalState: {
//     isOpen: boolean;
//     patientName: string;
//     memo: string;
//     status: StatusType | null;
//     countdownMinutes: string;
//     countdownSeconds: string;
//   };
//   handlePatientNameChange: (value: string) => void;
// }

// // InputWithFocus 컴포넌트 추가 (컴포넌트 최상단)
// const InputWithFocus = ({ modalState, handlePatientNameChange }: InputWithFocusProps) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (modalState.isOpen && inputRef.current) {
//       const input = inputRef.current;
  
//       // 1차 렌더 후 reflow 강제
//       requestAnimationFrame(() => {
//         input.getBoundingClientRect(); // 강제 리플로우
  
//         // pointer-events 복구
//         input.style.pointerEvents = 'auto';
//         let parent = input.parentElement;
//         while (parent) {
//           if (window.getComputedStyle(parent).pointerEvents === 'none') {
//             parent.style.pointerEvents = 'auto';
//           }
//           parent = parent.parentElement;
//         }
  
//         // 강제로 click 이벤트 발생 (개발자 도구로 선택한 상황 흉내)
//         const clickEvent = new MouseEvent('click', { bubbles: true });
//         input.dispatchEvent(clickEvent);
  
//         // 2차 렌더 후 focus
//         requestAnimationFrame(() => {
//           input.focus();
//         });
//       });
//     }
//   }, [modalState.isOpen]);
  
//   return (
//     <Input 
//       ref={inputRef}
//       type="text" 
//       className="w-full px-4 py-2 border border-[#E2E8F0] rounded-md 
//                 focus:ring-2 focus:ring-[#007ACC] focus:ring-opacity-25
//                 bg-[#F8FAFC] text-[#1A365D]" 
//       value={modalState.patientName}
//       onChange={(e) => handlePatientNameChange(e.target.value)}
//       placeholder="환자 이름을 입력하세요"
//     />
//   );
// };

// export default function RoomCell({ row, col, data, roomName, onUpdate, onReset }: CellProps) {
//   const { cellData, updateCell, resetCell } = useFirebaseCell({
//     row,
//     col,
//     initialData: data
//   });

//   const { 
//     modalState,
//     openModal,
//     closeModal,
//     handlePatientNameChange,
//     handleMemoChange,
//     handleStatusChange,
//     handleCountdownMinutesChange,
//     handleCountdownSecondsChange,
//     handleSubmit,
//     resetModalState
//   } = useModalState({ 
//     cellData, 
//     onSubmit: updateCell 
//   });

//   const { time, isBlinking, currentTimer } = useTimer({
//     cellData,
//     showStatusDialog: modalState.isOpen
//   });

  

//   // const handleReset = async () => {
//   //   if (window.confirm("이 셀을 초기화하시겠습니까?")) {
//   //     try {
//   //       await resetCell();
//   //       closeModal();
//   //       resetModalState();
//   //     } catch (error) {
//   //       alert("셀 초기화에 실패했습니다.");
//   //     }
//   //   }
//   // };
//   // handleReset도 수정
//   // const handleReset = async () => {
//   //   if (window.confirm("이 셀을 초기화하시겠습니까?")) {
//   //     try {
//   //       // 모달 먼저 닫기
//   //       closeModal();
//   //       resetModalState();
        
//   //       // 그 다음 셀 초기화
//   //       await resetCell();
//   //     } catch (error) {
//   //       alert("셀 초기화에 실패했습니다.");
//   //     }
//   //   }
//   // };
//   const handleReset = async () => {
//     if (window.confirm("이 셀을 초기화하시겠습니까?")) {
//       try {
//         console.log("1. 초기화 시작");
//         closeModal();
//         console.log("2. 모달 닫힘");
//         resetModalState();
//         console.log("3. 모달 상태 리셋");
//         await resetCell();
//         console.log("4. 셀 리셋 완료");
//       } catch (error) {
//         console.error("초기화 실패:", error);
//         alert("셀 초기화에 실패했습니다.");
//       }
//     }
//   };

//   const backgroundColor = cellData?.status
//     ? time === "완료!"
//       ? isBlinking
//         ? "#EF4444"        // 연한 핑크 (LightPink)
//         : STATUS_OPTIONS[cellData.status].color
//       : STATUS_OPTIONS[cellData.status].color
//     : "#ddd";

//     return (
//       <>
//         <div 
//           className={`p-4 border rounded-md shadow hover:shadow-md transition-shadow h-[200px] overflow-hidden ${
//             isBlinking ? 'blinking' : ''}`}  
//           style={{ backgroundColor }}
//           onClick={openModal}
//         >
//           <h3 className="text-lg font-bold mb-2">{roomName}</h3>
//           <p className="font-medium">{cellData?.patientName || "환자 없음"}</p>
//           <p>{cellData?.status || "상태 없음"}</p>
//           <p className="text-xl font-bold">{time || "--:--"}</p>
//           {cellData?.memo && (
//             <p className="mt-2 text-sm italic line-memo">메모: {cellData?.memo}</p>
//           )}
//         </div>
   
//         <Dialog 
//           open={modalState.isOpen} 
//           onOpenChange={(open) => {
//             if (!open) closeModal();
//           }}
//         >
//           <DialogContent 
//             aria-describedby="dialog-description" 
//             className="bg-white rounded-lg shadow-lg z-50" 
//             onClick={(e) => e.stopPropagation()}
//           >
//             <DialogHeader className="border-b border-gray-200 pb-4">
//               <DialogTitle className="text-xl font-semibold text-[#1A365D]">
//                 {cellData ? "상태 변경" : "새 환자 등록"}
//               </DialogTitle>
//             </DialogHeader>
            
//             <DialogDescription/>
   
//             <div className="space-y-6 py-4">
//               {modalState.isOpen && (
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-[#1A365D]">환자 이름</label>
//                   <InputWithFocus 
//                     modalState={modalState} 
//                     handlePatientNameChange={handlePatientNameChange}
//                   />
//                 </div>
//               )}
   
//               <MemoInput 
//                 value={modalState.memo} 
//                 onChange={handleMemoChange}
//               />
              
//               <StatusButtons 
//                 selectedStatus={modalState.status} 
//                 onSelect={handleStatusChange}
//               />
              
//               {modalState.status &&
//                 STATUS_OPTIONS[modalState.status].countType === "countdown" && (
//                   <CountdownInput
//                     minutes={modalState.countdownMinutes}
//                     seconds={modalState.countdownSeconds}
//                     onChangeMinutes={handleCountdownMinutesChange}
//                     onChangeSeconds={handleCountdownSecondsChange}
//                     currentTimer={currentTimer}
//                   />
//                 )}
//             </div>
   
//             <DialogFooter className="border-t border-gray-200 pt-4 mt-4 space-x-3">
//               {cellData && (
//                 <Button  
//                   onClick={handleReset} 
//                   className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
//                 >
//                   초기화
//                 </Button>
//               )}
//               <Button 
//                 onClick={closeModal} 
//                 className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm"
//               >
//                 취소
//               </Button>
//               <Button 
//                 onClick={handleSubmit} 
//                 className="px-4 py-2 bg-[#007ACC] hover:bg-[#0369A1] text-white rounded-md shadow-sm"
//               >
//                 확인
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </>
//     );
// }


import React from "react";
import { CellProps, StatusType } from "../../types/components";
import MemoInput from "../ui/MemoInput";
import StatusButtons, { STATUS_OPTIONS } from "../ui/StatesButtons";
import CountdownInput from "../ui/CountInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/Dialog";
import { useTimer } from "../hooks/useTimer";
import { useFirebaseCell } from "../hooks/useFirebase";
import { useModalState } from "../hooks/useModalState";
import { Button } from "../ui/Button";
import InputWithFocus from "../ui/InputWithFocus";


export default function RoomCell({ row, col, data, roomName, onUpdate, onReset }: CellProps) {
  const { cellData, updateCell, resetCell } = useFirebaseCell({
    row,
    col,
    initialData: data
  });

  const { 
    modalState,
    openModal,
    closeModal,
    handlePatientNameChange,
    handleMemoChange,
    handleStatusChange,
    handleCountdownMinutesChange,
    handleCountdownSecondsChange,
    handleSubmit,
    resetModalState
  } = useModalState({ 
    cellData, 
    onSubmit: updateCell 
  });

  const { time, isBlinking, currentTimer } = useTimer({
    cellData,
    showStatusDialog: modalState.isOpen
  });

  const handleReset = async () => {
    try {
      const willReset = window.confirm("이 셀을 초기화하시겠습니까?");
      
      if (willReset) {
        // 실제 초기화 진행
        await resetCell();
        closeModal();
        resetModalState();
      } else {
        // 취소 시에는 그냥 모달만 닫기 
        closeModal();
      }
    } catch (error) {
      alert("셀 초기화에 실패했습니다.");
    }
  };

  const backgroundColor = cellData?.status
    ? time === "완료!"
      ? isBlinking
        ? "#EF4444"
        : STATUS_OPTIONS[cellData.status].color
      : STATUS_OPTIONS[cellData.status].color
    : "#ddd";

  return (
    <>
      <div 
        className={`p-4 border rounded-md shadow hover:shadow-md transition-shadow h-[200px] overflow-hidden ${
          isBlinking ? 'blinking' : ''}`}  
        style={{ backgroundColor }}
        onClick={openModal}
      >
        <h3 className="text-lg font-bold mb-2">{roomName}</h3>
        <p className="font-medium">{cellData?.patientName || "환자 없음"}</p>
        <p>{cellData?.status || "상태 없음"}</p>
        <p className="text-xl font-bold">{time || "--:--"}</p>
        {cellData?.memo && (
          <p className="mt-2 text-sm italic line-memo">메모: {cellData?.memo}</p>
        )}
      </div>
 
      <Dialog 
        open={modalState.isOpen} 
        onOpenChange={closeModal}
      >
        <DialogContent 
          className="bg-white rounded-lg shadow-lg z-50 pointer-events-auto"
        >
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-xl font-semibold text-[#1A365D]">
              {cellData ? "상태 변경" : "새 환자 등록"}
            </DialogTitle>
          </DialogHeader>
          
          <DialogDescription/>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#1A365D]">환자 이름</label>
              <InputWithFocus 
                modalState={modalState} 
                handlePatientNameChange={handlePatientNameChange}
              />
            </div>

            <MemoInput 
              value={modalState.memo} 
              onChange={handleMemoChange}
            />
            
            <StatusButtons 
              selectedStatus={modalState.status} 
              onSelect={handleStatusChange}
            />
            
            {modalState.status &&
              STATUS_OPTIONS[modalState.status].countType === "countdown" && (
                <CountdownInput
                  minutes={modalState.countdownMinutes}
                  seconds={modalState.countdownSeconds}
                  onChangeMinutes={handleCountdownMinutesChange}
                  onChangeSeconds={handleCountdownSecondsChange}
                  currentTimer={currentTimer}
                />
              )}
          </div>

          <DialogFooter className="border-t border-gray-200 pt-4 mt-4 space-x-3">
            {cellData && (
              <Button  
                onClick={handleReset} 
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
              >
                초기화
              </Button>
            )}
            <Button 
              onClick={closeModal} 
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm"
            >
              취소
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="px-4 py-2 bg-[#007ACC] hover:bg-[#0369A1] text-white rounded-md shadow-sm"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
