// SmallTaskCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Task } from '../../../types/firestore';

const CardWrapper = styled.div`
  background: #fff;
  color: #333;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
