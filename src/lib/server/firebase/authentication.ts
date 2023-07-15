import { redirect, type Cookies } from '@sveltejs/kit';
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase/authentication';
import { getUser } from '../../firebase/users';
import type { AppUser } from '../../models/entities/user';
import type { Roles } from '../../models/enums/roles';
import { getSecret } from '../secrets';

let app: App = admin.apps.find((x) => x && x.name === '[DEFAULT]')!;
const firebaseAdminKey = await getSecret('ADMIN_PRIVATE_KEY');
if (!app && firebaseAdminKey) {
	console.info(`Initializing firebase admin with a key ${firebaseAdminKey.length} characters long`);
	app = admin.initializeApp({
		credential: admin.credential.cert(JSON.parse(atob(firebaseAdminKey)))
	});
}

export const signIn = async (
	email: string,
	password: string
): Promise<{ cookie: string; options: import('cookie').CookieSerializeOptions }> => {
	const result = await signInWithEmailAndPassword(auth, email, password);
	const idToken = await result.user.getIdToken();

	const cookieAge = 14 * 24 * 60 * 60 * 1000;
	const cookie = await admin.auth(app).createSessionCookie(idToken, { expiresIn: cookieAge });

	return {
		cookie,
		options: {
			maxAge: cookieAge,
			httpOnly: true,
			secure: (await getSecret('ENVIRONMENT')) !== 'Development',
			path: '/',
			sameSite: 'strict'
		}
	};
};

export const forgotPassword = async (email: string): Promise<void> => {
	await sendPasswordResetEmail(auth, email);
};

export const signOut = async (request: { cookies: Cookies }): Promise<void> => {
	const claims = await isAuthenticated(request);
	request.cookies.delete('__session');

	if (claims) {
		await admin.auth(app).revokeRefreshTokens(claims.sub);
	}
};

export const getUserRole = async (request: { cookies: Cookies }): Promise<Roles | undefined> => {
	const claims = await isAuthenticated(request);
	if (!claims) {
		return;
	}

	const user = await getUser(claims.sub);
	return user?.role;
};

export const verifyAuthentication = async (
	request: { cookies: Cookies },
	roles?: Roles[]
): Promise<AppUser> => {
	const authenticated = await isAuthenticated(request);
	if (!authenticated) {
		console.warn('User is not currently authenticated');
		throw redirect(302, '/');
	}

	const user = await getUser(authenticated.sub);
	if (!user || (roles && !roles.find((x) => x == user.role))) {
		console.warn(`User ${authenticated.email} is not authorized with roles [${roles?.join(', ')}]`);
		throw redirect(302, '/');
	}

	return user;
};

export const isAuthenticated = async (request: { cookies: Cookies }) => {
	const cookie = request.cookies.get('__session');
	if (!cookie) {
		console.warn('Session cookie not found');
		return false;
	}

	try {
		const claims = await admin.auth(app).verifySessionCookie(cookie, true);
		return claims;
	} catch (e) {
		console.warn('Failed to verify session cookie', e);
		return false;
	}
};
