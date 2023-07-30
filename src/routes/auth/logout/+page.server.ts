import { signOut } from '../../../lib/server/firebase/authentication';

export const load = async (event) => {
	await signOut(event);
};
