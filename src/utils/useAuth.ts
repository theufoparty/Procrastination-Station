import { useEffect, useState } from 'react';
import { onAuthStateChanged, Auth } from 'firebase/auth';
import { doc, onSnapshot, Firestore } from 'firebase/firestore';
import { User } from '../types/user';

interface UseAuthReturn {
  user: User | null;
  authLoading: boolean;
}

export const useAuth = (auth: Auth, db: Firestore): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
      } else {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (snapshot) => {
          if (!snapshot.exists()) {
            setUser({
              ...firebaseUser,
              name: undefined,
            });
          } else {
            const enrichedUser: User = {
              ...firebaseUser,
              ...snapshot.data(),
            };
            setUser(enrichedUser);
          }
          setAuthLoading(false);
        });
        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db]);

  return { user, authLoading };
};
