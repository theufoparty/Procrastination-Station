import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, onSnapshot, collection, query, where, documentId, getDocs } from 'firebase/firestore';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { Alliance } from '../../types/firestore';
import AllianceListDisplay from '../../components/AllianceListDisplay';
import { User } from '../../types/user';
import Calendar from './components/Calender';

const AllianceContainer = styled.div``;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

const TodaysTaskBox = styled.div`
  position: relative;
  border: 1px solid #e6e8ec;
  border-radius: 1em;
  padding: 1em;
  text-align: center;
  background: linear-gradient(135deg, #2c2d32, #000000);
  color: #ffffff;
  width: 12em;
  height: 12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M0,50 C50,100 150,0 200,50 L200,100 L0,100 Z" fill="%23ffffff" opacity="0.06"/></svg>')
      no-repeat center;
    background-size: cover;
    pointer-events: none;
    z-index: 1;
    transform: rotate(180deg);
    transform-origin: center;
  }

  &::after {
    content: '';
    top: 0;
    position: absolute;
    left: 0;
    width: 100%;
    height: 60%;
    transform: rotate(180deg);
    transform-origin: center;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M0,50 C50,100 150,0 200,50 L200,100 L0,100 Z" fill="%23ffffff" opacity="0.09"/></svg>')
      no-repeat center;
    background-size: cover;
    pointer-events: none;
    z-index: 2;
  }
`;

const StatBox = styled.div`
  position: relative;
  border: 1px solid #e6e8ec;
  border-radius: 1em;
  padding: 1em;
  text-align: center;
  background: linear-gradient(135deg, #6e8efb, #3b53db);
  color: #ffffff;
  width: 12em;
  height: 12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M0,50 C50,100 150,0 200,50 L200,100 L0,100 Z" fill="%23ffffff" opacity="0.2"/></svg>')
      no-repeat center;
    background-size: cover;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><path d="M0,50 C50,100 150,0 200,50 L200,100 L0,100 Z" fill="%23ffffff" opacity="0.2"/></svg>')
      no-repeat center;
    background-size: cover;
    pointer-events: none;
    z-index: 2;
  }
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

const Dashboard: FC = () => {
  const { user } = useAuth(auth, db);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const tasksCompleted = 87;

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

      // Firestore 'in' query limit
      const sliceLimit = 10;
      const limitedAllianceIds = allianceIds.slice(0, sliceLimit);

      // Fetch alliances
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

  return (
    <>
      <StatsContainer>
        <Calendar />
        <StatBox>
          <StatTitle>Tasks Completed</StatTitle>
          <StatValue>{tasksCompleted}</StatValue>
        </StatBox>
        <TodaysTaskBox>Todays Tasks</TodaysTaskBox>
      </StatsContainer>
      <AllianceContainer>
        <AllianceListDisplay
          alliances={alliances}
          title='My Alliances'
          emptyMessage='You are not part of any alliances yet.'
        />
      </AllianceContainer>
    </>
  );
};

export default Dashboard;
