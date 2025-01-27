import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Task } from '../types/firestore';

// Utility to fetch a task by ID
export const getTask = async (taskId: string): Promise<Task> => {
  try {
    const taskDocRef = doc(db, 'tasks', taskId);
    const taskSnapshot = await getDoc(taskDocRef);

    if (!taskSnapshot.exists()) {
      throw new Error('Task not found');
    }

    return taskSnapshot.data() as Task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};
