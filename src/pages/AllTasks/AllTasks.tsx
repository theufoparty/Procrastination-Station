import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import TaskList from '../../components/TaskList';
import CreateTaskForm from '../../components/CreateTaskForm';
import { updateTask } from '../../utils/updateTask';
import { Task } from '../../types/firestore';

const Container = styled.div`
  min-height: 100vh; /* Ensure the container fills at least the viewport height */
  display: flex; /* Flexbox layout for alignment */
  flex-direction: column; /* Stack children vertically */
  justify-content: space-between; /* Spread content to edges */
  margin: 2rem;
`;

const NewTaskButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 400;
  height: 3em;
  width: fit-content;
  padding: 0.8rem;
  font-size: 1.2rem;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); */
  background: none;
  border: 1px solid #374e56;
  border-radius: 0.5em;
  color: #374e56;
  background-color: #fff;
  cursor: pointer;
  position: fixed;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: #374e56;
    color: #fff;
  }

  top: 2em;
  right: 2em;

  @media (max-width: 768px) {
    bottom: 2rem;
    top: auto;
    right: 50%;
    width: 85%;
    transform: translateX(50%);
  }
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

  @media (min-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  overflow: hidden;
`;

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AllTasks: React.FC = () => {
  const { user, userTasks, createUserTask } = useAuth(auth, db);

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const predefinedCategories = ['Personal', 'Work', 'Fitness', 'Errands', 'Others'];

  const handleCreateTask = async (taskData: {
    name: string;
    description?: string;
    priority?: string;
    recurrence?: string;
    dueDate?: Date | null;
    // assignedUserIds?: string[]; // For user-only tasks
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

  const handleCancelCreateTask = () => {
    setIsCreatingTask(false);
  };

  return (
    <Container>
      <TaskContainer>
        <NewTaskButton onClick={() => setIsCreatingTask(true)}>Create Personal Task</NewTaskButton>

        {isCreatingTask && (
          <ModalOverlay>
            <ModalContainer>
              <CreateTaskForm
                allianceMembers={[]}
                categories={predefinedCategories}
                onCreateTask={handleCreateTask}
                onCancel={handleCancelCreateTask}
              />
            </ModalContainer>
          </ModalOverlay>
        )}

        <TaskList
          tasks={userTasks}
          allianceMembers={[]}
          categories={predefinedCategories}
          onUpdateTask={handleUpdateTask}
        />
      </TaskContainer>
    </Container>
  );
};

export default AllTasks;
