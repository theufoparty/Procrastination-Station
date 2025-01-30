import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithProfile } from '../../utils/createUserWithProfile';

const PageContainer = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row-reverse;
  }
`;

const LeftSection = styled.div`
  margin: 14em 2em 2em 2em;
  text-align: center;

  @media (min-width: 768px) {
    margin-bottom: 0;
    width: 40%;
    margin: 2em;
  }
`;

const Title = styled.h1`
  font-weight: 300;
  font-size: 2em;
  color: #252525;
  margin-top: 2em;

  @media (min-width: 768px) {
    font-size: 3em;
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
    align-items: center;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  padding: 4cap;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledLabel = styled.label`
  font-size: 1em;
  margin-top: 0.2em;
  color: #252525;
  font-weight: 300;
  font-family: 'Montserrat', serif;
`;

const StyledInput = styled.input`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding-bottom: 1em;
  font-size: 1em;
  border: none;
  border-bottom: 1px solid #252525;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #252525;
  }
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const StyledButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding: 12px;
  border: none;
  font-size: 1em;
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding: 12px;
  font-size: 1em;
  border: none;
  background-color: #9494bd;
  color: white;
  border-radius: 20px;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
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
      // Use the utility function to create the user
      await createUserWithProfile({
        auth,
        db,
        name,
        email,
        password,
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
