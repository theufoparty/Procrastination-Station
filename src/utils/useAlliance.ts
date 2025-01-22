import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  serverTimestamp,
  documentId,
} from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { Task } from '../types/firestore';

interface Alliance {
  userIds: string[];
  name: string;
  createdAt?: Timestamp;
}

interface UserDoc {
  id: string;
  name: string;
  email: string;
  createdAt?: Timestamp;
}

export const useAlliance = (allianceId?: string) => {
  const { user } = useAuth(auth, db);
  const currentUserUid = user?.uid ?? null;

  const [alliance, setAlliance] = useState<Alliance | null>(null);
  const [allianceTasks, setAllianceTasks] = useState<Task[]>([]);
  const [allianceMembers, setAllianceMembers] = useState<UserDoc[]>([]);
  const [isMemberOfAlliance, setIsMemberOfAlliance] = useState(false);

  useEffect(() => {
    if (!allianceId) return;

    const allianceDocRef = doc(db, 'alliances', allianceId);
    const unsubscribeAlliance = onSnapshot(allianceDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Alliance;
        setAlliance(data);

        const isMember = data.userIds?.includes(currentUserUid || '') || false;
        setIsMemberOfAlliance(isMember);
      } else {
        setAlliance(null);
        setIsMemberOfAlliance(false);
      }
    });

    return () => unsubscribeAlliance();
  }, [allianceId, currentUserUid]);

  useEffect(() => {
    if (!allianceId) {
      setAllianceTasks([]);
      return;
    }

    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('allianceId', '==', allianceId));

    const unsubscribeAllianceTasks = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      }));
      setAllianceTasks(tasksData);
    });

    return () => unsubscribeAllianceTasks();
  }, [allianceId]);

  useEffect(() => {
    if (!alliance?.userIds || alliance.userIds.length === 0) {
      setAllianceMembers([]);
      return;
    }

    const usersRef = collection(db, 'users');

    // Firestore 'in' queries are limited to 10 items.
    const batchSize = 10;
    const batches: string[][] = [];

    for (let i = 0; i < alliance.userIds.length; i += batchSize) {
      const batch = alliance.userIds.slice(i, i + batchSize);
      batches.push(batch);
    }

    const unsubscribeFunctions: (() => void)[] = [];
    setAllianceMembers([]);

    batches.forEach((batch) => {
      const q = query(usersRef, where(documentId(), 'in', batch));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const membersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<UserDoc, 'id'>),
        }));
        setAllianceMembers((prev) => {
          const updatedMembers = [...prev];
          membersData.forEach((member) => {
            if (!updatedMembers.find((m) => m.id === member.id)) {
              updatedMembers.push(member);
            }
          });
          return updatedMembers;
        });
      });

      unsubscribeFunctions.push(unsubscribe);
    });

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, [alliance]);

  /** Join Alliance */
  const joinAlliance = async () => {
    if (!allianceId || !currentUserUid) return;

    try {
      const allianceDocRef = doc(db, 'alliances', allianceId);
      const userDocRef = doc(db, 'users', currentUserUid);

      await updateDoc(allianceDocRef, {
        userIds: arrayUnion(currentUserUid),
      });

      await updateDoc(userDocRef, {
        allianceIds: arrayUnion(allianceId),
      });
    } catch (error) {
      console.error('Error joining alliance:', error);
      throw error;
    }
  };

  /** Leave Alliance */
  const leaveAlliance = async () => {
    if (!allianceId || !currentUserUid) return;

    try {
      const allianceDocRef = doc(db, 'alliances', allianceId);
      const userDocRef = doc(db, 'users', currentUserUid);

      await updateDoc(allianceDocRef, {
        userIds: arrayRemove(currentUserUid),
      });

      await updateDoc(userDocRef, {
        allianceIds: arrayRemove(allianceId),
      });
    } catch (error) {
      console.error('Error leaving alliance:', error);
      throw error;
    }
  };

  /** Create a task for this alliance */
  const createAllianceTask = async (taskData: {
    name: string;
    description?: string;
    priority?: string;
    recurrence?: string;
    dueDate?: Date | null;
    assignedUserIds?: string[];
    category?: string;
  }) => {
    if (!allianceId) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        allianceId,
        name: taskData.name,
        description: taskData.description || '',
        priority: taskData.priority || 'Low',
        recurrence: taskData.recurrence || 'None',
        dueDate: taskData.dueDate || null,
        completedAt: null,
        assignedUserIds: taskData.assignedUserIds || [],
        category: taskData.category || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating alliance task:', error);
      throw error;
    }
  };

  /** Update an existing task */
  const updateTask = async (taskId: string, data: Partial<Task>) => {
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

  return {
    alliance,
    allianceTasks,
    allianceMembers,
    isMemberOfAlliance,
    joinAlliance,
    leaveAlliance,
    createAllianceTask,
    updateTask,
  };
};
