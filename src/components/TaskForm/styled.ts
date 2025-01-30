import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const OuterContainer = styled.div`
  background-color: #fff;
  border-radius: 0px;
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
  height: 100vh;
  width: 100vw;

  @media (min-width: 768px) {
    border-radius: 20px;
    height: 90vh;
    width: 40vw;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: #f3f5fe;
`;

export const DarkHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #35328b;
  border-radius: 20px;
  padding: 20px;
  margin: 20px;
  align-items: flex-start;
  padding-bottom: 8em;
  @media (min-width: 768px) {
  }
`;

export const CloseButton = styled.button`
  top: 1rem;
  left: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 300;
`;

export const Title = styled.h2`
  margin: 0;
  text-align: center;
  color: #ffffff;
  font-size: 1.4em;
  font-weight: 300;
`;

export const FormContainer = styled.div`
  z-index: 10;
  background-color: #ffffff;
  padding: 20px;
  padding-top: 2em;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  margin-top: -7em;
  margin-inline: 20px;
  margin-bottom: 20px;
  border-radius: 20px;
  justify-content: space-evenly;
  height: 100%;
  @media (min-width: 768px) {
  }
`;

export const DarkLabel = styled.label`
  display: block;
  color: #ffffff;
  font-size: 0.7rem;
  margin-top: 1rem;
  font-weight: 300;
`;

export const DarkInput = styled.input`
  font-family: 'Montserrat', serif;
  width: 100%;
  background: #35328b;
  border: none;
  border-bottom: 1px solid #ccc;
  color: #fff;
  padding: 0.5em;
  font-size: 0.7em;
  font-weight: 300;

  &:focus {
    outline: none;
    border-bottom: 1px solid #fff;
  }
`;

export const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 300;
  color: #232323;
`;

export const LightInput = styled.input`
  font-family: 'Montserrat', serif;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.5em;
  font-size: 0.9em;
  font-weight: 300;
  color: #374e56;
  outline: none;
  background-color: transparent;

  &:focus {
    border-bottom: 1px solid #007bff;
  }
`;

export const TextArea = styled.textarea`
  font-family: 'Montserrat', serif;
  border: none;
  border-bottom: 1px solid #ccc;
  padding-top: 12px;
  font-size: 0.7em;
  font-weight: 300;
  color: #374e56;
  outline: none;
  resize: none;
  min-height: 10em;

  &:focus {
    border-bottom: 1px solid #35328b;
  }
`;

export const Select = styled.select`
  font-family: 'Montserrat', serif;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 12px 0;
  font-size: 0.7em;
  font-weight: 300;
  color: rgb(0, 0, 0);
  background: white;
  outline: none;

  &:focus {
    border-bottom: 1px solid #35328b;
  }

  option {
    background-color: #fff;
    color: #000;
  }

  option:checked {
    background-color: #f3f5fe;
    color: #000;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  width: 100%;
  align-items: center;
  margin-top: 1rem;
  justify-content: center;
`;

export const SubmitButton = styled.button`
  font-family: 'Montserrat', serif;
  display: flex;
  background-color: #35328b;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 12px;
  font-size: 0.7em;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #413dbe;
  }
`;

export const InputContainer = styled.div`
  font-family: 'Montserrat', serif;
  display: flex;
  flex-direction: column;
`;

export const PriorityButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  flex-wrap: wrap;
`;

export const PriorityButton = styled.button<{ selected: boolean }>`
  font-family: 'Montserrat', serif;
  padding: 12px;
  font-size: 0.6em;
  width: 8em;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 300;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ selected }) => (selected ? '#35328b;' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#6f84f6' : '#d4d4d4')};
  }
`;

export const AddSubtaskButton = styled.button`
  font-family: 'Montserrat', serif;
  display: flex;
  background-color: #35328b;
  color: #fff;
  width: fit-content;
  border: none;
  border-radius: 20px;
  padding: 12px;
  font-size: 0.6em;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #413dbe;
  }
`;

export const RemoveSubtaskButton = styled.button`
  font-family: 'Montserrat', serif;
  margin-top: 20px;
  display: flex;
  background-color: #35328b;
  color: #fff;
  border: none;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  padding: 8px;
  font-size: 0.7em;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  align-items: center;
  justify-content: center;
`;

export const CategoryButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  flex-wrap: wrap;
`;

export const SubtaskContainer = styled.div`
  font-family: 'Montserrat', serif;
  display: flex;
  gap: 0.3em;
  margin-bottom: 0.5em;
  font-size: 0.7em;
  align-items: flex-end;
`;

export const CategoryButton = styled.button<{ selected: boolean }>`
  font-family: 'Montserrat', serif;
  width: 8em;
  padding: 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.6em;
  font-weight: 300;
  transition: background-color 0.2s ease-in-out;

  background-color: ${({ selected }) => (selected ? '#35328b;' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#6f84f6' : '#d4d4d4')};
  }
`;

export const RecurrenceButton = styled.button<{ selected: boolean }>`
  font-family: 'Montserrat', serif;
  padding: 12px;
  width: 8em;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.6em;
  font-weight: 300;
  transition: background-color 0.2s ease-in-out;
  background-color: ${({ selected }) => (selected ? '#4d63f3' : '#e1e1e1')};
  color: ${({ selected }) => (selected ? '#fff' : '#333')};
  &:hover {
    background-color: ${({ selected }) => (selected ? '#35328b;' : '#d4d4d4')};
  }
`;

export const RecurrenceButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  flex-wrap: wrap;
`;

export const ReadOnlySubtaskContainer = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;

  input[type='checkbox'] {
    margin-right: 0.5rem;
    cursor: pointer;
  }

  p {
    font-size: 0.7em;
    margin: 0;
    text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  }
`;
