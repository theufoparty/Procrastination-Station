import styled from 'styled-components';

const TitleContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleText = styled.h1`
  font-size: 2rem;
  color: #000000;
  text-align: center;
  margin: 0;
`;

const Title = () => (
  <TitleContainer>
    <TitleText>nothing</TitleText>
  </TitleContainer>
);

export default Title;
