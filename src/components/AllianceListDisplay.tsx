import { Link } from 'react-router-dom';
import { Alliance } from '../types/firestore';

interface AllianceListDisplayProps {
  alliances: Alliance[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

const AllianceListDisplay = ({
  alliances,
  title = 'Alliances',
  emptyMessage = 'No alliances found.',
  className,
}: AllianceListDisplayProps) => {
  return (
    <div className={className}>
      <h2>{title}</h2>
      {alliances.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul>
          {alliances.map((alliance) => (
            <li key={alliance.id}>
              <Link to={`/alliance/${alliance.id}`}>{alliance.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllianceListDisplay;
