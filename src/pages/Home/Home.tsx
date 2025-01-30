import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { Task } from '../../types/firestore';
import Calendar from './components/Calender';
import TaskSummary from '../../components/TaskSummary';
import WeatherCard from './components/WeatherCard';
import MotivationalQuotes from './components/MotivationalQuotes';
import TaskTimer from './components/Timer';
import { useAlliance } from '../../utils/useAlliance';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    margin: 20px;
    margin-top: 0;
    flex-direction: row;
    gap: 1em;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Greeting = styled.h2`
  font-family: 'Montserrat', serif;
  background-color: #fff;
  cursor: pointer;
  font-weight: 600;

  @media (min-width: 768px) {
  }
`;

const TodaysTaskBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #e7e7e7;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1em;
  @media (min-width: 768px) {
    max-width: 18em;
    height: 20em;
    margin-bottom: 0;
  }
`;

const StatBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  border: 1px solid #e7e7e7;
  position: relative;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  width: 100%;
  margin-bottom: 1em;
  cursor: pointer;
  width: 100%;
  @media (min-width: 768px) {
    height: 9.5em;
    width: 19em;
    margin-bottom: 0;
  }
`;

const GreetingBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #e7e7e7;
  border-radius: 20px;
  padding: 20px;
  background-color: #fff;
  width: 100%;
  margin-bottom: 1em;
  justify-content: space-between;
  @media (min-width: 768px) {
    width: 59%;
    margin-bottom: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1em;
`;

const StatTitle = styled.h4`
  margin-bottom: 0.5em;
  font-size: 0.7em;
  font-weight: 300;
`;

const StatValue = styled.p`
  font-size: 2em;
  margin: 0;
  margin-top: 1em;
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  margin: 0;

  @media (min-width: 768px) {
    margin: 20px;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Dashboard: FC = () => {
  const { user, userTasks } = useAuth(auth, db);
  const { allianceTasks } = useAlliance(user?.allianceIds?.[0]);

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);

  const handleDateSelected = (_date: Date, tasksForDate: Task[]) => {
    setSelectedDateTasks(tasksForDate);
  };
  useEffect(() => {
    const tasks = [...userTasks, ...allianceTasks];
    setAllTasks(tasks);
    const today = new Date();
    const tasksForToday = tasks.filter((task) => {
      if (!task.dueDate) return false;

      const due = task.dueDate.toDate();

      return (
        due.getFullYear() === today.getFullYear() &&
        due.getMonth() === today.getMonth() &&
        due.getDate() === today.getDate()
      );
    });
    setSelectedDateTasks(tasksForToday);
  }, [allianceTasks, userTasks]);

  const [greeting, setGreeting] = useState<string>('Hello');

  const determineGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good day';
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  useEffect(() => {
    setGreeting(determineGreeting());

    const now = new Date();
    const millisUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

    const timeoutId = setTimeout(() => {
      setGreeting(determineGreeting());

      const intervalId = setInterval(
        () => {
          setGreeting(determineGreeting());
        },
        60 * 60 * 1000
      );

      return () => clearInterval(intervalId);
    }, millisUntilNextHour);

    return () => clearTimeout(timeoutId);
  }, []);

  const completedTasks = allTasks.filter((task) => task.completedAt).length;

  return (
    <>
      <WelcomeContainer>
        <GreetingBox>
          <Greeting>
            {greeting}, {user?.displayName || user?.email}
          </Greeting>
          <MotivationalQuotes />
        </GreetingBox>
        <WeatherCard />
      </WelcomeContainer>

      <StatsContainer>
        <Calendar tasks={allTasks} onDateSelected={handleDateSelected} />
        <TodaysTaskBox>
          {selectedDateTasks.length === 0 ? (
            <p style={{ margin: 0 }}>No tasks for this date</p>
          ) : (
            <>
              {selectedDateTasks.map((task) => (
                <TaskSummary
                  key={task.id}
                  task={task}
                  onClick={function (): void {
                    throw new Error('Function not implemented.');
                  }}
                />
              ))}
            </>
          )}
        </TodaysTaskBox>
        <Container>
          <StatBox>
            <StatTitle>Tasks Completed</StatTitle>
            <StatValue>{completedTasks}</StatValue>
          </StatBox>
          <StatBox>
            <TaskTimer />
          </StatBox>
        </Container>
      </StatsContainer>
    </>
  );
};

export default Dashboard;
