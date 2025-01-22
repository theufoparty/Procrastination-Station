import { Timestamp } from 'firebase/firestore';

export type Alliance = {
  id: string;
  name: string;
  userIds: string[];
  createdAt: Timestamp;
};

export type Task = {
  id: string;
  allianceId?: string;
  name: string;
  description?: string;
  priority?: string;
  recurrence?: string;
  dueDate?: Timestamp | null;
  completedAt?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  assignedUserIds?: string[];
  category?: string;
};
