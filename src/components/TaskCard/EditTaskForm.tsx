import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { SubTask } from '../../types/firestore';
import { parseDueDate } from '../../utils/taskUtils';
import SubTaskListEditView from './SubTaskListEditView';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DarkHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #35328b;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  align-items: flex-start;
  padding-bottom: 8em;
  @media (min-width: 768px) {
  }
`;

const OuterContainer = styled.div`
  background-color: #fff;
  border-radius: 0px;
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
  @media (min-width: 768px) {
    border-radius: 20px;
    width: 20em;
  }
`;

const Container = styled.div`
  background-color: #fff;
  border-radius: 0px;
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
  padding: 20px;
  @media (min-width: 768px) {
    border-radius: 20px;
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', serif;
  margin: 0;
  text-align: center;
  color: #35328b;
  font-size: 2em;
  font-weight: 300;
`;

const TaskDetail = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: 'Montserrat', serif;
  font-size: 0.9rem;
  font-weight: 300;
  color: #232323;
`;

const Input = styled.input`
  font-family: 'Montserrat', serif;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 300;
  color: #374e56;
  outline: none;
  background-color: transparent;

  &:focus {
    border-bottom: 1px solid #007bff;
  }
`;

const Select = styled.select`
  font-family: 'Montserrat', serif;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 300;
  color: #374e56;
  background: transparent;
  outline: none;

  &:focus {
    border-bottom: 1px solid #35328b;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 10px;
`;

const SubmitButton = styled.button`
  font-family: 'Montserrat', serif;
  display: flex;
  background-color: #35328b;
  color: #fff;
  border: none;
  border-radius: 20px;
  width: 14em;
  padding: 12ppx;
  font-size: 0.7em;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #413dbe;
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
    <OuterContainer>
      <Container>
        <DarkHeader>
          <Title>Edit Task</Title>
          <TaskDetail>
            <label htmlFor='name'>Name:</label>
            <Input
              id='name'
              type='text'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </TaskDetail>

          <TaskDetail>
            <Label htmlFor='description'>Description:</Label>
            <textarea
              id='description'
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </TaskDetail>
        </DarkHeader>
        <TaskDetail>
          <Label>Subtasks:</Label>
          <SubTaskListEditView
            subTasks={editSubTasks}
            onChangeSubTasks={(updated) => setEditSubTasks(updated)}
          />
        </TaskDetail>

        <TaskDetail>
          <Label htmlFor='priority'>Priority:</Label>
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
          <Label htmlFor='recurrence'>Recurrence:</Label>
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
          <Label htmlFor='dueDate'>Due Date:</Label>
          <Input
            id='dueDate'
            type='datetime-local'
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />
        </TaskDetail>

        <TaskDetail>
          <Label htmlFor='assignUsers'>Assign Users:</Label>
          <Select
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
          </Select>
        </TaskDetail>

        <TaskDetail>
          <Label htmlFor='category'>Category:</Label>
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

        <ButtonContainer>
          <SubmitButton onClick={handleSave}>Save</SubmitButton>
          <SubmitButton onClick={onCancel}>Cancel</SubmitButton>
        </ButtonContainer>
      </Container>
    </OuterContainer>
  );
};

export default EditTaskForm;
