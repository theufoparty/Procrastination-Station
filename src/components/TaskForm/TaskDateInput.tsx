import React from 'react';
import { DarkLabel, DarkInput } from './styled';

interface TaskDateInputProps {
  taskDate: string;
  setTaskDate: (value: string) => void;
  readOnly?: boolean;
}

const TaskDateInput: React.FC<TaskDateInputProps> = ({
  taskDate,
  setTaskDate,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <>
        <DarkLabel>DATE</DarkLabel>
        <p style={{ color: '#fff', marginTop: '0.3rem' }}>{taskDate || '—'}</p>
      </>
    );
  }

  return (
    <>
      <DarkLabel htmlFor='taskDate'>DUE DATE</DarkLabel>
      <DarkInput
        id='taskDate'
        type='date'
        value={taskDate}
        onChange={(e) => setTaskDate(e.target.value)}
      />
    </>
  );
};

export default TaskDateInput;
