import styled from 'styled-components';

const ActionButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding: 12px;
  border: none;
  font-size: 0.8em;
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
`;

interface LeaveAllianceButtonProps {
  onLeave: () => void;
  isLoggedIn: boolean;
}

const LeaveAllianceButton = ({ onLeave, isLoggedIn }: LeaveAllianceButtonProps) => {
  if (!isLoggedIn) {
    return null;
  }

  return <ActionButton onClick={onLeave}>Leave Alliance</ActionButton>;
};

export default LeaveAllianceButton;
