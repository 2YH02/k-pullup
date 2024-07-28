"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
  start: boolean;
  reset: boolean;
  count?: number;
}

const Timer = ({ start, reset, count = 300 }: TimerProps) => {
  const [time, setTime] = useState(count);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (start) {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start]);

  useEffect(() => {
    if (reset) {
      setTime(count);
    }
  }, [reset, setTime, count]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={{ color: time <= 60 ? "#f55656" : "#232323" }}>
      {formatTime(time)}
    </div>
  );
};

export default Timer;
