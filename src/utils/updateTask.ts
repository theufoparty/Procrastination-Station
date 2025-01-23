import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Task } from '../types/firestore';

export const updateTask = async (taskId: string, data: Partial<Task>) => {
  try {
    const taskDocRef = doc(db, 'tasks', taskId);
    await updateDoc(taskDocRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};
