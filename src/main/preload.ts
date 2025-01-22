import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: async (channel: string, ...args: unknown[]): Promise<unknown> => {
      return await ipcRenderer.invoke(channel, ...args);
    },
    send: (channel: string, ...args: unknown[]) => {
      ipcRenderer.send(channel, ...args);
    },
    on: (channel: string, callback: (...args: unknown[]) => void): void => {
      ipcRenderer.on(channel, (_event: IpcRendererEvent, ...args: unknown[]) => callback(...args));
    },
    removeAllListeners: (channel: string): void => {
      ipcRenderer.removeAllListeners(channel);
    },
    
  },
  minimizeAndRestore: () => ipcRenderer.send('minimize-and-restore'),
  showConfirmDialog: () => ipcRenderer.invoke('show-confirm-dialog'),
  showErrorDialog: (message: string) => ipcRenderer.invoke('show-error-dialog', message),
});
