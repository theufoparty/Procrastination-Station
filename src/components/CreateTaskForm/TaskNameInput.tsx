// TaskNameInput.tsx
import React from 'react';
import { DarkInput, DarkLabel } from './styled';

interface TaskNameInputProps {
  taskName: string;
  setTaskName: (value: string) => void;
  readOnly?: boolean;
}

const TaskNameInput: React.FC<TaskNameInputProps> = ({
  taskName,
  setTaskName,
  readOnly = false,
}) => {
  if (readOnly) {
    // Display label + plain text for "view" mode
    return (
      <>
        <DarkLabel>NAME</DarkLabel>
        <p style={{ color: '#fff', marginTop: '0.3rem' }}>{taskName}</p>
      </>
    );
  }

  return (
    <>
      <DarkLabel htmlFor='taskName'>NAME</DarkLabel>
      <DarkInput
        id='taskName'
        type='text'
        placeholder='Title'
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />
    </>
  );
};

export default TaskNameInput;
