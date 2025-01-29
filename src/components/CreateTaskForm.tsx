import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { SubTask } from '../types/firestore';

interface AllianceMember {
  id: string;
  name: string;
  email?: string;
}

interface CreateTaskFormProps {
  onCreateTask: (taskData: {
    name: string;
    description?: string;
    priority?: string;
    recurrence?: string;
    dueDate?: Date | null;
    assignedUserIds?: string[];
    category?: string;
    subTasks?: SubTask[];
  }) => void;
  allianceMembers: AllianceMember[];
  categories: string[];
  onCancel: () => void;
}

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 50%;
  overflow-y: auto;
  background-color: #f3f5fe;
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

const CloseButton = styled.button`
  top: 1rem;
  left: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 300;
`;

const Title = styled.h2`
  margin: 0;
  text-align: center;
  color: #ffffff;
  font-size: 1.4em;
  font-weight: 300;
`;

const FormContainer = styled.div`
  z-index: 10;
  background-color: #ffffff;
  padding: 20px;
  padding-top: 2em;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 73vh;
  overflow-y: auto;
  margin-top: -7em;
  margin-inline: 20px;
  margin-bottom: 20px;
  border-radius: 20px;
  @media (min-width: 768px) {
    max-height: 50vh;
  }
`;

const DarkLabel = styled.label`
  display: block;
  color: #ffffff;
  font-size: 0.6rem;
  margin-top: 1rem;
  font-weight: 300;
`;

const DarkInput = styled.input`
  font-family: 'Montserrat', serif;
  width: 100%;
  background: #35328b;
  border: none;
  border-bottom: 1px solid #ccc;
  color: #fff;
  padding: 0.4rem 0;
  font-size: 0.6em;
  font-weight: 300;

  &:focus {
    outline: none;
    border-bottom: 1px solid #fff;
  }
`;

const Label = styled.label`
  font-size: 0.6rem;
  font-weight: 300;
  color: #232323;
`;

const LightInput = styled.input`
  font-family: 'Montserrat', serif;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.4rem 0;
  font-size: 0.6em;
  font-weight: 300;
  color: #374e56;
  outline: none;
  background-color: transparent;

  &:focus {
    border-bottom: 1px solid #007bff;
  }
`;

const TextArea = styled.textarea`
  font-family: 'Montserrat', serif;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 12px;
  font-size: 0.6em;
  font-weight: 300;
  color: #374e56;
  outline: none;
  resize: none;
  min-height: 10em;

  &:focus {
    border-bottom: 1px solid #35328b;
  }
`;

const Select = styled.select`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 12px 0;
  font-size: 0.6em;
  font-weight: 300;
  color: #ffffff;
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
`;

const SubmitButton = styled.button`
  font-family: 'Montserrat', serif;
  display: flex;
  background-color: #35328b;
  color: #fff;
  border: none;
  border-radius: 2em;
  width: 14em;
  padding: 12px;
  font-size: 0.6em;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #413dbe;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriorityButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5em;
  row-gap: 1em;
  flex-wrap: wrap;
`;

const PriorityButton = styled.button<{ selected: boolean }>`
  font-family: 'Montserrat', serif;
  padding: 12px;
  width: 14em;
  font-size: 0.6em;
  border: none;
  border-radius: 20px;
  margin-inline: 1em;
  cursor: pointer;
  font-weight: 300;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ selected }) => (selected ? '#35328b;' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#6f84f6' : '#d4d4d4')};
  }
`;

const AddSubtaskButton = styled.button`
  font-family: 'Montserrat', serif;
  display: flex;
  background-color: #35328b;
  color: #fff;
  border: none;
  border-radius: 2em;
  width: 14em;
  padding: 12px;
  font-size: 0.6em;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #413dbe;
  }
`;

const RemoveSubtaskButton = styled.button`
  font-family: 'Montserrat', serif;
  margin-top: 20px;
  display: flex;
  background-color: #35328b;
  color: #fff;
  border: none;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  padding: 16px;
  font-size: 0.6em;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  align-items: center;
  justify-content: center;
`;

const CategoryButtonContainer = styled.div`
  display: flex;
  margin-top: 0.5rem;
  align-items: center;
  justify-content: center;
  row-gap: 1em;
  flex-wrap: wrap;
`;

const SubtaskContainer = styled.div`
  font-family: 'Montserrat', serif;
  display: flex;
  gap: 0.5em;
  margin-bottom: 0.5em;
  font-size: 0.6;
  align-items: flex-end;
`;

const CategoryButton = styled.button<{ selected: boolean }>`
  font-family: 'Montserrat', serif;
  width: 8em;
  padding: 12px;
  margin-inline: 1em;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.6em;
  font-weight: 300;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ selected }) => (selected ? '#35328b;' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#6f84f6' : '#d4d4d4')};
  }
`;

const RecurrenceButton = styled.button<{ selected: boolean }>`
  font-family: 'Montserrat', serif;
  padding: 12px;
  width: 8em;
  border: none;
  margin-inline: 1em;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.6em;
  font-weight: 300;
  transition: background-color 0.2s ease-in-out;
  background-color: ${({ selected }) => (selected ? '#4d63f3' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};
  &:hover {
    background-color: ${({ selected }) => (selected ? '#35328b;' : '#d4d4d4')};
  }
`;

const RecurrenceButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5em;
  align-items: center;
  justify-content: center;
  row-gap: 1em;
  flex-wrap: wrap;
`;

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onCreateTask,
  allianceMembers,
  categories,
  onCancel,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('Low');
  const [taskRecurrence, setTaskRecurrence] = useState('None');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [taskCategory, setTaskCategory] = useState('None');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const priorityOptions = ['Low', 'Medium', 'High'];
  const recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly'];

  /** Add a new empty subtask row */
  const handleAddSubTask = () => {
    setSubTasks((prev) => [...prev, { name: '', completed: false }]);
  };

  /** Update the subtask name in the array */
  const handleChangeSubTaskName = (index: number, newName: string) => {
    setSubTasks((prev) => prev.map((st, i) => (i === index ? { ...st, name: newName } : st)));
  };

  /** Remove a subtask */
  const handleRemoveSubTask = (index: number) => {
    setSubTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalDueDate: Date | null = null;
    if (taskDate && taskTime) {
      const datePart = new Date(taskDate);
      const [hours, minutes] = taskTime.split(':').map(Number);
      datePart.setHours(hours || 0, minutes || 0, 0, 0);
      finalDueDate = datePart;
    }

    onCreateTask({
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      recurrence: taskRecurrence,
      dueDate: finalDueDate,
      assignedUserIds: assignedIds,
      category: taskCategory !== 'None' ? taskCategory : undefined,
      subTasks,
    });

    setTaskName('');
    setTaskDescription('');
    setTaskPriority('Low');
    setTaskRecurrence('None');
    setTaskDate('');
    setTaskTime('');
    setAssignedIds([]);
    setTaskCategory('None');
    setSubTasks([]);
  };

  return (
    <OuterContainer>
      <Form onSubmit={handleSubmit}>
        <DarkHeader>
          <CloseButton type='button' onClick={onCancel}>
            &#x2190;
          </CloseButton>
          <Title>Create New Task</Title>

          <DarkLabel htmlFor='taskName'>NAME</DarkLabel>
          <DarkInput
            id='taskName'
            type='text'
            placeholder='Title'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />

          <DarkLabel htmlFor='taskDate'>DATE</DarkLabel>
          <DarkInput
            id='taskDate'
            type='date'
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
        </DarkHeader>

        <FormContainer>
          <InputContainer>
            <Label htmlFor='taskTime'>TIME</Label>
            <LightInput
              id='taskTime'
              type='time'
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <Label htmlFor='taskDescription'>Description</Label>
            <TextArea
              id='taskDescription'
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={2}
            />
          </InputContainer>
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
                </SubtaskContainer>
              </div>
            ))}
          </InputContainer>

          <InputContainer>
            <Label>Priority</Label>
            <PriorityButtonContainer>
              {priorityOptions.map((option) => (
                <PriorityButton
                  key={option}
                  type='button'
                  selected={taskPriority === option}
                  onClick={() => setTaskPriority(option)}
                >
                  {option}
                </PriorityButton>
              ))}
            </PriorityButtonContainer>
          </InputContainer>

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

          <InputContainer>
            <Label htmlFor='assignedUsers'>Assign Users</Label>
            <Select
              id='assignedUsers'
              multiple
              value={assignedIds}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                setAssignedIds(selected);
              }}
              style={{ height: '80px' }}
            >
              {allianceMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
          </InputContainer>

          <InputContainer>
            <Label>Category</Label>
            <CategoryButtonContainer>
              <CategoryButton
                type='button'
                selected={taskCategory === 'None'}
                onClick={() => setTaskCategory('None')}
              >
                None
              </CategoryButton>

              {categories.map((cat) => (
                <CategoryButton
                  key={cat}
                  type='button'
                  selected={taskCategory === cat}
                  onClick={() => setTaskCategory(cat)}
                >
                  {cat}
                </CategoryButton>
              ))}
            </CategoryButtonContainer>
          </InputContainer>

          <ButtonContainer>
            <SubmitButton type='submit'>Create Task</SubmitButton>
          </ButtonContainer>
        </FormContainer>
      </Form>
    </OuterContainer>
  );
};

export default CreateTaskForm;
