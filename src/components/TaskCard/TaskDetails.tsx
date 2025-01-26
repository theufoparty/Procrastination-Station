import React from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import { SubTask } from '../../types/firestore';
import SubTaskList from './SubTaskList';

const Container = styled.div``;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const TaskDetail = styled.p`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #555;

  strong {
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StyledButton = styled.button`
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: none;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
    color: #fff;
  }
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
  onRemove: () => void;
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
    <Container>
      <Title>{name}</Title>
      <TaskDetail>
        <strong>Account ID:</strong> {allianceId || 'N/A'}
      </TaskDetail>
      <TaskDetail>
        <strong>Description:</strong> {description}
      </TaskDetail>
      {subTasks.length > 0 && (
        <TaskDetail>
          <strong>Subtasks:</strong>
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
      <ButtonGroup>
        <StyledButton onClick={onComplete}>Complete</StyledButton>
        <StyledButton onClick={onEdit}>Edit</StyledButton>
        <StyledButton onClick={onRemove}>Remove</StyledButton>
      </ButtonGroup>
    </Container>
  );
};

export default TaskDetails;
