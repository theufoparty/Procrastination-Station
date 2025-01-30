// TaskTimeInput.tsx
import React from 'react';
import { Label, LightInput, InputContainer } from './styled';

interface TaskTimeInputProps {
  taskTime: string;
  setTaskTime: (value: string) => void;
  readOnly?: boolean;
}

const TaskTimeInput: React.FC<TaskTimeInputProps> = ({
  taskTime,
  setTaskTime,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <InputContainer>
        <Label>TIME</Label>
        <p style={{ marginTop: '0.3rem' }}>{taskTime || '—'}</p>
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      <Label htmlFor='taskTime'>TIME</Label>
      <LightInput
        id='taskTime'
        type='time'
        value={taskTime}
        onChange={(e) => setTaskTime(e.target.value)}
      />
    </InputContainer>
  );
};

export default TaskTimeInput;
