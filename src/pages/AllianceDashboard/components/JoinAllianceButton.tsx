interface JoinAllianceButtonProps {
  onJoin: () => void;
  canJoin: boolean;
  isLoggedIn: boolean;
}

const JoinAllianceButton = ({ onJoin, canJoin, isLoggedIn }: JoinAllianceButtonProps) => {
  if (!isLoggedIn || !canJoin) {
    return null;
  }

  return (
    <button onClick={onJoin} style={{ marginBottom: '1rem' }}>
      Join Alliance
    </button>
  );
};

export default JoinAllianceButton;
