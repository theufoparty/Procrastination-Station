import styled from 'styled-components';
import { useState } from 'react';
import { auth } from '../../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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
  font-weight: 100;
  font-size: 2.4em;
  color: #333;
  margin-top: 2em;

  @media (min-width: 768px) {
    font-size: 3.5;
    margin-top: 0;
  }
`;

const RightSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background-color: #dedede;

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
  padding: 1em;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 3em;
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
  margin-top: 1rem;
  &[role='alert'] {
    margin-top: 1rem;
  }
`;

const Text = styled.p`
  font-size: 1em;
  text-align: center;
  margin-top: 1rem;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill out both fields');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <PageContainer>
      <LeftSection>
        <Title>Procrastination Station</Title>

        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </Text>
      </LeftSection>

      <RightSection>
        <FormContainer>
          <StyledForm onSubmit={handleSubmit} noValidate>
            <FormGroup>
              <StyledLabel htmlFor='login-email'>Email</StyledLabel>
              <StyledInput
                id='login-email'
                name='email'
                type='email'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <StyledLabel htmlFor='login-password'>Password</StyledLabel>
              <StyledInput
                id='login-password'
                name='password'
                type='password'
                autoComplete='current-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>

            <ButtonGroup>
              <StyledButton type='submit'>Login</StyledButton>
              <SecondaryButton type='button' onClick={() => navigate('/signup')}>
                Go to Sign Up
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

export default Login;
