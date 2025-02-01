import { arrayUnion, doc, runTransaction } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const joinAlliance = async ({
  allianceId,
  userId,
}: {
  allianceId: string;
  userId: string;
}) => {
  if (!allianceId || !userId) return;

  const allianceDocRef = doc(db, 'alliances', allianceId);
  const userDocRef = doc(db, 'users', userId);

  try {
    await runTransaction(db, async (transaction) => {
      // Optionally, you can fetch and verify the documents here
      transaction.update(allianceDocRef, {
        userIds: arrayUnion(userId),
      });
      transaction.update(userDocRef, {
        allianceIds: arrayUnion(allianceId),
      });
    });
  } catch (error) {
    console.error('Error joining alliance:', error);
    throw error;
  }
};
