// components/TaskCard/TaskDetails.tsx
import React from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import { SubTask } from '../../types/firestore';
import SubTaskList from './SubTaskList';

const TaskDetail = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #555;
`;

interface AllianceMember {
  id: string;
  name: string;
  email?: string;
}

interface TaskDetailsProps {
  allianceId?: string;
  name: string;
  description: string;
  priority: string;
  recurrence: string;
  dueDate: Date | null;
  completedAt?: Timestamp | null;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  subTasks: SubTask[];
  assignedUserIds?: string[];
  allianceMembers: AllianceMember[];
  category?: string;
  timeLeft: string;

  onComplete: () => void;
  onEdit: () => void;
  onRemove: () => void; // New prop for removing the task
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  allianceId,
  name,
  description,
  priority,
  recurrence,
  dueDate,
  completedAt,
  createdAt,
  updatedAt,
  subTasks,
  assignedUserIds,
  allianceMembers,
  category,
  timeLeft,
  onComplete,
  onEdit,
  onRemove,
}) => {
  const assignedUsersDisplay =
    assignedUserIds && assignedUserIds.length > 0
      ? assignedUserIds
          .map((uid) => {
            const found = allianceMembers.find((m) => m.id === uid);
            return found ? found.name : uid;
          })
          .join(', ')
      : 'No one assigned';

  return (
    <div>
      <h2>{name}</h2>
      <TaskDetail>
        <strong>Account ID:</strong> {allianceId}
      </TaskDetail>
      <TaskDetail>
        <strong>Description:</strong> {description}
      </TaskDetail>
      {subTasks.length > 0 && (
        <TaskDetail>
          <strong>Subtasks (from map):</strong>
          <SubTaskList subTasks={subTasks} />
        </TaskDetail>
      )}
      <TaskDetail>
        <strong>Priority:</strong> {priority}
      </TaskDetail>
      <TaskDetail>
        <strong>Recurrence:</strong> {recurrence || 'None'}
      </TaskDetail>
      <TaskDetail>
        <strong>Due Date:</strong> {dueDate ? dueDate.toLocaleString() : 'No due date'}
      </TaskDetail>
      <TaskDetail>
        <strong>Completed At:</strong>{' '}
        {completedAt ? new Date(completedAt.toDate()).toLocaleString() : 'Not completed yet'}
      </TaskDetail>
      <TaskDetail>
        <strong>Created At:</strong>{' '}
        {createdAt ? new Date(createdAt.toDate()).toLocaleString() : 'Unknown'}
      </TaskDetail>
      <TaskDetail>
        <strong>Updated At:</strong>{' '}
        {updatedAt ? new Date(updatedAt.toDate()).toLocaleString() : 'Never updated'}
      </TaskDetail>
      {dueDate && (
        <TaskDetail>
          <strong>Time left:</strong> {timeLeft || 'Calculating...'}
        </TaskDetail>
      )}
      <TaskDetail>
        <strong>Category:</strong> {category || 'Uncategorized'}
      </TaskDetail>
      <TaskDetail>
        <strong>Assigned Users:</strong> {assignedUsersDisplay}
      </TaskDetail>
      <button onClick={onComplete}>Completed</button>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onRemove}>Remove</button>
    </div>
  );
};

export default TaskDetails;
