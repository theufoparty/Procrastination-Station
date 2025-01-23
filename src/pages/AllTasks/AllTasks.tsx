import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import TaskList from '../../components/TaskList';
import CreateTaskForm from '../../components/CreateTaskForm';
import { updateTask } from '../../utils/updateTask';
import { Task } from '../../types/firestore';

const Container = styled.div`
  margin: 2rem;
`;

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
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  overflow: hidden;
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
      <h2>{user?.displayName || user?.email}'s Task Dashboard</h2>
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

      <h3>Your Personal Tasks</h3>
      <TaskList
        tasks={userTasks}
        allianceMembers={[]} // no alliance members
        categories={predefinedCategories}
        onUpdateTask={handleUpdateTask}
      />
    </Container>
  );
};

export default AllTasks;
