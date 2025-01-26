import React, { useState } from 'react';
import styled from 'styled-components';
import { SubTask } from '../../types/firestore';
import SubTaskList from './SubTaskList';
import { parseDueDate } from '../../utils/taskUtils';

const Container = styled.div``;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const TaskDetail = styled.div`
  margin-bottom: 1rem;

  label {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 0.5rem;
  }

  input,
  textarea,
  select {
    width: 100%;
    height: fit-content;
    padding: 0.8rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;

    &:focus {
      border-color: #666;
      outline: none;
    }
  }

  textarea {
    resize: vertical;
  }

  select[multiple] {
    height: auto;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StyledButton = styled.button`
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: none;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
    color: #fff;
  }
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
    <Container>
      <Title>Edit Task</Title>
      <TaskDetail>
        <label htmlFor='name'>Name:</label>
        <input
          id='name'
          type='text'
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      </TaskDetail>

      <TaskDetail>
        <label htmlFor='description'>Description:</label>
        <textarea
          id='description'
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </TaskDetail>

      <TaskDetail>
        <label>Subtasks:</label>
        <SubTaskList
          subTasks={editSubTasks}
          editable
          onChangeSubTasks={(updated) => setEditSubTasks(updated)}
        />
      </TaskDetail>

      <TaskDetail>
        <label htmlFor='priority'>Priority:</label>
        <select
          id='priority'
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </TaskDetail>

      <TaskDetail>
        <label htmlFor='recurrence'>Recurrence:</label>
        <select
          id='recurrence'
          value={editRecurrence}
          onChange={(e) => setEditRecurrence(e.target.value)}
        >
          <option>None</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </TaskDetail>

      <TaskDetail>
        <label htmlFor='dueDate'>Due Date:</label>
        <input
          id='dueDate'
          type='datetime-local'
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
        />
      </TaskDetail>

      <TaskDetail>
        <label htmlFor='assignUsers'>Assign Users:</label>
        <select
          id='assignUsers'
          multiple
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
        <label htmlFor='category'>Category:</label>
        <select
          id='category'
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
        >
          <option>None</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </TaskDetail>

      <ButtonGroup>
        <StyledButton onClick={handleSave}>Save</StyledButton>
        <StyledButton onClick={onCancel}>Cancel</StyledButton>
      </ButtonGroup>
    </Container>
  );
};

export default EditTaskForm;
