import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const removeTask = async (taskId: string) => {
  try {
    const taskDocRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskDocRef);
  } catch (error) {
    console.error('Error removing task:', error);
    throw error;
  }
};
