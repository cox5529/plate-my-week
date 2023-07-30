import type { AppUser } from '../../models/entities/user';
import { adminFirestore } from './firebase-admin';
import { assignTypes } from './firestore';

export const usersCollection = adminFirestore.collection('users').withConverter(assignTypes<AppUser>());

export const getUser = async (id: string): Promise<AppUser | undefined> => {
	const user = await usersCollection.doc(id).get();
	return user.exists ? { ...user.data()!, id: user.id } : undefined;
};
