import { useState, useEffect } from 'react';
import { CellData, StatusType } from '../../types/components';
import { firebaseManager } from '../../main/firebase_manager';

interface UseFirebaseCellProps {
 row: number;
 col: number;
 initialData?: CellData | null;
}

interface UseFirebaseCellReturn {
 cellData: CellData | null;
 updateCell: (newData: Partial<CellData>) => Promise<void>;
 resetCell: () => Promise<void>;
 setCellData: (data: CellData | null) => void;
}

function cleanData<T>(data: T): T {
 return JSON.parse(JSON.stringify(data));
}

export const useFirebaseCell = ({ row, col, initialData }: UseFirebaseCellProps): UseFirebaseCellReturn => {
 const [cellData, setCellData] = useState<CellData | null>(initialData || null);
 const path = `path/to/cell/${row}_${col}`;

//  // Firebase 리스너 설정
//  useEffect(() => {
//    firebaseManager.startListener<CellData>(path, (data) => {
//      if (data) {
//        setCellData(data);
//      } else {
//        setCellData(null);
//      }
//    });

//    return () => {
//      firebaseManager.stopListener(path);
//    };
//  }, [path]);

useEffect(() => {
  const setupListener = () => {
    firebaseManager.startListener<CellData>(path, (data) => {
      if (data) {
        setCellData(data);
      } else {
        setCellData(null);
      }
    });
  };

  setupListener();
  return () => {
    firebaseManager.stopListener(path);
  };
}, [path]);

 // Cell 데이터 업데이트 함수
 const updateCell = async (updatedData: Partial<CellData>) => {
   const currentTime = Math.floor(Date.now() / 1000);

   // 기존 데이터와 업데이트할 데이터를 병합
   const newData: CellData = {
     row: row,
     col: col,
     patientName: updatedData.patientName ?? cellData?.patientName ?? "",
     status: updatedData.status ?? cellData?.status ?? null,
     startTime: updatedData.startTime ?? cellData?.startTime ?? currentTime,
     endTime: updatedData.endTime ?? cellData?.endTime,
     timerActive: true,
     timestamp: Date.now(),
     memo: updatedData.memo ?? cellData?.memo ?? "",
     sender_id: cellData?.sender_id ?? "",
   };

   try {
     await firebaseManager.updateData({
       path,
       value: cleanData(newData),
     });
     
     console.log("Status updated in Firebase");
     console.log("Updated Cell Data:", newData);
     
     setCellData(newData);
   } catch (error) {
     console.error("Error updating status in Firebase:", error);
     throw error;
   }
 };

//  // Cell 초기화 함수
//  const resetCell = async () => {
//    try {
//      await firebaseManager.deleteData(path);
//      console.log("Data deleted from Firebase");
     
//      // 상태 초기화를 명시적으로 수행
//      setCellData(null);
     
//      // Firebase 리스너 재설정
//      firebaseManager.stopListener(path);
//      firebaseManager.startListener<CellData>(path, (data) => {
//        if (data) {
//          setCellData(data);
//        } else {
//          setCellData(null);
//        }
//      });
//    } catch (error) {
//      console.error("Error deleting data from Firebase:", error);
//      throw error;
//    }
//  };

  const resetCell = async () => {
    try {
      console.log("리셋 시작 - 현재 cellData:", cellData);
      
      firebaseManager.stopListener(path);
      console.log("리스너 중지됨");
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await firebaseManager.deleteData(path);
      console.log("Firebase 데이터 삭제됨");
      
      setCellData(null);
      console.log("로컬 상태 초기화됨");
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      firebaseManager.startListener<CellData>(path, (data) => {
        console.log("새 리스너 데이터:", data);
        if (data) {
          setCellData(data);
        } else {
          setCellData(null);
        }
      });
    } catch (error) {
      console.error("Error deleting data from Firebase:", error);
      throw error;
    }
  };

 return {
   cellData,
   updateCell,
   resetCell,
   setCellData,
 };
};