import React from 'react';
import styled from 'styled-components';
import { Task, SubTask } from '../../types/firestore';

interface TaskSummaryProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskContainer = styled.div`
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
  padding: 1.5em;
  background-color: #fff;
  width: 20em;
  height: 12em;
  cursor: pointer;
  margin: 1em;

  @media (max-width: 768px) {
    width: 100%;
    margin: 1em auto;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TaskTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const DueDate = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const DaysLeft = styled.p`
  font-size: 0.9rem;
  color: #ff5722; /* Highlighted color for urgency */
  margin: 0.5rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.75rem 0 1rem;
`;

const Progress = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}%;
  height: 100%;
  background: #4caf50;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const TaskSummary: React.FC<TaskSummaryProps> = ({ task, onClick }) => {
  const { name, dueDate, subTask } = task;

  // Flatten subTask record into a single array of SubTask objects
  const allSubTasks: SubTask[] = subTask
    ? Object.values(subTask).flat() // Combine all arrays in the record
    : [];

  // Calculate progress
  const totalSubtasks = allSubTasks.length;
  const completedSubtasks = allSubTasks.filter((subTask) => subTask.completed).length;
  const percentageComplete = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Calculate days left
  const currentDate = new Date();
  const dueDateObj = dueDate ? dueDate.toDate() : null;
  const daysLeft =
    dueDateObj && dueDateObj > currentDate
      ? Math.ceil((dueDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <TaskContainer onClick={() => onClick(task)}>
      <Header>
        <TaskTitle>{name}</TaskTitle>
        <DueDate>{dueDateObj ? dueDateObj.toLocaleDateString() : 'No due date'}</DueDate>
      </Header>

      {dueDateObj && daysLeft > 0 ? (
        <DaysLeft>
          {daysLeft} day{daysLeft > 1 ? 's' : ''} left
        </DaysLeft>
      ) : (
        <DaysLeft style={{ color: '#d32f2f' }}>Overdue</DaysLeft>
      )}

      <Footer>Hello</Footer>
      <ProgressBar>
        <Progress percentage={percentageComplete} />
      </ProgressBar>
    </TaskContainer>
  );
};

export default TaskSummary;
