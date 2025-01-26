import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task } from '../types/firestore';
import TaskSummary from './TaskSummary';
import SimpleModal from './SimpleModal';
import TaskCard from './TaskCard/TaskCard';

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
}

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  allianceMembers,
  categories,
}) => {
  const [internalTasks, setInternalTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setInternalTasks(tasks);
  }, [tasks]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
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

  /** Group Tasks by Category */
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

  const groupedTasks = groupTasksByCategory(internalTasks);

  return (
    <div>
      <h3>Tasks</h3>
      <TaskContainer>
        {internalTasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          Object.keys(groupedTasks).map((category) => (
            <div key={category} style={{ marginBottom: '2rem' }}>
              <h4>{category}</h4>
              {groupedTasks[category].map((task) => (
                <TaskSummary key={task.id} task={task} onClick={handleTaskClick} />
              ))}
            </div>
          ))
        )}

        {showModal && selectedTask && (
          <SimpleModal onClose={closeModal}>
            <TaskCard
              id={selectedTask.id}
              allianceId={selectedTask.allianceId}
              name={selectedTask.name}
              description={selectedTask.description}
              priority={selectedTask.priority}
              recurrence={selectedTask.recurrence}
              dueDate={selectedTask.dueDate}
              completedAt={selectedTask.completedAt}
              createdAt={selectedTask.createdAt}
              updatedAt={selectedTask.updatedAt}
              subTask={selectedTask.subTask}
              assignedUserIds={selectedTask.assignedUserIds}
              category={selectedTask.category || 'Uncategorized'}
              onUpdateTask={handleUpdateTaskInList}
              allianceMembers={allianceMembers}
              categories={categories}
              onClose={closeModal}
            />
          </SimpleModal>
        )}
      </TaskContainer>
    </div>
  );
};

export default TaskList;
