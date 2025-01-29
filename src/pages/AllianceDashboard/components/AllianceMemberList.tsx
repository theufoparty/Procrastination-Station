import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';

interface UserDoc {
  id: string;
  name: string;
  email: string;
  createdAt?: Timestamp;
}

interface AllianceMemberListProps {
  members: UserDoc[];
}

const AllianceMemberList = ({ members }: AllianceMemberListProps) => {
  if (members.length === 0) {
    return <NoMembers>No members found.</NoMembers>;
  }

  return (
    <Container>
      <Title>Members</Title>
      <List>
        {members.map((member) => (
          <ListItem key={member.id}>
            <MemberName>{member.name}</MemberName>
            <MemberEmail>({member.email})</MemberEmail>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AllianceMemberList;

const Container = styled.div`
  margin-bottom: 1rem;
  border-radius: 8px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 0.75rem;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MemberName = styled.strong`
  font-size: 1rem;
  color: #444;
`;

const MemberEmail = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const NoMembers = styled.p`
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin-top: 1rem;
`;
