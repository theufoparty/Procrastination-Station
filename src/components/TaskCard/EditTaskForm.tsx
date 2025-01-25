// components/TaskCard/EditTaskForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { SubTask } from '../../types/firestore';
import SubTaskList from './SubTaskList';
import { parseDueDate } from '../../utils/taskUtils';

const TaskDetail = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #555;
`;

interface AllianceMember {
  id: string;
  name: string;
  email?: string;
}

interface EditTaskFormProps {
  name: string;
  description: string;
  priority: string;
  recurrence: string;
  dueDate: Date | null;
  assignedUserIds?: string[];
  allianceMembers: AllianceMember[];
  categories: string[];
  category?: string;
  subTasks: SubTask[];

  onSave: (data: {
    name: string;
    description: string;
    priority: string;
    recurrence: string;
    dueDate: Date | null;
    assignedUserIds: string[];
    category: string;
    subTasks: SubTask[];
  }) => void;

  onCancel: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  name: initialName,
  description: initialDescription,
  priority: initialPriority,
  recurrence: initialRecurrence,
  dueDate: initialDueDate,
  assignedUserIds: initialAssignedUserIds = [],
  allianceMembers,
  categories,
  category: initialCategory,
  subTasks: initialSubTasks,
  onSave,
  onCancel,
}) => {
  // Local state for editing
  const [editName, setEditName] = useState(initialName);
  const [editDescription, setEditDescription] = useState(initialDescription);
  const [editPriority, setEditPriority] = useState(initialPriority);
  const [editRecurrence, setEditRecurrence] = useState(initialRecurrence);
  const [editDueDate, setEditDueDate] = useState(
    initialDueDate ? initialDueDate.toISOString().slice(0, 16) : ''
  );
  const [editAssignedIds, setEditAssignedIds] = useState<string[]>(initialAssignedUserIds);
  const [editCategory, setEditCategory] = useState(initialCategory || 'None');
  const [editSubTasks, setEditSubTasks] = useState<SubTask[]>(initialSubTasks);

  const handleSave = () => {
    onSave({
      name: editName,
      description: editDescription,
      priority: editPriority,
      recurrence: editRecurrence,
      dueDate: parseDueDate(editDueDate),
      assignedUserIds: editAssignedIds,
      category: editCategory,
      subTasks: editSubTasks,
    });
  };

  return (
    <div>
      <TaskDetail>
        <strong>Name:</strong>
        <br />
        <input
          type='text'
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          style={{ width: '100%' }}
        />
      </TaskDetail>

      <TaskDetail>
        <strong>Description:</strong>
        <br />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          style={{ width: '100%' }}
        />
      </TaskDetail>

      <TaskDetail>
        <strong>Subtasks:</strong>
        <SubTaskList
          subTasks={editSubTasks}
          editable
          onChangeSubTasks={(updated) => setEditSubTasks(updated)}
        />
      </TaskDetail>

      <TaskDetail>
        <strong>Priority:</strong>
        <br />
        <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </TaskDetail>

      <TaskDetail>
        <strong>Recurrence:</strong>
        <br />
        <select value={editRecurrence} onChange={(e) => setEditRecurrence(e.target.value)}>
          <option>None</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </TaskDetail>

      <TaskDetail>
        <strong>Due Date:</strong>
        <br />
        <input
          type='datetime-local'
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
        />
      </TaskDetail>

      <TaskDetail>
        <strong>Assign Users:</strong>
        <br />
        <select
          multiple
          style={{ width: '100%', height: '100px' }}
          value={editAssignedIds}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
            setEditAssignedIds(selected);
          }}
        >
          {allianceMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </TaskDetail>

      <TaskDetail>
        <strong>Category:</strong>
        <br />
        <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
          <option>None</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </TaskDetail>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSave}>Save</button> <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditTaskForm;
