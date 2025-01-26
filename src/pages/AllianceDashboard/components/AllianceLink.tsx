import { useState } from 'react';

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
    <div
      style={{
        marginTop: '1rem',
        border: '1px solid #ccc',
        borderRadius: '0.25rem',
        padding: '1rem',
        display: 'inline-block',
      }}
    >
      <p style={{ margin: 0, fontWeight: 500 }}>Copy Invite Link to Alliance</p>
      <button onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy Link'}</button>
    </div>
  );
}
