module.exports = {
  content: ["./src/**/*.{html,tsx}"], // TailwindCSS가 처리할 파일 경로
  theme: {
      extend: {
        spacing: {
          "center-screen": "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
        },
      }, // 테마 확장 규칙
  },
  plugins: [], // 추가 TailwindCSS 플러그인
};
