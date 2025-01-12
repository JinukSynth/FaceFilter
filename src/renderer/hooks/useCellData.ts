import { useState, useEffect } from "react";
import { CellData } from "../../types/components";
import { firebaseManager } from '../../main/firebase_manager';

export default function useCellData() {
  const [cells, setCells] = useState<Record<string, CellData>>({});

  // 데이터 로드 및 리스너 설정
  useEffect(() => {
    // Firebase에서 직접 데이터를 로드
    const loadData = async () => {
      try {
        const data = await firebaseManager.getData<Record<string, CellData>>("/cells");
        setCells(data || {});
      } catch (error) {
        console.error("Error loading data:", error);
        setCells({});
      }
    };

    loadData();

    // Firebase 리스너 설정
    firebaseManager.startListener<Record<string, CellData>>("/cells", (data) => {
      if (data) {
        setCells(data);
      }
    });

    // 클린업: 리스너 제거
    return () => {
      firebaseManager.stopListener("/cells");
    };
  }, []);

  // 데이터 업데이트
  const updateCellData = async (key: string, data: CellData) => {
    try {
      await firebaseManager.updateData({
        path: `/cells/${key}`,
        value: data
      });
      setCells(prev => ({
        ...prev,
        [key]: data
      }));
    } catch (error) {
      console.error("Error updating cell data:", error);
    }
  };

  // 데이터 리셋
  const resetCellData = async (key: string) => {
    try {
      await firebaseManager.deleteData(`/cells/${key}`);
      setCells(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    } catch (error) {
      console.error("Error resetting cell data:", error);
    }
  };

  return { cells, updateCellData, resetCellData };
}