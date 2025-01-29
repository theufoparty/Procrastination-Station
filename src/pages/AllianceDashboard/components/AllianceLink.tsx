import { useState } from 'react';
import styled from 'styled-components';

const ActionButton = styled.button`
  font-family: 'Montserrat', serif;
  font-weight: 300;
  padding: 12px;
  border: none;
  font-size: 0.8em;
  background-color: #35328b;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
`;

interface AllianceLinkProps {
  allianceId?: string;
}

export function AllianceLink({ allianceId }: AllianceLinkProps) {
  const joinAllianceLink = `${window.location.origin}/join-alliance/${allianceId}`;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinAllianceLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy invite link:', error);
    }
  };

  return (
    <ActionButton onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy Invite link'}</ActionButton>
  );
}
