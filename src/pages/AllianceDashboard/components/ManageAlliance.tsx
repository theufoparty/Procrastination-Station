import styled, { keyframes } from 'styled-components';
import { AllianceLink } from './AllianceLink';
import AllianceMemberList from './AllianceMemberList';
import LeaveAllianceButton from './LeaveAllianceButton';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../utils/useAuth';
import { auth, db } from '../../../../firebaseConfig';
import { useAlliance } from '../../../utils/useAlliance';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const OuterContainer = styled.div`
  background-color: #fff;
  border-radius: 0;
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
  @media (min-width: 768px) {
    border-radius: 20px;
    width: 20em;
  }
`;

const Container = styled.div`
  background-color: #fff;
  border-radius: 0px;
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
  padding: 20px;
  @media (min-width: 768px) {
    border-radius: 20px;
  }
`;

export const ManageAlliance = () => {
  const { allianceId } = useParams<{ allianceId: string }>();
  const { user } = useAuth(auth, db);

  const { allianceMembers, leaveAlliance } = useAlliance(allianceId);
  return (
    <OuterContainer>
      <Container>
        <AllianceMemberList members={allianceMembers} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <LeaveAllianceButton onLeave={leaveAlliance} isLoggedIn={!!user} />
          <AllianceLink allianceId={allianceId} />
        </div>
      </Container>
    </OuterContainer>
  );
};
