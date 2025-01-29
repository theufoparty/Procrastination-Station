import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task } from '../../../types/firestore';
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
const ActivityFeedContainer = styled.div`
  border: 1px solid #e7e7e7;
  position: relative;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  width: 100%;
  @media (min-width: 768px) {
    min-width: 49%;
    max-width: 45%;
  }
`;
const Title = styled.h3`
  margin-bottom: 1em;
`;

const ActivityItem = styled.div`
  padding: 10px;
  margin-bottom: 1rem;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
`;

const TaskName = styled.h4`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
`;

const Timestamp = styled.p`
  margin: 5px 0;
  color: #888;
  font-size: 0.9rem;
`;

const RecentActivityFeed: React.FC = () => {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, orderBy('updatedAt', 'desc'), limit(5)); // Adjust limit based on desired number of tasks

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setRecentTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ActivityFeedContainer>
      <Title>Recent Activity</Title>
      {recentTasks.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        recentTasks.map((task) => (
          <ActivityItem key={task.id}>
            <TaskName>{task.name}</TaskName>
            <Timestamp>
              Last updated: {task.updatedAt?.toDate().toLocaleString() || 'No updates'}
            </Timestamp>
          </ActivityItem>
        ))
      )}
    </ActivityFeedContainer>
  );
};

export default RecentActivityFeed;
