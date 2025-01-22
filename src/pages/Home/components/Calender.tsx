import React, { useState } from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    border: none;
    background: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #333;

    &:hover {
      color: #000;
    }
  }
`;

const DaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  color: #000000;
  text-align: center;
`;

const DatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DateBox = styled.div<{
  isCurrentMonth: boolean;
  isSelected?: boolean;
  isToday?: boolean;
}>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0.4em;
  background-color: ${(props) =>
    props.isToday
      ? '#ff9500'
      : props.isSelected
        ? '#ff9500'
        : props.isCurrentMonth
          ? '#f7f7f7'
          : '#8d8d8d'};
  color: ${(props) =>
    props.isToday || props.isSelected ? '#ffffff' : props.isCurrentMonth ? '#333' : '#ffffff'};
  cursor: ${(props) => (props.isCurrentMonth ? 'pointer' : 'default')};
  transition: all 0.3s ease;

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

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = generateCalendarDays(currentMonth, currentYear);

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

  const handleDateClick = (date: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      setSelectedDate(date);
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
