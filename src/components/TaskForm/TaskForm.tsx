import React, { useEffect, useState } from 'react';
import {
  OuterContainer,
  Form,
  DarkHeader,
  CloseButton,
  Title,
  FormContainer,
  ButtonContainer,
  SubmitButton,
} from './styled';
import { SubTask, Task } from '../../types/firestore';

import TaskNameInput from './TaskNameInput';
import TaskDateInput from './TaskDateInput';
import TaskTimeInput from './TaskTimeInput';
import TaskDescriptionInput from './TaskDescriptionInput';
import SubTasksInput from './SubTasksInput';
import PrioritySelector from './PrioritySelector';
import RecurrenceSelector from './RecurrenceSelector';
import AssignedUsersSelect from './AssignedUsersSelect';
import CategorySelector from './CategorySelector';
import { getNextDueDate } from '../../utils/taskUtils';

type TaskInput = {
  name: string;
  description?: string;
  priority?: string;
  recurrence?: string;
  dueDate?: Date | null;
  assignedUserIds?: string[];
  category?: string;
  completedAt?: Date;
  subTask?: {
    defaultKey: SubTask[];
  };
};

interface AllianceMember {
  id: string;
  name: string;
  email?: string;
}

type TaskFormMode = 'create' | 'edit' | 'view';

interface TaskFormProps {
  mode: TaskFormMode;

  initialTask?: Task | null;

  onSaveTask: (data: TaskInput) => void;

  allianceMembers: AllianceMember[];

  categories: string[];

  onCancel: () => void;
  onRequestEdit: () => void;
  removeTask: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  mode,
  initialTask,
  onSaveTask,
  onRequestEdit,
  onCancel,
  allianceMembers,
  categories,
  removeTask,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('Low');
  const [taskRecurrence, setTaskRecurrence] = useState('None');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [taskCategory, setTaskCategory] = useState('None');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const priorityOptions = ['Low', 'Medium', 'High'];
  const recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly'];

  useEffect(() => {
    if (initialTask && (mode === 'edit' || mode === 'view')) {
      let dateString = '';
      let timeString = '';
      if (initialTask.dueDate) {
        const due = new Date(initialTask.dueDate.toDate());
        dateString = due.toISOString().slice(0, 10);
        timeString = due.toTimeString().slice(0, 5);
      }

      setTaskName(initialTask.name || '');
      setTaskDescription(initialTask.description || '');
      setTaskPriority(initialTask.priority || 'Low');
      setTaskRecurrence(initialTask.recurrence || 'None');
      setTaskDate(dateString);
      setTaskTime(timeString);
      setAssignedIds(initialTask.assignedUserIds || []);
      setTaskCategory(initialTask.category || 'None');
      setSubTasks(initialTask.subTask?.['defaultKey'] || []);
    }
  }, [initialTask, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalDueDate: Date | null = null;
    if (taskDate) {
      finalDueDate = new Date(taskDate);
      if (taskTime) {
        const [hours, minutes] = taskTime.split(':').map(Number);
        finalDueDate.setHours(hours || 0, minutes || 0, 0, 0);
      }
    }
    const taskPayload: TaskInput = {
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      recurrence: taskRecurrence,
      dueDate: finalDueDate,
      assignedUserIds: assignedIds,
      ...(taskCategory !== 'None' ? { category: taskCategory } : {}),
      subTask: {
        defaultKey: subTasks,
      },
    };

    onSaveTask(taskPayload);

    if (mode === 'create') {
      setTaskName('');
      setTaskDescription('');
      setTaskPriority('Low');
      setTaskRecurrence('None');
      setTaskDate('');
      setTaskTime('');
      setAssignedIds([]);
      setTaskCategory('None');
      setSubTasks([]);
    }
  };

  const handleCompleted = async () => {
    if (!onSaveTask) return;

    const now = new Date();
    let newDue: Date | null = null;
    if (taskRecurrence && taskRecurrence !== 'None') {
      newDue = getNextDueDate(now, taskRecurrence);
    }

    if (initialTask?.name) {
      await onSaveTask({
        ...initialTask,
        completedAt: now,
        dueDate: newDue || null,
      });
    }
  };

  const handleRemove = async () => {
    try {
      if (initialTask?.id) {
        await removeTask();
      }
      onCancel();
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const readOnly = mode === 'view';

  return (
    <OuterContainer>
      <Form onSubmit={handleSubmit}>
        <DarkHeader>
          <CloseButton type='button' onClick={onCancel}>
            &#x2190;
          </CloseButton>

          <Title>
            {mode === 'create' && 'Create New Task'}
            {mode === 'edit' && 'Edit Task'}
            {mode === 'view' && 'Task Details'}
          </Title>

          <TaskNameInput taskName={taskName} setTaskName={setTaskName} readOnly={readOnly} />

          <TaskDateInput taskDate={taskDate} setTaskDate={setTaskDate} readOnly={readOnly} />
        </DarkHeader>

        <FormContainer>
          <TaskTimeInput taskTime={taskTime} setTaskTime={setTaskTime} readOnly={readOnly} />

          <TaskDescriptionInput
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            readOnly={readOnly}
          />

          <SubTasksInput
            taskId={initialTask?.id}
            subTasks={subTasks}
            setSubTasks={setSubTasks}
            readOnly={readOnly}
          />

          <PrioritySelector
            priorityOptions={priorityOptions}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            readOnly={readOnly}
          />

          <RecurrenceSelector
            recurrenceOptions={recurrenceOptions}
            taskRecurrence={taskRecurrence}
            setTaskRecurrence={setTaskRecurrence}
            readOnly={readOnly}
          />

          <AssignedUsersSelect
            allianceMembers={allianceMembers}
            assignedIds={assignedIds}
            setAssignedIds={setAssignedIds}
            readOnly={readOnly}
          />

          <CategorySelector
            categories={categories}
            taskCategory={taskCategory}
            setTaskCategory={setTaskCategory}
            readOnly={readOnly}
          />

          <ButtonContainer>
            {mode === 'create' && <SubmitButton type='submit'>Create Task</SubmitButton>}

            {mode === 'edit' && <SubmitButton type='submit'>Update Task</SubmitButton>}

            {mode === 'view' && (
              <>
                <SubmitButton type='button' onClick={handleCompleted}>
                  Finished
                </SubmitButton>
                <SubmitButton type='button' onClick={handleRemove}>
                  Remove Task
                </SubmitButton>
                {onRequestEdit && (
                  <SubmitButton type='button' onClick={onRequestEdit}>
                    Edit Task
                  </SubmitButton>
                )}
              </>
            )}
          </ButtonContainer>
        </FormContainer>
      </Form>
    </OuterContainer>
  );
};

export default TaskForm;
