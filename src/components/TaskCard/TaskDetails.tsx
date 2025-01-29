import React from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import SubTaskListDetailView from './SubTaskListDetailView';
import { SubTask } from '../../types/firestore';
const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;

  @media (max-width: 768px) {
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const TopContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TaskDetail = styled.p<{ isCompleted?: boolean }>`
  font-size: 1rem;
  color: ${({ isCompleted }) => (isCompleted ? '#6c757d' : '#555')};
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding: 12px;
  font-size: 0.8em;
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
      <TopContainer>
        <Title>{name}</Title>{' '}
        <TaskDetail isCompleted={!!completedAt}>
          {dueDate
            ? dueDate.toLocaleString('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
            : 'No due date'}
        </TaskDetail>
      </TopContainer>

      <TaskDetail isCompleted={!!completedAt}>{category || 'Uncategorized'}</TaskDetail>

      <TaskDetail isCompleted={!!completedAt}>Recurrence: {recurrence || 'None'}</TaskDetail>

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

      <TaskDetail isCompleted={!!completedAt}>Assigned Member: {assignedUsersDisplay}</TaskDetail>

      <ButtonGroup>
        <StyledButton onClick={onComplete}>Finished</StyledButton>
        <StyledButton onClick={onEdit}>Edit</StyledButton>
        <StyledButton onClick={onRemove}>Remove Task</StyledButton>
      </ButtonGroup>
    </Container>
  );
};

export default TaskDetails;
