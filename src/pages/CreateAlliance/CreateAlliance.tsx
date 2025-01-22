import React, { useState } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const CreateAlliance: React.FC = () => {
  const { user } = useAuth(auth, db);
  const [allianceName, setAllianceName] = useState('');
  const navigate = useNavigate();

  const handleCreateAlliance = async () => {
    if (!user) {
      alert('Please log in to create an alliance.');
      return;
    }

    try {
      // 1. Create the alliance document
      const docRef = await addDoc(collection(db, 'alliances'), {
        name: allianceName,
        userIds: [user.uid],
        createdAt: serverTimestamp(),
      });

      // 2. Update the user's allianceIds
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        allianceIds: arrayUnion(docRef.id),
      });

      // 3. Navigate to the newly created alliance page
      navigate(`/alliance/${docRef.id}`);

      setAllianceName('');
    } catch (error) {
      console.error('Error creating alliance: ', error);
      alert('Error creating alliance');
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Create New Alliance</h2>
      <input
        type='text'
        value={allianceName}
        onChange={(e) => setAllianceName(e.target.value)}
        placeholder='Alliance Name'
      />
      <button onClick={handleCreateAlliance}>Create Alliance</button>
    </div>
  );
};

export default CreateAlliance;
