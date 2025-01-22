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
    return <p>No members found.</p>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <strong>{member.name}</strong> ({member.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllianceMemberList;
