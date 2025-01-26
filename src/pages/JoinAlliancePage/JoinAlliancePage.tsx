import { Dispatch, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { joinAlliance } from '../../utils/joinAlliance';

export function JoinAlliancePage({
  setRedirectAllianceId,
}: {
  setRedirectAllianceId?: Dispatch<string>;
}) {
  const { allianceId } = useParams();
  const { user } = useAuth(auth, db);
  const navigate = useNavigate();

  useEffect(() => {
    if (!allianceId) return;

    if (!user && setRedirectAllianceId) {
      setRedirectAllianceId(allianceId);
      navigate('/login');
      return;
    }
    joinAlliance({
      userId: user?.uid || '',
      allianceId,
    })
      .then(() => {
        navigate(`/alliance/${allianceId}`);
      })
      .catch((error) => {
        console.error('Failed to join alliance:', error);
      });
  }, [allianceId, navigate, setRedirectAllianceId, user]);

  return <div>Joining alliance...</div>;
}
