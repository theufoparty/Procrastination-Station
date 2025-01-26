import React from 'react';
import styled from 'styled-components';
import { Task } from '../types/firestore';

interface TaskSummaryProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskContainer = styled.div`
  position: relative;
  border: 1px solid black;
  margin: 1em;
  border-radius: 12px;
  padding: 1.5em;
  color: #000000;
  width: 20em;
  height: 12em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M0,50 C50,100 150,0 200,50 L200,100 L0,100 Z" fill="%23ffffff" opacity="0.2"/></svg>')
      no-repeat center;
    background-size: cover;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M0,50 C50,100 150,0 200,50 L200,100 L0,100 Z" fill="%23ffffff" opacity="0.2"/></svg>')
      no-repeat center;
    background-size: cover;
    pointer-events: none;
    z-index: 2;
  }
`;

const TaskHeader = styled.h3`
  font-size: 1em;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const TaskDetails = styled.p`
  font-size: 1em;
  color: #000000;
  margin: 0.25rem 0;
`;

const TaskSummary: React.FC<TaskSummaryProps> = ({ task, onClick }) => {
  const { name, priority, dueDate, category } = task;

  const due = dueDate ? dueDate.toDate().toLocaleString() : 'No due date';

  const categoryDisplay = category || 'Uncategorized';

  return (
    <TaskContainer onClick={() => onClick(task)}>
      <TaskHeader>{name}</TaskHeader>
      <TaskDetails>
        Priority: {priority || 'Low'} | Category: {categoryDisplay}
      </TaskDetails>
      <TaskDetails>Due: {due}</TaskDetails>
    </TaskContainer>
  );
};

export default TaskSummary;
