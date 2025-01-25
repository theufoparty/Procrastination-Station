// utils/taskUtils.ts
import { Timestamp } from 'firebase/firestore';
import { SubTask } from '../types/firestore';

export function parseSubTaskMap(subTaskMap: Record<string, SubTask[]> | undefined): SubTask[] {
  if (!subTaskMap) return [];
  const allSubTasks: SubTask[] = [];
  Object.values(subTaskMap).forEach((arr) => {
    if (Array.isArray(arr)) {
      allSubTasks.push(...arr);
    }
  });
  return allSubTasks;
}

export function formatDaysHoursMinutes(ms: number): string {
  if (ms <= 0) return '0d 0h 0m';
  let totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  totalMinutes %= 1440;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
}

export function getNextDueDate(currentDate: Date, recurrence: string): Date {
  const newDueDate = new Date(currentDate);
  switch (recurrence) {
    case 'Daily':
      newDueDate.setDate(newDueDate.getDate() + 1);
      break;
    case 'Weekly':
      newDueDate.setDate(newDueDate.getDate() + 7);
      break;
    case 'Monthly':
      newDueDate.setMonth(newDueDate.getMonth() + 1);
      break;
    default:
      break;
  }
  return newDueDate;
}

export function parseDueDate(dateString: string): Date | null {
  if (!dateString) return null;
  return new Date(dateString);
}

export function timestampToString(ts?: Timestamp | null): string {
  if (!ts) return 'N/A';
  return new Date(ts.toDate()).toLocaleString();
}
