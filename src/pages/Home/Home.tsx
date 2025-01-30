import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, onSnapshot, collection, query, where, documentId, getDocs } from 'firebase/firestore';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { Alliance, Task } from '../../types/firestore';
import { User } from '../../types/user';
import Calendar from './components/Calender';
import TaskSummary from '../../components/TaskCard/TaskSummary';
import WeatherCard from './components/WeatherCard';
import MotivationalQuotes from './components/MotivationalQuotes';
import TaskTimer from './components/Timer';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    margin: 20px;
    margin-top: 0;
    flex-direction: row;
    gap: 1em;
    justify-content: space-between;
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
    max-width: 20em;
    height: 21em;
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
  width: 14em;
  margin-bottom: 1em;
  cursor: pointer;
  width: 100%;
  @media (min-width: 768px) {
    max-width: 20em;
    height: 21em;
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

const StatTitle = styled.h4`
  margin-bottom: 0.5em;
  font-size: 1.2em;
  font-weight: 300;
`;

const StatValue = styled.p`
  font-size: 2em;
  margin: 0;
  margin-top: 3em;
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
  const { user } = useAuth(auth, db);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  const [greeting, setGreeting] = useState<string>('Hello');
  const tasksCompleted = 87;

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

  useEffect(() => {
    if (!user) {
      setAlliances([]);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, async (userSnap) => {
      if (!userSnap.exists()) {
        setAlliances([]);
        return;
      }

      const userData = userSnap.data() as User;
      const allianceIds = userData.allianceIds || [];

      if (allianceIds.length === 0) {
        setAlliances([]);
        return;
      }

      const sliceLimit = 10;
      const limitedAllianceIds = allianceIds.slice(0, sliceLimit);
      const alliancesRef = collection(db, 'alliances');
      const q = query(alliancesRef, where(documentId(), 'in', limitedAllianceIds));
      const alliancesSnap = await getDocs(q);
      const alliancesData = alliancesSnap.docs.map((allianceDoc) => ({
        id: allianceDoc.id,
        ...(allianceDoc.data() as Omit<Alliance, 'id'>),
      })) as Alliance[];

      setAlliances(alliancesData);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchTasksForAlliances = async () => {
      if (!alliances || alliances.length === 0) {
        setAllTasks([]);
        return;
      }

      const allianceIds = alliances.map((a) => a.id);
      const limitIds = allianceIds.slice(0, 10);
      const tasksRef = collection(db, 'tasks');
      const qTasks = query(tasksRef, where('allianceId', 'in', limitIds));
      const tasksSnap = await getDocs(qTasks);

      const tasksData = tasksSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      })) as Task[];

      setAllTasks((previousTasks) => [...previousTasks, ...tasksData]);
    };

    fetchTasksForAlliances();
  }, [alliances]);

  const handleDateSelected = (_date: Date, tasksForDate: Task[]) => {
    setSelectedDateTasks(tasksForDate);
  };

  console.log(allTasks);

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
        <StatBox>
          <StatTitle>Tasks Completed</StatTitle>
          <StatValue>
            {allTasks?.length ? 0 : allTasks.filter((task) => !!task.completedAt).length}
          </StatValue>
        </StatBox>
        <StatBox>
          <TaskTimer />
        </StatBox>
      </StatsContainer>
    </>
  );
};

export default Dashboard;
