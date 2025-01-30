import React from 'react';
import { Label, PriorityButtonContainer, PriorityButton, InputContainer } from './styled';

interface PrioritySelectorProps {
  priorityOptions: string[];
  taskPriority: string;
  setTaskPriority: (value: string) => void;
  readOnly?: boolean;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priorityOptions,
  taskPriority,
  setTaskPriority,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <InputContainer>
        <Label>Priority</Label>
        <p style={{ marginTop: '0.3rem', fontSize: '0.6em' }}>{taskPriority}</p>
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      <Label>Priority</Label>
      <PriorityButtonContainer>
        {priorityOptions.map((option) => (
          <PriorityButton
            key={option}
            type='button'
            selected={taskPriority === option}
            onClick={() => setTaskPriority(option)}
          >
            {option}
          </PriorityButton>
        ))}
      </PriorityButtonContainer>
    </InputContainer>
  );
};

export default PrioritySelector;
