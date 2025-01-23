import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

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
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  background-color: #f0f3f8;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Form = styled.form`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const DarkHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #2b3044;
  padding: 1em;
  align-items: flex-start;
  padding-top: 4em;
`;

const CloseButton = styled.button`
  top: 1rem;
  left: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 100;
`;

const Title = styled.h2`
  margin: 0;
  text-align: center;
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: 100;
`;

const FormContainer = styled.div`
  z-index: 10;
  background-color: #ffffff;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DarkLabel = styled.label`
  display: block;
  color: #fff;
  font-size: 0.8rem;
  margin-top: 1rem;
  font-weight: 100;
`;

const DarkInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #ccc;
  color: #fff;
  padding: 0.4rem 0;
  font-size: 1rem;
  font-weight: 100;

  &:focus {
    outline: none;
    border-bottom: 1px solid #fff;
  }
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 100;
  color: #232323;
`;

const LightInput = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 100;
  color: #333;
  outline: none;
  background-color: transparent;

  &:focus {
    border-bottom: 1px solid #007bff;
  }
`;

const TextArea = styled.textarea`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 100;
  color: #333;
  outline: none;
  resize: none;
  min-height: 60px;

  &:focus {
    border-bottom: 1px solid #007bff;
  }
`;

const Select = styled.select`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  font-weight: 100;
  color: #333;
  background: transparent;
  outline: none;

  &:focus {
    border-bottom: 1px solid #007bff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #4d63f3;
  color: #fff;
  border: none;
  border-radius: 2em;
  height: 3em;
  width: 14em;
  padding: 1em;
  font-size: 1em;
  font-weight: 100;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #6f84f6;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriorityButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const PriorityButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 100;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ selected }) => (selected ? '#4d63f3' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#6f84f6' : '#d4d4d4')};
  }
`;

const CategoryButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CategoryButton = styled.button<{ selected: boolean }>`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 100;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ selected }) => (selected ? '#4d63f3' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#6f84f6' : '#d4d4d4')};
  }
`;

const RecurrenceButton = styled.button<{ selected: boolean }>`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 100;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ selected }) => (selected ? '#4d63f3' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#6f84f6' : '#d4d4d4')};
  }
`;

const RecurrenceButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
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

  const priorityOptions = ['Low', 'Medium', 'High'];
  const recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly'];

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
    });

    setTaskName('');
    setTaskDescription('');
    setTaskPriority('Low');
    setTaskRecurrence('None');
    setTaskDate('');
    setTaskTime('');
    setAssignedIds([]);
    setTaskCategory('None');
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
