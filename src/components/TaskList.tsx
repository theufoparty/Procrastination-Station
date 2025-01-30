import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task } from '../types/firestore';
import TaskSummary from './TaskCard/TaskSummary';
import Modal from './Modal';
import TaskForm from './CreateTaskForm/TaskForm';
import { Timestamp } from 'firebase/firestore';
import { removeTask } from '../utils/removeTask';

interface AllianceMember {
  id: string;
  name: string;
  email?: string;
}

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  allianceMembers: AllianceMember[];
  categories: string[];
  searchTerm: string; // Add searchTerm prop
  selectedCategory: string; // Add selectedCategory prop
}

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoriesRow = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NoTask = styled.p`
  margin: 1em;
  font-size: 1em;
  margin-bottom: 20px;
  align-self: center;
`;

const CategoryColumn = styled.div`
  display: flex;
  margin: 20px;
  flex-direction: column;

  h4 {
    margin-bottom: 20px;
    font-weight: 200;
  }

  @media (max-width: 768px) {
    margin: 0px;
  }
`;

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  allianceMembers,
  categories,
  searchTerm,
  selectedCategory,
}) => {
  const [internalTasks, setInternalTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'edit' | 'view'>('view');

  useEffect(() => {
    // Update internal tasks when tasks change
    setInternalTasks(tasks);

    // If there's a selectedTask, ensure it stays in sync with the updated tasks
    if (selectedTask) {
      const updatedTask = tasks.find((task) => task.id === selectedTask.id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
      } else {
        setSelectedTask(null);
      }
    }
  }, [tasks, selectedTask]);

  const filteredTasks = internalTasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesSearchTerm = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setTaskFormMode('view');
  };

  const handleUpdateTaskInList = async (taskId: string, data: Partial<Task>) => {
    try {
      await onUpdateTask(taskId, data);
      setInternalTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...data } : t)));
      setSelectedTask((prevSel) => {
        if (prevSel && prevSel.id === taskId) {
          return { ...prevSel, ...data };
        }
        return prevSel;
      });
    } catch (err) {
      console.error('Could not update task in list:', err);
    }
  };

  const groupTasksByCategory = (tasks: Task[]): Record<string, Task[]> => {
    const map: Record<string, Task[]> = {};

    tasks.forEach((task) => {
      const category = task.category || 'Uncategorized';
      if (!map[category]) {
        map[category] = [];
      }
      map[category].push(task);
    });

    return map;
  };

  const groupedTasks = groupTasksByCategory(filteredTasks); // Group filtered tasks by category
  console.log(selectedTask);
  return (
    <div>
      <TaskContainer>
        {filteredTasks.length === 0 ? (
          <NoTask>No tasks found.</NoTask>
        ) : (
          <CategoriesRow>
            {Object.keys(groupedTasks).map((category) => (
              <CategoryColumn key={category}>
                <h4>{category}</h4>
                {groupedTasks[category].map((task) => (
                  <TaskSummary key={task.id} task={task} onClick={handleTaskClick} />
                ))}
              </CategoryColumn>
            ))}
          </CategoriesRow>
        )}

        <Modal isOpen={!!(showModal && selectedTask)} onClose={closeModal}>
          <TaskForm
            initialTask={selectedTask}
            onCancel={closeModal}
            onRequestEdit={() => setTaskFormMode('edit')}
            onSaveTask={(taskData) => {
              const taskInput: Partial<Task> = {
                ...taskData,
                dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : null,
                completedAt: taskData.completedAt ? Timestamp.fromDate(taskData.completedAt) : null,
              };

              if (selectedTask) {
                handleUpdateTaskInList(selectedTask.id, taskInput).then(() => {
                  setTaskFormMode('view');
                });
              }
            }}
            allianceMembers={allianceMembers}
            categories={categories}
            mode={taskFormMode}
            removeTask={async () => {
              if (selectedTask) {
                await removeTask(selectedTask.id);
              }
            }}
          />
        </Modal>
      </TaskContainer>
    </div>
  );
};

export default TaskList;
