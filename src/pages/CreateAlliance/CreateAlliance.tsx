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
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2em;
  margin-top: 6em;
`;

const Input = styled.input`
  font-family: 'Montserrat', serif;
  padding: 12px 20px;
  font-size: 0.8em;
  margin: 2em 0;
  border: none;
  width: 80%;
  text-align: center;
  outline: none;
  background-color: #f3f5fe;

  &::placeholder {
    color: #a9a9a9;
  }

  &:focus {
    border-bottom: 1px solid #35328b;
  }
`;

const Button = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding: 12px;
  border: none;
  font-size: 0.8em;
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2c2a6a;
  }
`;

const Title = styled.h2`
  font-family: 'Montserrat', serif;
  font-weight: 400;
  text-align: center;
`;

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
      const docRef = await addDoc(collection(db, 'alliances'), {
        name: allianceName,
        userIds: [user.uid],
        createdAt: serverTimestamp(),
      });

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        allianceIds: arrayUnion(docRef.id),
      });
      navigate(`/alliance/${docRef.id}`);

      setAllianceName('');
    } catch (error) {
      console.error('Error creating alliance: ', error);
      alert('Error creating alliance');
    }
  };

  return (
    <Container>
      <Title>Create New Alliance</Title>
      <Input
        type='text'
        value={allianceName}
        onChange={(e) => setAllianceName(e.target.value)}
        placeholder='Alliance Name'
      />
      <Button onClick={handleCreateAlliance}>Create Alliance</Button>
    </Container>
  );
};

export default CreateAlliance;
