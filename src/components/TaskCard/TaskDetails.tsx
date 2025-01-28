import React from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import SubTaskListDetailView from './SubTaskListDetailView';
import { SubTask } from '../../types/firestore';

const Container = styled.div`
  margin: 1em;
  background-color: #ffffff;
`;

const Title = styled.h2`
  font-size: 2em;
  font-weight: 600;
  margin-bottom: 1em;
`;

const TaskDetail = styled.p<{ isCompleted?: boolean }>`
  font-size: 1em;
  color: ${({ isCompleted }) => (isCompleted ? '#6c757d' : '#555')};
  margin-bottom: 1em;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  font-family: 'Montserrat', serif;
  font-weight: 400;
  padding: 14px 24px;
  font-size: 1rem;
  border: none;
  width: 10em;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#35328b')};
  color: ${({ disabled }) => (disabled ? '#666' : 'white')};
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#ccc' : '#1d1c45')};
    color: #fff;
  }

  &:focus {
    outline: none;
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
  taskId: string;
  onComplete: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  taskId,
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

      <TaskDetail isCompleted={!!completedAt}>{category || 'Uncategorized'}</TaskDetail>
      <TaskDetail isCompleted={!!completedAt}>Account ID: {allianceId || 'N/A'}</TaskDetail>

      <TaskDetail isCompleted={!!completedAt}>Priority: {priority}</TaskDetail>

      {dueDate && (
        <TaskDetail isCompleted={!!completedAt}>{timeLeft || 'Calculating...'}</TaskDetail>
      )}

      <TaskDetail isCompleted={!!completedAt}>{description}</TaskDetail>

      {subTasks.length > 0 && (
        <TaskDetail isCompleted={!!completedAt}>
          <SubTaskListDetailView subTasks={subTasks} taskId={taskId} />
        </TaskDetail>
      )}

      <TaskDetail isCompleted={!!completedAt}>Recurrence: {recurrence || 'None'}</TaskDetail>
      <TaskDetail isCompleted={!!completedAt}>
        Due Date: {dueDate ? dueDate.toLocaleString() : 'No due date'}
      </TaskDetail>
      <TaskDetail isCompleted={!!completedAt}>
        Completed At:{' '}
        {completedAt ? new Date(completedAt.toDate()).toLocaleString() : 'Not completed yet'}
      </TaskDetail>
      <TaskDetail isCompleted={!!completedAt}>
        Created At: {createdAt ? new Date(createdAt.toDate()).toLocaleString() : 'Unknown'}
      </TaskDetail>

      <TaskDetail isCompleted={!!completedAt}>
        Updated At: {updatedAt ? new Date(updatedAt.toDate()).toLocaleString() : 'Never updated'}
      </TaskDetail>

      <TaskDetail isCompleted={!!completedAt}>Assigned Users: {assignedUsersDisplay}</TaskDetail>

      <ButtonGroup>
        <StyledButton onClick={onComplete} disabled={!!completedAt}>
          Finished
        </StyledButton>
        <StyledButton onClick={onEdit} disabled={!!completedAt}>
          Edit
        </StyledButton>
        <StyledButton onClick={onRemove}>Remove Task</StyledButton>
      </ButtonGroup>
    </Container>
  );
};

export default TaskDetails;
