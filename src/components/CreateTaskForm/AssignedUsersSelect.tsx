// AssignedUsersSelect.tsx
import React from 'react';
import { Label, Select, InputContainer } from './styled';

interface AllianceMember {
  id: string;
  name: string;
  email?: string;
}

interface AssignedUsersSelectProps {
  allianceMembers: AllianceMember[];
  assignedIds: string[];
  setAssignedIds: (ids: string[]) => void;
  readOnly?: boolean;
}

const AssignedUsersSelect: React.FC<AssignedUsersSelectProps> = ({
  allianceMembers,
  assignedIds,
  setAssignedIds,
  readOnly = false,
}) => {
  if (readOnly) {
    // Show read-only list of assigned user names
    const assignedMembers = allianceMembers.filter((m) => assignedIds.includes(m.id));
    const assignedNames = assignedMembers.map((m) => m.name).join(', ') || '—';

    return (
      <InputContainer>
        <Label>Assign Users</Label>
        <p style={{ marginTop: '0.3rem' }}>{assignedNames}</p>
      </InputContainer>
    );
  }

  // Editable mode
  return (
    <InputContainer>
      <Label htmlFor='assignedUsers'>Assign Users</Label>
      <Select
        id='assignedUsers'
        multiple
        value={assignedIds}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
          setAssignedIds(selected);
        }}
        style={{ height: '80px' }}
      >
        {allianceMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </Select>
    </InputContainer>
  );
};

export default AssignedUsersSelect;
