const path = require("path");

module.exports = {
  target: "electron-preload", // Electron Preload 환경 설정
  entry: "./src/main/preload.ts", // Preload 스크립트 엔트리
  mode: 'production', // 개발 모드 변환 => decvelopment,
  output: {
    filename: "preload.js", // 출력 파일 이름
    path: path.resolve(__dirname, "dist"), // 출력 디렉토리
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // 처리할 파일 확장자
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // TypeScript 파일에 대한 정규식
        use: {
          loader: "ts-loader", // ts-loader 사용
          options: {
            transpileOnly: true, // TypeScript 컴파일만 수행 (빠른 빌드)
          },
        },
        exclude: /node_modules/, // node_modules 제외
      },
    ],

    
  },
};
