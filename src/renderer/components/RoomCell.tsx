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
        
        // 창 최소화 후 복원을 위한 IPC 호출 추가
        window.electron.ipcRenderer.send('minimize-and-restore');
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
