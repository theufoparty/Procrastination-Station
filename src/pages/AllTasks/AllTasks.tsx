import React, { useState } from 'react';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import TaskList from '../../components/TaskList';
import CreateTaskForm from '../../components/CreateTaskForm';
import { updateTask } from '../../utils/updateTask';
import { Task } from '../../types/firestore';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 20px;

  min-height: 100vh;
  background-color: #f3f5fe;
  @media (min-width: 768px) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 2rem;
  }
`;

const CategoryButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1.5rem;
  justify-content: center;
`;

const CategoryButton = styled.button<{ isSelected: boolean }>`
  padding: 16px;
  font-size: 1em;
  width: 6em;
  background-color: ${(props) => (props.isSelected ? '#35328b' : '#ffffff')};
  color: ${(props) => (props.isSelected ? 'white' : '#838383')};
  border-radius: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #35328b;
    color: white;
  }
`;

const NewTaskButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 400;
  padding: 16px;
  font-size: 1em;
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;
`;

const TaskSearchInput = styled.input`
  font-family: 'Montserrat', serif;
  align-self: center;
  padding: 12px 20px;
  font-size: 1em;
  margin-bottom: 3em;
  margin-top: 3em;
  border: none;
  width: 80%;
  text-align: center;
  outline: none;
  background-color: #f3f5fe;

  &::placeholder {
    color: #a9a9a9;
  }

  &:focus {
    border-bottom: 1px solid #35328b;
  }
`;

const TaskButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 0px;
  max-width: 600px;
  width: 100%;
  height: 100%;

  @media (min-width: 768px) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 2rem;
    height: 80%;
    border-radius: 20px;
  }
`;

const AllTasks: React.FC = () => {
  const { user, userTasks, createUserTask } = useAuth(auth, db);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const predefinedCategories = ['Personal', 'Work', 'Fitness', 'Errands', 'Others'];

  const filteredTasks = userTasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesSearchTerm = task.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearchTerm;
  });

  const handleCreateTask = async (taskData: {
    name: string;
    description?: string;
    priority?: string;
    recurrence?: string;
    dueDate?: Date | null;
    category?: string;
  }) => {
    if (!user) {
      alert('Please log in first.');
      return;
    }
    try {
      await createUserTask(taskData);
      setIsCreatingTask(false);
    } catch (error) {
      alert('Could not create user task.');
      console.error(error);
    }
  };

  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    if (!user) {
      alert('Please log in first.');
      return;
    }
    try {
      await updateTask(taskId, data);
    } catch {
      alert('Could not update task.');
    }
  };

  return (
    <Container>
      <TaskButtonContainer>
        <NewTaskButton onClick={() => setIsCreatingTask(true)}>Create Personal Task</NewTaskButton>
      </TaskButtonContainer>
      <TaskSearchInput
        type='text'
        placeholder='Search tasks by title'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <CategoryButtonContainer>
        {['All', ...predefinedCategories].map((category) => (
          <CategoryButton
            key={category}
            isSelected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryButtonContainer>

      {isCreatingTask && (
        <ModalOverlay>
          <ModalContainer>
            <CreateTaskForm
              categories={predefinedCategories}
              onCreateTask={handleCreateTask}
              onCancel={() => setIsCreatingTask(false)}
              allianceMembers={[]}
            />
          </ModalContainer>
        </ModalOverlay>
      )}

      <TaskList
        tasks={filteredTasks}
        categories={predefinedCategories}
        onUpdateTask={handleUpdateTask}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        allianceMembers={[]}
      />
    </Container>
  );
};

export default AllTasks;
