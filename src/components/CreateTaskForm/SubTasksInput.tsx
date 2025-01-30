// SubTasksInput.tsx
import React from 'react';
import { SubTask } from '../../types/firestore';
import {
  AddSubtaskButton,
  RemoveSubtaskButton,
  SubtaskContainer,
  LightInput,
  InputContainer,
  // If you put ReadOnlySubtaskContainer in the same styled file, import it too
  ReadOnlySubtaskContainer,
} from './styled';
import { updateSubtask } from '../../utils/updateSubtask';

interface SubTasksInputProps {
  taskId?: string;
  subTasks: SubTask[];
  setSubTasks: React.Dispatch<React.SetStateAction<SubTask[]>>;
  readOnly?: boolean;
}

const SubTasksInput: React.FC<SubTasksInputProps> = ({
  taskId,
  subTasks,
  setSubTasks,
  readOnly = false,
}) => {
  // =====================================
  // EDIT-ONLY HANDLERS
  // =====================================
  const handleAddSubTask = () => {
    setSubTasks((prev) => [...prev, { name: '', completed: false }]);
  };

  const handleChangeSubTaskName = (index: number, newName: string) => {
    setSubTasks((prev) => prev.map((st, i) => (i === index ? { ...st, name: newName } : st)));
  };

  const handleRemoveSubTask = (index: number) => {
    setSubTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // =====================================
  // COMPLETION TOGGLING (ALSO ALLOWED IN "READ-ONLY" MODE)
  // =====================================
  const handleToggleCompleted = (index: number) => {
    if (taskId) {
      const subTask = subTasks[index];
      updateSubtask(taskId, index, {
        completed: !subTask.completed,
      });
    }
  };

  // =====================================
  // READ-ONLY MODE
  // =====================================
  if (readOnly) {
    // Show subtasks in a simplified list,
    // but still allow toggling completed status via checkbox
    return (
      <InputContainer>
        <p style={{ fontWeight: 'bold' }}>Subtasks</p>
        {subTasks.length === 0 && <p>—</p>}
        {subTasks.map((subTask, index) => (
          <ReadOnlySubtaskContainer key={index} completed={subTask.completed}>
            {!!taskId && (
              <input
                type='checkbox'
                checked={subTask.completed}
                onChange={() => handleToggleCompleted(index)}
              />
            )}
            <p>{subTask.name}</p>
          </ReadOnlySubtaskContainer>
        ))}
      </InputContainer>
    );
  }

  // =====================================
  // EDITABLE MODE
  // =====================================
  return (
    <InputContainer>
      <AddSubtaskButton type='button' onClick={handleAddSubTask}>
        + Add Subtask
      </AddSubtaskButton>
      {subTasks.map((subTask, index) => (
        <div key={index}>
          <SubtaskContainer>
            <RemoveSubtaskButton type='button' onClick={() => handleRemoveSubTask(index)}>
              X
            </RemoveSubtaskButton>
            <LightInput
              type='text'
              placeholder='Subtask name'
              value={subTask.name}
              onChange={(e) => handleChangeSubTaskName(index, e.target.value)}
              required
            />
            <input
              type='checkbox'
              checked={subTask.completed}
              onChange={() => handleToggleCompleted(index)}
              style={{ marginLeft: '0.5rem' }}
            />
          </SubtaskContainer>
        </div>
      ))}
    </InputContainer>
  );
};

export default SubTasksInput;
