// utils/windowManager.ts
export const toggleWindowSize = async (
    isMinimized: boolean,
    setIsMinimized: (state: boolean) => void
  ) => {
    const newIsMinimized = !isMinimized;
    setIsMinimized(newIsMinimized);
  
    // Electron IPC를 통해 창 크기 전환
    window.electron.ipcRenderer.send("resize-window", newIsMinimized);
  };
  
  export const getInitialWindowState = async (): Promise<boolean> => {
    const data = await window.electron.ipcRenderer.invoke<{ isMinimized: boolean }>(
      "getInitialState"
    );
    return data.isMinimized;
  };  