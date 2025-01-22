import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Alliance } from '../../types/firestore';
import AllianceListDisplay from '../../components/AllianceListDisplay';

const AlliancesList: React.FC = () => {
  const [alliances, setAlliances] = useState<Alliance[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'alliances'), (snapshot) => {
      const allianceData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Alliance, 'id'>),
      }));
      setAlliances(allianceData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ margin: '2rem' }}>
      <AllianceListDisplay
        alliances={alliances}
        title='All Alliances'
        emptyMessage='No alliances found.'
      />
    </div>
  );
};

export default AlliancesList;
