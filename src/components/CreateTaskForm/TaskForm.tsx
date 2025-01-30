// TaskForm.tsx
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
  /** The mode controls how the form behaves/appears */
  mode: TaskFormMode;
  /** Optional existing task data when editing or viewing */
  initialTask?: Task | null;
  /** Called when the user saves/creates/updates the task */
  onSaveTask: (data: TaskInput) => void;
  /** Alliance members, used for the user assignments */
  allianceMembers: AllianceMember[];
  /** Categories for the category buttons */
  categories: string[];
  /** Called when user closes the form */
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
  // Local state for the fields
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('Low');
  const [taskRecurrence, setTaskRecurrence] = useState('None');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [taskCategory, setTaskCategory] = useState('None');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);

  // We can re-use the same options from your original code
  const priorityOptions = ['Low', 'Medium', 'High'];
  const recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly'];

  /** On mount (and when initialTask changes), prefill state if in edit/view mode */
  useEffect(() => {
    if (initialTask && (mode === 'edit' || mode === 'view')) {
      // Parse out date/time from existing dueDate
      let dateString = '';
      let timeString = '';
      if (initialTask.dueDate) {
        const due = new Date(initialTask.dueDate.toDate());
        dateString = due.toISOString().slice(0, 10); // e.g. "2025-01-29"
        timeString = due.toTimeString().slice(0, 5); // e.g. "13:30"
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
    // If mode is 'create', everything stays at initial blank state
  }, [initialTask, mode]);

  /** Handle Form Submit (for create/edit). Not called in 'view' mode. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the finalDueDate from date + time
    let finalDueDate: Date | null = null;
    if (taskDate) {
      finalDueDate = new Date(taskDate);
      if (taskTime) {
        const [hours, minutes] = taskTime.split(':').map(Number);
        finalDueDate.setHours(hours || 0, minutes || 0, 0, 0);
      }
    }

    // Build the task object to pass back
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

    // Optionally reset state if we are in "create" mode
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

  // 1) Mark task completed
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

  // For convenience, a single readOnly boolean to pass down to sub-components
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
            {mode === 'view' && 'View Task'}
          </Title>

          {/* Task Name */}
          <TaskNameInput taskName={taskName} setTaskName={setTaskName} readOnly={readOnly} />

          {/* Task Date */}
          <TaskDateInput taskDate={taskDate} setTaskDate={setTaskDate} readOnly={readOnly} />
        </DarkHeader>

        <FormContainer>
          {/* Task Time */}
          <TaskTimeInput taskTime={taskTime} setTaskTime={setTaskTime} readOnly={readOnly} />

          {/* Task Description */}
          <TaskDescriptionInput
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            readOnly={readOnly}
          />

          {/* Subtasks */}
          <SubTasksInput
            taskId={initialTask?.id}
            subTasks={subTasks}
            setSubTasks={setSubTasks}
            readOnly={readOnly}
          />

          {/* Priority Selector */}
          <PrioritySelector
            priorityOptions={priorityOptions}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            readOnly={readOnly}
          />

          {/* Recurrence Selector */}
          <RecurrenceSelector
            recurrenceOptions={recurrenceOptions}
            taskRecurrence={taskRecurrence}
            setTaskRecurrence={setTaskRecurrence}
            readOnly={readOnly}
          />

          {/* Assign Users */}
          <AssignedUsersSelect
            allianceMembers={allianceMembers}
            assignedIds={assignedIds}
            setAssignedIds={setAssignedIds}
            readOnly={readOnly}
          />

          {/* Category Selector */}
          <CategorySelector
            categories={categories}
            taskCategory={taskCategory}
            setTaskCategory={setTaskCategory}
            readOnly={readOnly}
          />

          <ButtonContainer>
            {/* If in create mode => "Create Task" button */}
            {mode === 'create' && <SubmitButton type='submit'>Create Task</SubmitButton>}

            {/* If in edit mode => "Update Task" button */}
            {mode === 'edit' && <SubmitButton type='submit'>Update Task</SubmitButton>}

            {/* If in view mode => "Edit Task" button (calls onRequestEdit) */}
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
