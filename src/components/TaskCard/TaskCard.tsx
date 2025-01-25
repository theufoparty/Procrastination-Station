// components/TaskCard/TaskCard.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import { Task, SubTask } from '../../types/firestore';

import { parseSubTaskMap, getNextDueDate } from '../../utils/taskUtils';

import { useCountdown } from './useCountdown';
import TaskDetails from './TaskDetails';
import EditTaskForm from './EditTaskForm';

const TaskContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

interface AllianceMember {
  id: string;
  name: string;
  email?: string;
}

interface TaskCardProps extends Task {
  onUpdateTask?: (taskId: string, data: Partial<Task>) => Promise<void>;
  assignedUserIds?: string[];
  allianceMembers: AllianceMember[];
  categories: string[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  allianceId,
  name,
  description,
  priority,
  recurrence,
  dueDate,
  completedAt,
  createdAt,
  updatedAt,
  assignedUserIds,
  allianceMembers,
  categories,
  category,
  subTask,
  onUpdateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Flatten the subTasks from the map for display
  const [subTasksArray, setSubTasksArray] = useState<SubTask[]>([]);

  // Convert Firestore Timestamp -> JS Date for countdown
  const [nextDue, setNextDue] = useState<Date | null>(null);

  useEffect(() => {
    setSubTasksArray(parseSubTaskMap(subTask));
  }, [subTask]);

  useEffect(() => {
    if (dueDate) {
      setNextDue(dueDate.toDate());
    } else {
      setNextDue(null);
    }
  }, [dueDate]);

  // Custom hook for countdown
  const timeLeft = useCountdown(nextDue);

  // 1) Mark task completed
  const handleCompleted = async () => {
    if (!onUpdateTask) return;

    const now = new Date();
    let newDue: Date | null = null;
    if (recurrence && recurrence !== 'None') {
      newDue = getNextDueDate(now, recurrence);
    }

    await onUpdateTask(id, {
      completedAt: Timestamp.fromDate(now),
      dueDate: newDue ? Timestamp.fromDate(newDue) : null,
    });
  };

  // 2) Switch to edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 3) Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 4) Save edits
  const handleSaveEdit = async ({
    name: newName,
    description: newDescription,
    priority: newPriority,
    recurrence: newRecurrence,
    dueDate: newDueDate,
    assignedUserIds: newAssigned,
    category: newCategory,
    subTasks: newSubTasks,
  }: {
    name: string;
    description: string;
    priority: string;
    recurrence: string;
    dueDate: Date | null;
    assignedUserIds: string[];
    category: string;
    subTasks: SubTask[];
  }) => {
    if (!onUpdateTask) {
      setIsEditing(false);
      return;
    }

    try {
      // Convert array back into map if desired
      const newMap: Record<string, SubTask[]> = {
        defaultKey: newSubTasks,
      };

      await onUpdateTask(id, {
        name: newName,
        description: newDescription,
        priority: newPriority,
        recurrence: newRecurrence,
        assignedUserIds: newAssigned,
        category: newCategory !== 'None' ? newCategory : undefined,
        updatedAt: Timestamp.fromDate(new Date()),
        dueDate: newDueDate ? Timestamp.fromDate(newDueDate) : null,
        subTask: newMap,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving edits:', error);
    }
  };

  // Choose which UI to render
  return (
    <TaskContainer>
      {isEditing ? (
        <EditTaskForm
          name={name}
          description={description || ''}
          priority={priority || 'Low'}
          recurrence={recurrence || 'None'}
          dueDate={nextDue}
          assignedUserIds={assignedUserIds}
          allianceMembers={allianceMembers}
          categories={categories}
          category={category || ''}
          subTasks={subTasksArray}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      ) : (
        <TaskDetails
          allianceId={allianceId}
          name={name}
          description={description || ''}
          priority={priority || 'Low'}
          recurrence={recurrence || 'None'}
          dueDate={nextDue}
          completedAt={completedAt}
          createdAt={createdAt}
          updatedAt={updatedAt}
          subTasks={subTasksArray}
          assignedUserIds={assignedUserIds}
          allianceMembers={allianceMembers}
          category={category}
          timeLeft={timeLeft}
          onComplete={handleCompleted}
          onEdit={handleEdit}
        />
      )}
    </TaskContainer>
  );
};

export default TaskCard;
