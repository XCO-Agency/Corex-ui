import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { styles } from "../constants";

export type CompleteStagePropsType = {
  onRestart?: () => void;
  onGoToDashboard?: () => void;
};

export function CompleteStage({ onRestart, onGoToDashboard }: CompleteStagePropsType) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleAction = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else if (onRestart) {
      onRestart();
    }
  };

  return (
    <>
      <div className="panel" style={styles.panel as CSSProperties}>
        <div style={styles.complete as CSSProperties}>
          <div style={styles.checkWrap as CSSProperties}>
            <div style={styles.checkCircle as CSSProperties}>
              <svg viewBox="0 0 24 24" style={styles.checkSvg as CSSProperties}>
                <path
                  d="M4 12l6 6 10-12"
                  style={{
                    ...(styles.checkPathComplete as CSSProperties),
                    strokeDashoffset: drawn ? 0 : 24,
                    transition: "stroke-dashoffset .5s ease .2s",
                  }}
                />
              </svg>
            </div>
          </div>
          <h2 style={styles.completeH2 as CSSProperties}>You&apos;re all set</h2>
          <p style={styles.completeP as CSSProperties}>Your revenue tools are configured and ready to go.</p>
        </div>
      </div>
      <button
        type="button"
        className="btn"
        style={styles.btn as CSSProperties}
        onClick={handleAction}
      >
        Enter dashboard
      </button>
    </>
  );
}
