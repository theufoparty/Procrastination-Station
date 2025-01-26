// src/utils/authUtils.ts
import { Auth, createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface CreateUserParams {
  auth: Auth;
  db: Firestore;
  name: string;
  email: string;
  password: string;
}

export const createUserWithProfile = async ({
  auth,
  db,
  name,
  email,
  password,
}: CreateUserParams) => {
  try {
    // Step 1: Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Update the user's profile with the display name
    await updateProfile(user, { displayName: name });

    // Step 3: Add user information to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email: user.email,
      createdAt: serverTimestamp(),
    });

    // Return the user object on success
    return user;
  } catch (error) {
    console.error('Error creating user with profile:', error);
    // Optionally, you can access the current user and delete if necessary
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await deleteUser(currentUser);
        console.log('Rolled back user creation due to an error.');
      } catch (deleteError) {
        console.error('Error deleting user after failure:', deleteError);
      }
    }

    // Rethrow the error to be handled by the caller
    throw new Error('Failed to create user. Please try again.');
  }
};
