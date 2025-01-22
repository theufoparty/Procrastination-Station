import styled from 'styled-components';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebaseConfig';

const PageContainer = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-evenly;
  }
`;

const LeftSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const Title = styled.h1`
  font-weight: 100;
  font-size: 2.4em;
  color: #333;
  margin-top: 2em;

  @media (min-width: 768px) {
    font-size: 4em;
    margin-top: 0;
  }
`;

const RightSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: flex-start;
    width: 30em;
    height: 30em;
    justify-content: flex-end;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  padding: 1em;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1em;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  color: #444;
`;

const StyledInput = styled.input`
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StyledButton = styled.button`
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  width: 100%;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const SecondaryButton = styled.button`
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #007bff;
  background-color: #fff;
  color: #007bff;
  border-radius: 8px;
  width: 100%;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #f1f9ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  text-align: center;

  &[role='alert'] {
    margin-top: 1rem;
  }
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      setName('');
      setEmail('');
      setPassword('');
      navigate('/');
    } catch {
      setError('Error creating account, try again later');
    }
  };

  return (
    <PageContainer>
      <LeftSection>
        <Title>Procrastination Station</Title>
      </LeftSection>

      <RightSection>
        <FormContainer>
          <StyledForm onSubmit={handleSubmit} noValidate>
            <FormGroup>
              <StyledLabel htmlFor='signup-name'>Name</StyledLabel>
              <StyledInput
                id='signup-name'
                name='name'
                type='text'
                autoComplete='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <StyledLabel htmlFor='signup-email'>Email</StyledLabel>
              <StyledInput
                id='signup-email'
                name='email'
                type='email'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <StyledLabel htmlFor='signup-password'>Password</StyledLabel>
              <StyledInput
                id='signup-password'
                name='password'
                type='password'
                autoComplete='new-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>

            <ButtonGroup>
              <StyledButton type='submit'>Sign Up</StyledButton>
              <SecondaryButton type='button' onClick={() => navigate('/login')}>
                Go to Login
              </SecondaryButton>
            </ButtonGroup>

            {error && (
              <ErrorMessage role='alert' aria-live='assertive'>
                {error}
              </ErrorMessage>
            )}
          </StyledForm>
        </FormContainer>
      </RightSection>
    </PageContainer>
  );
};

export default SignUp;
