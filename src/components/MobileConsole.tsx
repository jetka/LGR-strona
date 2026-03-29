"use client";

import { useEffect, useState } from "react";

export default function MobileConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // Intercept console.log
    const origLog = console.log;
    console.log = (...args) => {
      origLog(...args);
      
      const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
      
      // Filrtrujemy tylko logi o mediach, zeby nie zasmiecac ekranu pierdolami wbudowanymi w Next.js
      if (msg.includes("[DEBUG MEDIA]")) {
        setLogs((prev) => {
          const newLogs = [...prev, msg];
          return newLogs.slice(-15); // Zachowaj ostatnie 15 logow
        });
      }
    };

    return () => {
      console.log = origLog; // Cleanup
    };
  }, []);

  if (closed || logs.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: "5%",
        width: "90%",
        backgroundColor: "rgba(0,0,0,0.85)",
        color: "#0f0",
        padding: "15px",
        borderRadius: "8px",
        zIndex: 99999,
        fontFamily: "monospace",
        fontSize: "10px",
        maxHeight: "50vh",
        overflowY: "auto",
        wordBreak: "break-all",
        border: "1px solid #0f0"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "white" }}>
        <strong>ZŁAPANE LOGI MEDIÓW (Zrób screen!)</strong>
        <button
          onClick={() => setClosed(true)}
          style={{ background: "#ff4444", color: "white", border: "none", padding: "2px 8px", borderRadius: "4px" }}
        >
          X
        </button>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {logs.map((L, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(0,255,0,0.3)", paddingBottom: "2px" }}>
            {L}
          </div>
        ))}
      </div>
    </div>
  );
}
