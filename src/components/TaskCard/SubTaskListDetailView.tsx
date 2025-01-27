import React from 'react';
import { SubTask } from '../../types/firestore';
import { updateSubtask } from '../../utils/updateSubtask';

interface SubTaskListDetailViewProps {
  subTasks: SubTask[];
  taskId: string;
  onChangeCompleted?: (index: number, completed: boolean) => void;
}

const SubTaskListDetailView: React.FC<SubTaskListDetailViewProps> = ({ subTasks, taskId }) => {
  const handleCompletedChange = (index: number, completed: boolean) => {
    updateSubtask(taskId, index, {
      completed,
    });
  };

  return (
    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
      {subTasks.map((st, i) => (
        <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {st.name}
          <label>
            <input
              type='checkbox'
              checked={st.completed}
              onChange={(e) => handleCompletedChange(i, e.target.checked)}
            />
            Completed
          </label>
        </li>
      ))}
    </ul>
  );
};

export default SubTaskListDetailView;
