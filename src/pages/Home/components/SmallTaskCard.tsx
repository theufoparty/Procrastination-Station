import React from 'react';
import styled from 'styled-components';
import { Task } from '../../../types/firestore';

const CardWrapper = styled.div`
  position: relative;
  border: 1px solid #000000;
  padding: 1.5em;
  background: #ffffff;
  width: 20em;
  height: 12em;
  cursor: pointer;
  margin: 1em;
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
