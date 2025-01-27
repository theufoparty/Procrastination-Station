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

const StatsContainer = styled.div`
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 4em;
  margin-bottom: 2em;
  align-items: center;
  justify-content: center;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 20px;
  }
`;

const Greeting = styled.h2`
  padding: 20px;
  background-color: #fff;
  cursor: pointer;
  margin: 20px;

  @media (min-width: 768px) {
    margin-top: 1em;
  }
`;

const TodaysTaskBox = styled.div`
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  margin: 20px;
`;

const StatBox = styled.div`
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  width: 20em;
  height: 12em;
  cursor: pointer;
  margin: 20px;
`;

const StatTitle = styled.h4`
  margin-bottom: 0.5em;
  font-size: 1.2em;
  font-weight: 100;
`;

const StatValue = styled.p`
  font-size: 2em;
  margin: 0;
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  margin: 20px;

  @media (min-width: 768px) {
    margin-top: 1em;
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

        <StatBox>
          <AllianceListDisplay
            alliances={alliances}
            title='My Alliances'
            emptyMessage='You are not part of any alliances yet.'
          />
        </StatBox>
      </StatsContainer>
    </>
  );
};

export default Dashboard;
