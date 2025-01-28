import React from 'react';
import { SubTask } from '../../types/firestore';
import { updateSubtask } from '../../utils/updateSubtask';
import styled from 'styled-components';

interface SubTaskListDetailViewProps {
  subTasks: SubTask[];
  taskId: string;
  onChangeCompleted?: (index: number, completed: boolean) => void;
}

const SubTaskListContainer = styled.ul`
  list-style: none;
`;

const SubTaskItem = styled.li`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  margin-bottom: 0.8rem;

  &:hover {
    background-color: #f3f5fe;
    transform: scale(1.02);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Checkbox = styled.input`
  width: 22px;
  height: 22px;
  background-color: #f0f0f0;
  border-radius: 50%;
  border: 2px solid #ddd;
  transition: all 0.3s ease;

  &:checked {
    background-color: #35328b;
    border-color: #35328b;
  }

  &:checked + span {
    color: #6c757d;
    text-decoration: line-through;
  }
`;

const SubTaskText = styled.span`
  font-size: 1em;
  color: #333;
  transition: color 0.3s ease;
  margin-left: 1em;
`;

const SubTaskListDetailView: React.FC<SubTaskListDetailViewProps> = ({ subTasks, taskId }) => {
  const handleCompletedChange = (index: number, completed: boolean) => {
    updateSubtask(taskId, index, {
      completed,
    });
  };

  return (
    <SubTaskListContainer>
      {subTasks.map((st, i) => (
        <SubTaskItem key={i}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              type='checkbox'
              checked={st.completed}
              onChange={(e) => handleCompletedChange(i, e.target.checked)}
            />
            <SubTaskText>{st.name}</SubTaskText>
          </label>
        </SubTaskItem>
      ))}
    </SubTaskListContainer>
  );
};

export default SubTaskListDetailView;
