import { getUserRole, isAuthenticated } from '../lib/server/firebase/authentication';

export const load = async (event) => {
	return { authentication: isAuthenticated(event) ?? null, role: getUserRole(event) };
};
