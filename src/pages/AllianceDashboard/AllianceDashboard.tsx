import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { useAlliance } from '../../utils/useAlliance';
import JoinAllianceButton from './components/JoinAllianceButton';
import AllianceMemberList from './components/AllianceMemberList';
import TaskList from '../../components/TaskList';
import CreateTaskForm from '../../components/CreateTaskForm';
import LeaveAllianceButton from './components/LeaveAllianceButton';
import styled, { keyframes } from 'styled-components';
import { AllianceLink } from './components/AllianceLink';
import { Task } from '../../types/firestore';
import { updateTask } from '../../utils/updateTask';
import { joinAlliance } from '../../utils/joinAlliance';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SearchInput = styled.input`
  align-self: center;
  font-family: 'Montserrat', serif;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const NewTaskContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

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

const predefinedCategories = ['Work', 'Household', 'Fitness', 'Errands', 'Others'];

const NewTaskButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 400;
  padding: 16px;
  font-size: 1rem;
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
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
  width: 8em;
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

const AllianceDashboard: React.FC = () => {
  const { allianceId } = useParams<{ allianceId: string }>();
  const { user } = useAuth(auth, db);

  const {
    alliance,
    allianceTasks,
    allianceMembers,
    isMemberOfAlliance,
    createAllianceTask,
    leaveAlliance,
  } = useAlliance(allianceId);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleJoinAlliance = async () => {
    if (!user) {
      alert('Please log in first.');
      return;
    }
    if (allianceId) {
      try {
        await joinAlliance({
          userId: user.uid,
          allianceId: allianceId,
        });
      } catch {
        alert('Could not join alliance.');
      }
    }
  };

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
      <NewTaskContainer>
        {isMemberOfAlliance && (
          <>
            {!isCreatingTask && (
              <ButtonContainer>
                <NewTaskButton onClick={() => setIsCreatingTask(true)}>New Task</NewTaskButton>
              </ButtonContainer>
            )}
            {isCreatingTask && (
              <ModalOverlay>
                <ModalContainer>
                  <CreateTaskForm
                    onCreateTask={handleCreateTask}
                    allianceMembers={allianceMembers}
                    categories={predefinedCategories}
                    onCancel={handleCancelCreateTask}
                  />
                </ModalContainer>
              </ModalOverlay>
            )}
          </>
        )}
      </NewTaskContainer>

      {!alliance ? (
        <p>Loading Alliance...</p>
      ) : (
        <>
          <p>
            <strong>Alliance Name:</strong> {alliance.name}
          </p>
          <p>
            <strong>Is Member:</strong> {isMemberOfAlliance ? 'Yes' : 'No'}
          </p>

          <JoinAllianceButton
            onJoin={handleJoinAlliance}
            canJoin={!isMemberOfAlliance}
            isLoggedIn={!!user}
          />
          <LeaveAllianceButton
            onLeave={leaveAlliance}
            canLeave={isMemberOfAlliance}
            isLoggedIn={!!user}
          />

          <AllianceMemberList members={allianceMembers} />
          <AllianceLink allianceId={allianceId} />

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
