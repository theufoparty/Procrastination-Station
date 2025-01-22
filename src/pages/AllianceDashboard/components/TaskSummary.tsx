import React from 'react';
import styled from 'styled-components';
import { Task } from '../../../types/firestore';

interface TaskSummaryProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskContainer = styled.div`
  position: relative;
  border: 1px solid #e6e8ec;
  border-radius: 1em;
  padding: 1em;
  text-align: center;
  background: linear-gradient(135deg, #6e8efb, #3b53db);
  color: #ffffff;
  width: 12em;
  height: 12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

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

const TaskHeader = styled.strong`
  display: block;
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const TaskDetails = styled.p`
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0;
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
