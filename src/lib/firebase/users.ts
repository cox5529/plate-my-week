import { collection, doc, getDoc } from 'firebase/firestore';

import type { AppUser } from '../models/entities/user';

import { assignTypes, db } from '.';

export const usersCollection = collection(db, 'users').withConverter(assignTypes<AppUser>());

export const getUser = async (id: string): Promise<AppUser | undefined> => {
	const user = await getDoc(doc(usersCollection, id));
	return user.exists() ? { ...user.data(), id: user.id } : undefined;
};
