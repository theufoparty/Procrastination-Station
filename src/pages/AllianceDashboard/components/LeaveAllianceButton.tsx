interface LeaveAllianceButtonProps {
  onLeave: () => void;
  canLeave: boolean;
  isLoggedIn: boolean;
}

const LeaveAllianceButton = ({ onLeave, canLeave, isLoggedIn }: LeaveAllianceButtonProps) => {
  if (!isLoggedIn) {
    return null;
  }

  if (!canLeave) {
    return null;
  }

  return (
    <button onClick={onLeave} style={{ marginBottom: '1rem' }}>
      Leave Alliance
    </button>
  );
};

export default LeaveAllianceButton;
