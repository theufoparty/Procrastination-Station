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
`;

const Container = styled.div`
  margin: 2rem;
`;

const predefinedCategories = ['Work', 'Household', 'Fitness', 'Errands', 'Others'];

const NewTaskButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #485ed9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out;
  margin-bottom: 1rem;

  &:hover {
    background-color: #91b3df;
  }

  @media (max-width: 600px) {
    width: 100%;
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
    joinAlliance,
    createAllianceTask,
    leaveAlliance,
  } = useAlliance(allianceId);

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  /** Handle Joining Alliance */
  const handleJoinAlliance = async () => {
    if (!user) {
      alert('Please log in first.');
      return;
    }
    try {
      await joinAlliance();
    } catch {
      alert('Could not join alliance.');
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
              <NewTaskButton onClick={() => setIsCreatingTask(true)}>New Task</NewTaskButton>
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
          <TaskListContainer>
            <TaskList
              tasks={allianceTasks}
              onUpdateTask={handleUpdateTask}
              allianceMembers={allianceMembers}
              categories={predefinedCategories}
            />
          </TaskListContainer>
        </>
      )}
    </Container>
  );
};

export default AllianceDashboard;
