import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const TimerDisplay = styled.h2`
  font-size: 3em;
  margin: 0.5em 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 1em;

  button {
    padding: 12px;
    width: 6em;
    font-size: 0.8em;
    border-radius: 20px;
    cursor: pointer;
    background-color: #35328b;
    color: #fff;
    border: none;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #d4d4f3;
    }

    &:disabled {
      background-color: #9494bd;
      cursor: not-allowed;
    }
  }
`;

const TaskTimer: React.FC = () => {
  const INITIAL_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(INITIAL_TIME);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
  };

  return (
    <TimerContainer>
      <TimerDisplay>{displayTime}</TimerDisplay>
      <ButtonRow>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handlePause} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={handleReset}>Reset</button>
      </ButtonRow>
    </TimerContainer>
  );
};

export default TaskTimer;
