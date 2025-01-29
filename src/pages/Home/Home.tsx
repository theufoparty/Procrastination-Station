import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, onSnapshot, collection, query, where, documentId, getDocs } from 'firebase/firestore';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { Alliance, Task } from '../../types/firestore';
import { User } from '../../types/user';
import AllianceListDisplay from '../../components/AllianceListDisplay';
import Calendar from './components/Calender';
import TaskSummary from '../../components/TaskCard/TaskSummary';
import WeatherCard from './components/WeatherCard';
import RecentActivityFeed from './components/RecentActivity';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
  gap: 20px;
  margin-bottom: 2em;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    margin: 20px;
    margin-top: 0;
    flex-direction: row;
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
  justify-content: center;
  border: 1px solid #e7e7e7;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  width: 100%;
  @media (min-width: 768px) {
    min-width: 20em;
    max-width: 20em;
    height: 21em;
  }
`;

const StatBox = styled.div`
  border: 1px solid #e7e7e7;
  position: relative;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  width: 14em;
  height: 12em;
  cursor: pointer;
  width: 100%;
  @media (min-width: 768px) {
    min-width: 20em;
    max-width: 20em;
    height: 21em;
  }
`;

const AllianceBox = styled.div`
  border: 1px solid #e7e7e7;
  position: relative;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  width: 14em;
  height: 12em;
  cursor: pointer;
  width: 100%;
  @media (min-width: 768px) {
    min-width: 25em;
    max-width: 20em;
    height: 21em;
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
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid #e7e7e7;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  margin: 0;

  @media (min-width: 768px) {
    margin: 20px;
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

      // Firestore 'in' query limit of 10
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

      setAllTasks(tasksData);
    };

    fetchTasksForAlliances();
  }, [alliances]);

  const handleDateSelected = (_date: Date, tasksForDate: Task[]) => {
    setSelectedDateTasks(tasksForDate);
  };

  return (
    <>
      <WelcomeContainer>
        <Greeting>
          {greeting}, {user?.displayName || user?.email}
        </Greeting>
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
          <StatValue>{tasksCompleted}</StatValue>
        </StatBox>
        <AllianceBox>
          <AllianceListDisplay
            alliances={alliances}
            title='My Alliances'
            emptyMessage='You are not part of any alliances yet.'
          />
        </AllianceBox>
        <RecentActivityFeed />
      </StatsContainer>
    </>
  );
};

export default Dashboard;
