import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../utils/useAuth';
import { auth, db } from '../../../firebaseConfig';

const CreateAlliance: React.FC = () => {
  const { user } = useAuth(auth, db);
  const [allianceName, setAllianceName] = useState('');

  const handleCreateAlliance = async () => {
    if (!user) {
      alert('Please log in to create an alliance.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'alliances'), {
        name: allianceName,
        userIds: [user.uid],
        createdAt: serverTimestamp(),
      });

      console.log('Alliance created with ID: ', docRef.id);
      setAllianceName('');
      alert('Alliance created successfully!');
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
