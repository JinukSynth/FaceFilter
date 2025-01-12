// // 안 씀
// import { BrowserWindow, ipcMain, screen } from "electron";

// function setupZoomHandling(mainWindow: BrowserWindow | null) {
//   ipcMain.on("resize-window", (_event, isMinimized: boolean) => {
//     if (mainWindow) {
//       const display = screen.getPrimaryDisplay(); // 현재 디스플레이 정보 가져오기
//       const { width, height } = display.workArea; // 작업 영역 크기 가져오기

//       if (isMinimized) {
//         // 창 축소
//         const windowWidth = 300;
//         const windowHeight = 245;
//         const x = width - windowWidth; // 오른쪽 하단 x 좌표
//         const y = height - windowHeight; // 오른쪽 하단 y 좌표

//         mainWindow.setBounds({ width: windowWidth, height: windowHeight, x, y });
//       } else {
//         // 창 확대
//         mainWindow.setBounds({ width: 1024, height: 768, x: 0, y: 0 }); // 원래 크기 및 위치
//       }
//     }
//   });
// }

// export default setupZoomHandling;
