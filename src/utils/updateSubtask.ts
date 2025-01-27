import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { SubTask } from '../types/firestore';
import { getTask } from './getTask';

const subTaskKey = 'defaultKey';

// Utility to update a subtask
export const updateSubtask = async (
  taskId: string,
  subTaskIndex: number, // The index of the subtask to update
  updatedSubTask: Partial<SubTask> // The updated subtask data
) => {
  try {
    // Fetch the task using the getTask utility
    const taskData = await getTask(taskId);

    // Ensure the subTask key exists
    if (!taskData.subTask || !taskData.subTask[subTaskKey]) {
      throw new Error('Subtask key not found');
    }

    // Get the list of subtasks for the given key
    const subTaskList = taskData.subTask[subTaskKey];

    // Ensure the subtask index is valid
    if (subTaskIndex < 0 || subTaskIndex >= subTaskList.length) {
      throw new Error('Subtask index out of range');
    }

    // Update the specific subtask
    const updatedSubTaskList = [...subTaskList];
    updatedSubTaskList[subTaskIndex] = {
      ...updatedSubTaskList[subTaskIndex],
      ...updatedSubTask,
    };

    // Reference to the task document
    const taskDocRef = doc(db, 'tasks', taskId);

    // Update the task document with the updated subtask list
    await updateDoc(taskDocRef, {
      [`subTask.${subTaskKey}`]: taskData.subTask[subTaskKey].map((subTask, index) => {
        if (index === subTaskIndex) {
          return {
            ...subTask,
            ...updatedSubTask,
          };
        } else {
          return subTask;
        }
      }),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating subtask:', error);
    throw error;
  }
};
