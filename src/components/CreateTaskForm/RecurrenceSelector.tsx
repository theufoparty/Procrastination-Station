// RecurrenceSelector.tsx
import React from 'react';
import { Label, RecurrenceButtonContainer, RecurrenceButton, InputContainer } from './styled';

interface RecurrenceSelectorProps {
  taskRecurrence: string;
  setTaskRecurrence: (value: string) => void;
  recurrenceOptions: string[];
  readOnly?: boolean;
}

const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  taskRecurrence,
  setTaskRecurrence,
  recurrenceOptions,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <InputContainer>
        <Label>Recurrence</Label>
        <p style={{ marginTop: '0.3rem' }}>{taskRecurrence || '—'}</p>
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      <Label>Recurrence</Label>
      <RecurrenceButtonContainer>
        {recurrenceOptions.map((option) => (
          <RecurrenceButton
            key={option}
            type='button'
            selected={taskRecurrence === option}
            onClick={() => setTaskRecurrence(option)}
          >
            {option}
          </RecurrenceButton>
        ))}
      </RecurrenceButtonContainer>
    </InputContainer>
  );
};

export default RecurrenceSelector;
