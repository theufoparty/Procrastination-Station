import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import { Task } from '../types/firestore';

const TaskContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const TaskTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const TaskDetail = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Button = styled.button`
  padding: 0.5rem 1em;
  background-color: #3c64e7;
  border: none;
  border-radius: 0.5em;
  color: #ecf0f1;
  cursor: pointer;
  font-size: 1em;
  width: 30%;
  align-self: center;
  margin-top: 3em;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #9bb2ff;
  }
`;

function formatDaysHoursMinutes(ms: number): string {
  if (ms <= 0) return '0d 0h 0m';

  let totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  totalMinutes %= 1440;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m`;
}

function getNextDueDate(currentDate: Date, recurrence: string): Date {
  const newDueDate = new Date(currentDate);
  switch (recurrence) {
    case 'Daily':
      newDueDate.setDate(newDueDate.getDate() + 1);
      break;
    case 'Weekly':
      newDueDate.setDate(newDueDate.getDate() + 7);
      break;
    case 'Monthly':
      newDueDate.setMonth(newDueDate.getMonth() + 1);
      break;
    default:
      break;
  }
  return newDueDate;
}

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
  onUpdateTask,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [nextDue, setNextDue] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || '');
  const [editPriority, setEditPriority] = useState(priority || 'Low');
  const [editRecurrence, setEditRecurrence] = useState(recurrence || 'None');
  const [editDueDate, setEditDueDate] = useState('');
  const [editAssignedIds, setEditAssignedIds] = useState<string[]>(assignedUserIds || []);
  const [editCategory, setEditCategory] = useState<string>(recurrence || 'None');

  const effectiveRecurrence = isEditing ? editRecurrence : recurrence;

  useEffect(() => {
    if (dueDate) {
      const jsDate = dueDate.toDate();
      setNextDue(jsDate);
      setEditDueDate(jsDate.toISOString().slice(0, 16));
    } else {
      setNextDue(null);
      setEditDueDate('');
    }
  }, [dueDate]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (nextDue) {
      timerId = setInterval(() => {
        const now = Date.now();
        const distance = nextDue.getTime() - now;
        if (distance <= 0) {
          setTimeLeft('Task is overdue!');
          clearInterval(timerId!);
        } else {
          setTimeLeft(formatDaysHoursMinutes(distance));
        }
      }, 60_000);

      const initialDistance = nextDue.getTime() - Date.now();
      setTimeLeft(
        initialDistance <= 0 ? 'Task is overdue!' : formatDaysHoursMinutes(initialDistance)
      );
    } else {
      setTimeLeft('');
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [nextDue]);

  const handleCompleted = async () => {
    if (!onUpdateTask) return;
    const now = new Date();

    let newDue: Date | null = null;
    if (effectiveRecurrence && effectiveRecurrence !== 'None') {
      newDue = getNextDueDate(now, effectiveRecurrence);
    }

    await onUpdateTask(id, {
      completedAt: Timestamp.fromDate(now),
      dueDate: newDue ? Timestamp.fromDate(newDue) : null,
    });
  };

  const parseDueDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  const handleEdit = () => {
    setEditName(name);
    setEditDescription(description || '');
    setEditPriority(priority || 'Low');
    setEditRecurrence(recurrence || 'None');
    setEditAssignedIds(assignedUserIds || []);
    setEditCategory(category || 'None');

    if (dueDate) {
      setEditDueDate(dueDate.toDate().toISOString().slice(0, 16));
    } else {
      setEditDueDate('');
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!onUpdateTask) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedTaskData: Partial<Task> = {
        name: editName,
        description: editDescription,
        priority: editPriority,
        recurrence: editRecurrence,
        assignedUserIds: editAssignedIds,
        updatedAt: Timestamp.fromDate(new Date()),
        category: editCategory !== 'None' ? editCategory : undefined,
      };

      const parsedDate = parseDueDate(editDueDate);
      if (parsedDate) {
        updatedTaskData.dueDate = Timestamp.fromDate(parsedDate);
      } else {
        updatedTaskData.dueDate = null;
      }

      await onUpdateTask(id, updatedTaskData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving edits:', err);
    }
  };

  if (isEditing) {
    return (
      <TaskContainer>
        <TaskDetail>
          <strong>Name:</strong>
          <br />
          <input
            type='text'
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ width: '100%' }}
            required
          />
        </TaskDetail>

        <TaskDetail>
          <strong>Description:</strong>
          <br />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            style={{ width: '100%' }}
          />
        </TaskDetail>

        <TaskDetail>
          <strong>Priority:</strong>
          <br />
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </TaskDetail>

        <TaskDetail>
          <strong>Recurrence:</strong>
          <br />
          <select value={editRecurrence} onChange={(e) => setEditRecurrence(e.target.value)}>
            <option>None</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </TaskDetail>

        <TaskDetail>
          <strong>Due Date:</strong>
          <br />
          <input
            type='datetime-local'
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />
        </TaskDetail>

        <TaskDetail>
          <strong>Assign Users:</strong>
          <br />
          <select
            multiple
            style={{ width: '100%', height: '100px' }}
            value={editAssignedIds}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
              setEditAssignedIds(selected);
            }}
          >
            {allianceMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </TaskDetail>

        <TaskDetail>
          <strong>Category:</strong>
          <br />
          <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
            <option>None</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </TaskDetail>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleSaveEdit}>Save</button>{' '}
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      </TaskContainer>
    );
  }

  const assignedUsersDisplay =
    assignedUserIds && assignedUserIds.length > 0
      ? assignedUserIds
          .map((uid) => {
            const found = allianceMembers.find((m) => m.id === uid);
            return found ? found.name : uid;
          })
          .join(', ')
      : 'No one assigned';

  const categoryDisplay = category || 'Uncategorized';
  return (
    <TaskContainer>
      <TaskTitle>{name}</TaskTitle>

      <TaskDetail>
        <strong>Account ID:</strong> {allianceId}
      </TaskDetail>

      <TaskDetail>
        <strong>Description:</strong> {description}
      </TaskDetail>

      <TaskDetail>
        <strong>Priority:</strong> {priority}
      </TaskDetail>

      <TaskDetail>
        <strong>Recurrence:</strong> {recurrence || 'None'}
      </TaskDetail>

      <TaskDetail>
        <strong>Due Date:</strong> {nextDue ? nextDue.toLocaleString() : 'No due date'}
      </TaskDetail>

      <TaskDetail>
        <strong>Completed At:</strong>{' '}
        {completedAt ? new Date(completedAt.toDate()).toLocaleString() : 'Not completed yet'}
      </TaskDetail>

      <TaskDetail>
        <strong>Created At:</strong>{' '}
        {createdAt ? new Date(createdAt.toDate()).toLocaleString() : 'Unknown'}
      </TaskDetail>

      <TaskDetail>
        <strong>Updated At:</strong>{' '}
        {updatedAt ? new Date(updatedAt.toDate()).toLocaleString() : 'Never updated'}
      </TaskDetail>

      {nextDue && (
        <TaskDetail>
          <strong>Time left:</strong> {timeLeft || 'Calculating...'}
        </TaskDetail>
      )}

      <TaskDetail>
        <strong>Category:</strong> {categoryDisplay}
      </TaskDetail>

      <TaskDetail>
        <strong>Assigned Users:</strong> {assignedUsersDisplay}
      </TaskDetail>

      <TaskDetail>
        <Button onClick={handleCompleted}>Completed</Button>{' '}
        <Button onClick={handleEdit}>Edit</Button>
      </TaskDetail>
    </TaskContainer>
  );
};

export default TaskCard;
