import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlliance } from '../../utils/useAlliance';

export function JoinAlliancePage() {
  const { allianceId } = useParams();
  const { joinAlliance } = useAlliance(allianceId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!allianceId) return;

    joinAlliance()
      .then(() => {
        navigate(`/alliance/${allianceId}`);
      })
      .catch((error) => {
        console.error('Failed to join alliance:', error);
      });
  }, [allianceId, joinAlliance, navigate]);

  return <div>Joining alliance...</div>;
}
