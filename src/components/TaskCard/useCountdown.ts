import { useState, useEffect } from 'react';
import { formatDaysHoursMinutes } from '../../utils/taskUtils';

export function useCountdown(dueDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!dueDate) {
      setTimeLeft('');
      return;
    }

    function updateCountdown() {
      const distance = dueDate ? dueDate.getTime() - Date.now() : 0;
      setTimeLeft(distance <= 0 ? 'Task is overdue!' : formatDaysHoursMinutes(distance));
    }

    // Initial
    updateCountdown();

    const timerId = setInterval(updateCountdown, 60_000);
    return () => clearInterval(timerId);
  }, [dueDate]);

  return timeLeft;
}
