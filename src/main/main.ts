import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null;
let initialBounds: Electron.Rectangle | null = null;
let isWindowMinimized = false;  // 창 상태를 추적하기 위한 변수 추가

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1280,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  initialBounds = mainWindow.getBounds();

  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));


  // mainWindow.webContents.openDevTools();
  
  // 팝업 허용 설정
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'allow' };
  });

  // 권한 요청 처리
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true);  // 권한 요청 허용
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // 창 크기가 변경될 때마다 initialBounds 업데이트
  mainWindow?.on('resize', () => {
    if (mainWindow && !mainWindow.isMinimized() && !isWindowMinimized) {
      initialBounds = mainWindow.getBounds();
    }
  });

  // 창 위치가 변경될 때마다 initialBounds 업데이트
  mainWindow?.on('move', () => {
    if (mainWindow && !mainWindow.isMinimized() && !isWindowMinimized) {
      initialBounds = mainWindow.getBounds();
    }
  });
}

ipcMain.handle('getInitialState', async () => {
  return false;  // 초기 상태는 축소되지 않은 상태
});

ipcMain.on("resize-window", (_event, isMinimized: boolean) => {
  if (mainWindow) {
    isWindowMinimized = isMinimized;  // 상태 업데이트
    
    if (isMinimized) {
      // 축소 상태
      const currentBounds = mainWindow.getBounds();
      mainWindow.setBounds({
        x: currentBounds.x,
        y: currentBounds.y,
        width: 300,
        height: 200,
      });
    } else {
      // 초기 크기로 복원
      if (initialBounds) {
        mainWindow.setBounds(initialBounds);
      } else {
        mainWindow.setBounds({ x: 0, y: 0, width: 1920, height: 1280 });
      }
    }
  }
});

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});