import React, { useState, useEffect } from "react";
import { Section, CellData } from "../../types/components";
import RoomCell from "./RoomCell";
import { IpcRendererEvent } from "electron";
import { getInitialWindowState, toggleWindowSize } from "../lib/windowManager";
import { Button } from "../ui/Button";
import { firebaseManager } from "../../main/firebase_manager";

interface IpcRendererEvents {
  dataChanged: [updatedData: Record<string, CellData>];
  getInitialState: [{ isMinimized: boolean }]; // 초기 상태 가져오기
}

declare global {
  interface Window {
    electron: {
      showConfirmDialog: () => Promise<boolean>;
      showErrorDialog: (message: string) => Promise<void>;
      ipcRenderer: {
        invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>;
        on<K extends keyof IpcRendererEvents>(
          channel: K,
          listener: (event: IpcRendererEvent, ...args: IpcRendererEvents[K]) => void
        ): void;
        send: (channel: string, ...args: unknown[]) => void;
        removeAllListeners: (channel: string) => void;
      };
    };
  }
}

const sections: Section[] = [
  {
    label: "시술실",
    rooms: ["시술실 7", "시술실 8", "시술실 9", "시술실 10", "시술실 11", "시술실 4", "시술실 3", "시술실 2"],
  },
  {
    label: "CO2실",
    rooms: ["CO2실 1"],
  },
  {
    label: "CO2/제모/기타",
    rooms: ["CO2/제모/기타 1", "CO2/제모/기타 2", "CO2/제모/기타 3", "CO2/제모/기타 4", "CO2/제모/기타 5", "CO2/제모/기타 6", "CO2/제모/기타 7", "CO2/제모/기타 8"],
  },
];

export default function MainView() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [allCellsData, setAllCellsData] = useState<Record<string, CellData>>({});

  // 초기 창 상태 가져오기
  useEffect(() => {
    (async () => {
      const initialState = await getInitialWindowState();
      setIsMinimized(initialState);
    })();
  }, []);

  // 전체 셀 데이터 구독 - 단일 리스너
  useEffect(() => {
    const basePath = 'path/to/cell';
    console.log('Starting main listener for all cells');
    
    firebaseManager.startListener<Record<string, CellData>>(basePath, (data) => {
      if (data) {
        setAllCellsData(data);
        console.log('Updated all cells data:', data);
      }
    });

    return () => {
      console.log('Stopping main listener');
      firebaseManager.stopListener(basePath);
    };
  }, []);

  // 섹션 렌더링
  const renderSection = (section: Section, baseRow: number) => (
    <div key={section.label} className="my-5">
      <h2 className="text-lg font-bold">{section.label}</h2>
      <div className="grid grid-cols-4 gap-4">
        {section.rooms.map((roomName, index) => {
          const row = baseRow + Math.floor(index / 4);
          const col = index % 4;

          return (
            <RoomCell
              key={`${row}-${col}`}
              row={row}
              col={col}
              roomName={roomName}
              allCellsData={allCellsData}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`p-5 bg-white shadow-md rounded-lg transition-all ${
      isMinimized
        ? "absolute w-80 h-40 center-screen"
        : "relative w-full h-full"
    }`}
    style={isMinimized
      ? { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }
      : { position: "relative", width: "100%", height: "100%" }
    }>
      <Button 
        onClick={() => toggleWindowSize(isMinimized, setIsMinimized)}
        className="absolute top-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {isMinimized ? "확대" : "축소"}
      </Button>

      {!isMinimized && sections.map((section, index) => renderSection(section, index * 10))}
      {isMinimized && (
        <div className="text-center text-sm text-gray-700">
          <p>축소된 화면입니다.</p>
          <p>확대를 눌러 전체 화면으로 돌아가세요.</p>
        </div>
      )}
    </div>
  );
}
