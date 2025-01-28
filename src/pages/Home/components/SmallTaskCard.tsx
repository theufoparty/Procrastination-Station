import React from 'react';
import styled from 'styled-components';
import { Task } from '../../../types/firestore';

const CardWrapper = styled.div`
  position: relative;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); */
  border: 1px solid #e7e7e7;
  padding: 1.5em;
  background-color: #fff;
  width: 20em;
  height: 12em;
  cursor: pointer;
  border-radius: 20px;
`;

interface SmallTaskCardProps {
  task: Task;
}

const SmallTaskCard: React.FC<SmallTaskCardProps> = ({ task }) => {
  return (
    <CardWrapper>
      <h5 style={{ margin: 0 }}>{task.name}</h5>
      {task.description && <p>{task.description}</p>}
    </CardWrapper>
  );
};

export default SmallTaskCard;
