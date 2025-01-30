import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { useAlliance } from '../../utils/useAlliance';
import TaskList from '../../components/TaskList';
import styled from 'styled-components';
import { Task } from '../../types/firestore';
import { updateTask } from '../../utils/updateTask';
import { ManageAlliance } from './components/ManageAlliance';
import Modal from '../../components/Modal';
import TaskForm from '../../components/TaskForm/TaskForm';

const SearchInput = styled.input`
  font-family: 'Montserrat', serif;
  align-self: center;
  padding: 12px 20px;
  font-size: 0.8em;
  margin-bottom: 3em;
  margin-top: 2em;
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

const AllianceName = styled.h2`
  font-family: 'Montserrat', serif;
  font-weight: 400;
`;

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const predefinedCategories = ['Work', 'Home', 'Errands', 'Others', 'Personal'];

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1em;
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const ActionButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding: 12px;
  border: none;
  font-size: 0.8em;
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    margin-top: 2em;
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
  padding: 12px;
  font-size: 0.8em;
  font-family: 'Montserrat', serif;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6em;
  background-color: ${(props) => (props.isSelected ? '#35328b' : '#ffffff')};
  color: ${(props) => (props.isSelected ? 'white' : '#000000')};
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

const AllianceDashboard: React.FC = () => {
  const { allianceId } = useParams<{ allianceId: string }>();
  const { user } = useAuth(auth, db);

  const { alliance, allianceTasks, allianceMembers, createAllianceTask } = useAlliance(allianceId);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isManagingAlliance, setIsManagingAlliance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCreateTask = async (taskData: {
    name: string;
    description?: string;
    priority?: string;
    recurrence?: string;
    dueDate?: Date | null;
    assignedUserIds?: string[];
    category?: string;
  }) => {
    if (!user) {
      alert('Please log in first.');
      return;
    }
    try {
      await createAllianceTask(taskData);
      setIsCreatingTask(false);
    } catch {
      alert('Could not create task.');
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

  const handleCancelCreateTask = () => {
    setIsCreatingTask(false);
  };

  return (
    <Container>
      <TopContainer>
        <p>
          <AllianceName>{alliance ? alliance.name : ''}</AllianceName>
        </p>

        <ActionContainer>
          <ButtonContainer>
            <ActionButton onClick={() => setIsCreatingTask(true)}>New Task</ActionButton>
          </ButtonContainer>
          <ButtonContainer>
            <ActionButton onClick={() => setIsManagingAlliance(true)}>Manage alliance</ActionButton>
          </ButtonContainer>
          <Modal isOpen={isCreatingTask} onClose={handleCancelCreateTask}>
            <TaskForm
              mode='create'
              onSaveTask={handleCreateTask}
              allianceMembers={allianceMembers}
              categories={predefinedCategories}
              onCancel={handleCancelCreateTask}
              onRequestEdit={() => {}}
              removeTask={() => {}}
            />
          </Modal>
          <Modal isOpen={isManagingAlliance} onClose={() => setIsManagingAlliance(false)}>
            <ManageAlliance />
          </Modal>
        </ActionContainer>
      </TopContainer>
      {!alliance ? (
        <p>Loading Alliance...</p>
      ) : (
        <>
          <SearchInput
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

          <TaskListContainer>
            <TaskList
              tasks={allianceTasks}
              onUpdateTask={handleUpdateTask}
              allianceMembers={allianceMembers}
              categories={predefinedCategories}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </TaskListContainer>
        </>
      )}
    </Container>
  );
};

export default AllianceDashboard;
