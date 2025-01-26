import React from 'react';
import { SubTask } from '../../types/firestore';

interface SubTaskListProps {
  subTasks: SubTask[];
  editable?: boolean;
  onChangeSubTasks?: (updatedSubTasks: SubTask[]) => void;
}

const SubTaskList: React.FC<SubTaskListProps> = ({
  subTasks,
  editable = false,
  onChangeSubTasks,
}) => {
  if (!editable) {
    return (
      <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
        {subTasks.map((st, i) => (
          <li key={i}>
            {st.name} {st.completed ? '(Done)' : ''}
          </li>
        ))}
      </ul>
    );
  }

  // Editable version
  const handleNameChange = (index: number, newName: string) => {
    if (!onChangeSubTasks) return;
    const updated = subTasks.map((s, i) => (i === index ? { ...s, name: newName } : s));
    onChangeSubTasks(updated);
  };

  const handleCompletedChange = (index: number, completed: boolean) => {
    if (!onChangeSubTasks) return;
    const updated = subTasks.map((s, i) => (i === index ? { ...s, completed } : s));
    onChangeSubTasks(updated);
  };

  const handleRemove = (index: number) => {
    if (!onChangeSubTasks) return;
    const updated = subTasks.filter((_, i) => i !== index);
    onChangeSubTasks(updated);
  };

  const handleAdd = () => {
    if (!onChangeSubTasks) return;
    const updated = [...subTasks, { name: '', completed: false }];
    onChangeSubTasks(updated);
  };

  return (
    <div>
      {subTasks.map((st, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type='text'
            value={st.name}
            onChange={(e) => handleNameChange(i, e.target.value)}
          />
          <label>
            <input
              type='checkbox'
              checked={st.completed}
              onChange={(e) => handleCompletedChange(i, e.target.checked)}
            />
            Completed
          </label>
          <button type='button' onClick={() => handleRemove(i)}>
            Remove
          </button>
        </div>
      ))}

      <button type='button' onClick={handleAdd}>
        + Add Subtask
      </button>
    </div>
  );
};

export default SubTaskList;
