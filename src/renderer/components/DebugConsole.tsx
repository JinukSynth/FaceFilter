import React, { useState, useEffect } from "react";

export function DebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // 디버그 로그 추가 함수
  const addLog = (log: string) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  // 전역적으로 로그를 추가할 수 있도록 설정
  useEffect(() => {
    (window as any).addDebugLog = addLog;
  }, []);

  return (
    <>
      {/* 디버그 창 토글 버튼 */}
      <button
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "디버그 숨기기" : "디버그 보기"}
      </button>

      {/* 디버그 콘솔 창 */}
      {isVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "50px",
            right: "10px",
            width: "400px",
            height: "300px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            borderRadius: "5px",
            padding: "10px",
            overflowY: "scroll",
            zIndex: 999,
          }}
        >
          <h4 style={{ margin: 0, marginBottom: "10px" }}>디버그 콘솔</h4>
          {logs.map((log, index) => (
            <p key={index} style={{ margin: "5px 0", wordBreak: "break-word" }}>
              {log}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
