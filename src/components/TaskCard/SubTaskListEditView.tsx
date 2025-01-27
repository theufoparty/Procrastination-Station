import { SubTask } from '../../types/firestore';

// SubTaskListEditView Component
interface SubTaskListEditViewProps {
  subTasks: SubTask[];
  onChangeSubTasks: (updatedSubTasks: SubTask[]) => void;
}

const SubTaskListEditView: React.FC<SubTaskListEditViewProps> = ({
  subTasks,
  onChangeSubTasks,
}) => {
  const handleNameChange = (index: number, newName: string) => {
    const updated = subTasks.map((s, i) => (i === index ? { ...s, name: newName } : s));
    onChangeSubTasks(updated);
  };

  const handleRemove = (index: number) => {
    const updated = subTasks.filter((_, i) => i !== index);
    onChangeSubTasks(updated);
  };

  const handleAdd = () => {
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

export default SubTaskListEditView;
