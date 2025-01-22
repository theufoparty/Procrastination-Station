import { useEffect, useState } from 'react';
import { onAuthStateChanged, Auth } from 'firebase/auth';
import {
  doc,
  onSnapshot,
  Firestore,
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from '../types/user';
import { Task } from '../types/firestore';

interface UseAuthReturn {
  user: User | null;
  authLoading: boolean;
  userTasks: Task[];
  createUserTask: (taskData: {
    name: string;
    description?: string;
    priority?: string;
    recurrence?: string;
    dueDate?: Date | null;
    category?: string;
  }) => Promise<void>;
}

export const useAuth = (auth: Auth, db: Firestore): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // New state for user's tasks
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
        setUserTasks([]); // Clear tasks when no user is logged in
      } else {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (snapshot) => {
          if (!snapshot.exists()) {
            setUser({
              ...firebaseUser,
              name: undefined,
            });
          } else {
            const enrichedUser: User = {
              ...firebaseUser,
              ...snapshot.data(),
            };
            setUser(enrichedUser);
          }
          setAuthLoading(false);
        });
        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db]);

  // Subscribe to tasks assigned to the current user
  useEffect(() => {
    if (!user?.uid) {
      setUserTasks([]);
      return;
    }

    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('assignedUserIds', 'array-contains', user.uid));

    const unsubscribeUserTasks = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      }));
      setUserTasks(tasksData);
    });

    return () => unsubscribeUserTasks();
  }, [user?.uid, db]);

  // Create a user-only task (no alliance)
  const createUserTask = async (taskData: {
    name: string;
    description?: string;
    priority?: string;
    recurrence?: string;
    dueDate?: Date | null;
    category?: string;
  }) => {
    if (!user?.uid) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        name: taskData.name,
        description: taskData.description || '',
        priority: taskData.priority || 'Low',
        recurrence: taskData.recurrence || 'None',
        dueDate: taskData.dueDate || null,
        completedAt: null,
        // No allianceId here
        assignedUserIds: [user.uid],
        category: taskData.category || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user task:', error);
      throw error;
    }
  };

  return {
    user,
    authLoading,
    userTasks,
    createUserTask,
  };
};
