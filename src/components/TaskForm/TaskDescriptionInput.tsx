import React from 'react';
import { Label, TextArea, InputContainer } from './styled';

interface TaskDescriptionInputProps {
  taskDescription: string;
  setTaskDescription: (value: string) => void;
  readOnly?: boolean;
}

const TaskDescriptionInput: React.FC<TaskDescriptionInputProps> = ({
  taskDescription,
  setTaskDescription,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <InputContainer>
        <Label>Description</Label>
        <p style={{ marginTop: '0.3rem', fontSize: '0.7em' }}>{taskDescription || '—'}</p>
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      <Label htmlFor='taskDescription'>Description</Label>
      <TextArea
        id='taskDescription'
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        rows={2}
      />
    </InputContainer>
  );
};

export default TaskDescriptionInput;
