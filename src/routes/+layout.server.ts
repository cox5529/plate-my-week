import { isAuthenticated } from '../lib/server/firebase/authentication';

export const load = async (event) => {
	return { authentication: isAuthenticated(event) ?? null };
};
