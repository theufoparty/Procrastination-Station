import React from 'react';
import styled from 'styled-components';
import { Task, SubTask } from '../types/firestore';

interface TaskSummaryProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  padding: 20px;
  background-color: #fff;
  width: 16em;
  height: 8em;
  margin-bottom: 20px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const TaskTitle = styled.h3`
  font-size: 0.8em;
  font-weight: 200;
  color: #333;
  margin: 0;
  width: 60%;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const DueDate = styled.span`
  font-size: 0.7em;
  color: #666;
`;

const DaysLeft = styled.p`
  font-size: 0.8em;
  color: #ff5722;
  margin: 0.5rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const BottomContainer = styled.div``;

const Progress = styled.div<{ percentage: number }>`
  width: ${(props) => props.percentage}%;
  height: 100%;
  background: #4caf50;
`;

const TaskSummary: React.FC<TaskSummaryProps> = ({ task, onClick }) => {
  const { name, dueDate, subTask } = task;

  const allSubTasks: SubTask[] = subTask ? Object.values(subTask).flat() : [];

  const totalSubtasks = allSubTasks.length;
  const completedSubtasks = allSubTasks.filter((subTask) => subTask.completed).length;
  const percentageComplete = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

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

      <BottomContainer>
        {dueDateObj && daysLeft > 0 ? (
          <DaysLeft>
            {daysLeft} day{daysLeft > 1 ? 's' : ''} left
          </DaysLeft>
        ) : (
          <DaysLeft style={{ color: '#d32f2f' }}>Overdue</DaysLeft>
        )}

        <ProgressBar>
          <Progress percentage={percentageComplete} />
        </ProgressBar>
      </BottomContainer>
    </TaskContainer>
  );
};

export default TaskSummary;
