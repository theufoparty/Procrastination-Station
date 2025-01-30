import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Task } from '../../../types/firestore';

const CalendarContainer = styled.div`
  font-family: 'Montserrat', serif;
  background: #fff;
  padding: 20px;
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  width: 100%;
  margin-bottom: 1em;
  @media (min-width: 768px) {
    min-width: 24em;
    max-width: 24em;
    height: 21em;
    margin-bottom: 0;
  }
`;

const CalendarHeader = styled.div`
  font-family: 'Montserrat', serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthSelector = styled.div`
  font-family: 'Montserrat', serif;
  display: flex;
  align-items: center;
  gap: 0.2em;

  button {
    border: none;
    background: none;
    font-size: 0.8em;
    cursor: pointer;
    color: #374e56;

    &:hover {
      color: #374e56;
    }
  }
`;

const DaysContainer = styled.div`
  font-family: 'Montserrat', serif;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: 600;
  color: #374e56;
  text-align: center;
`;

const DatesContainer = styled.div`
  margin-top: 0.6em;
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(7, 1fr);
  font-size: 0.5em;
`;

const DateBox = styled.div<{
  isCurrentMonth: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  hasTasks?: boolean;
}>`
  width: 30px;
  height: 30px;
  margin: 0.4em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${(props) =>
    !props.isCurrentMonth
      ? '#35328b'
      : props.isSelected
        ? '#9494bd'
        : props.isToday
          ? '#9494bd'
          : props.hasTasks
            ? '#d4d4f3'
            : '#f7f7f7'};

  color: ${(props) =>
    props.isToday || props.isSelected ? '#fff' : !props.isCurrentMonth ? '#ffffff' : '#000000'};

  cursor: ${(props) => (props.isCurrentMonth ? 'pointer' : 'default')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.isCurrentMonth && !props.isSelected && !props.isToday ? '#eeeeee' : ''};
  }
`;

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

const generateCalendarDays = (month: number, year: number) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayOfMonth = getFirstDayOfMonth(month, year);

  const prevMonthDays = new Date(year, month, 0).getDate();
  const leadingDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => prevMonthDays - firstDayOfMonth + i + 1
  );

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const trailingDays = Array.from(
    { length: 42 - leadingDays.length - currentMonthDays.length },
    (_, i) => i + 1
  );

  return [...leadingDays, ...currentMonthDays, ...trailingDays];
};

interface CalendarProps {
  tasks: Task[];
  onDateSelected?: (date: Date, tasksForDate: Task[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onDateSelected }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = useMemo(
    () => generateCalendarDays(currentMonth, currentYear),
    [currentMonth, currentYear]
  );

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const getTasksForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];

    const dateObj = new Date(currentYear, currentMonth, day);
    return tasks.filter((task) => {
      if (!task.dueDate) return false;

      const due = task.dueDate.toDate();

      return (
        due.getFullYear() === dateObj.getFullYear() &&
        due.getMonth() === dateObj.getMonth() &&
        due.getDate() === dateObj.getDate()
      );
    });
  };

  const hasTasksForDate = (day: number, isCurrentMonth: boolean) => {
    return getTasksForDate(day, isCurrentMonth).length > 0;
  };

  const handleDateClick = (date: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    setSelectedDate(date);
    const selectedDateObj = new Date(currentYear, currentMonth, date);

    const tasksForDay = getTasksForDate(date, true);

    if (onDateSelected) {
      onDateSelected(selectedDateObj, tasksForDay);
    }
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <h3>
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
          })}{' '}
          {currentYear}
        </h3>
        <MonthSelector>
          <button onClick={handlePreviousMonth}>&lt;</button>
          <button onClick={handleNextMonth}>&gt;</button>
        </MonthSelector>
      </CalendarHeader>
      <DaysContainer>
        {daysOfWeek.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </DaysContainer>
      <DatesContainer>
        {days.map((date, index) => {
          const isCurrentMonth =
            index >= getFirstDayOfMonth(currentMonth, currentYear) &&
            index <
              getFirstDayOfMonth(currentMonth, currentYear) +
                getDaysInMonth(currentMonth, currentYear);

          const isToday =
            isCurrentMonth &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear() &&
            date === today.getDate();

          return (
            <DateBox
              key={index}
              isCurrentMonth={isCurrentMonth}
              isSelected={isCurrentMonth && selectedDate === date}
              isToday={isToday}
              hasTasks={hasTasksForDate(date, isCurrentMonth)} // highlight if tasks exist
              onClick={() => handleDateClick(date, isCurrentMonth)}
            >
              {date}
            </DateBox>
          );
        })}
      </DatesContainer>
    </CalendarContainer>
  );
};

export default Calendar;
