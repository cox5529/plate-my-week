import { redirect, type Cookies } from '@sveltejs/kit';
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase/authentication';
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

export const signOut = async (request: { cookies: Cookies }): Promise<void> => {
	const claims = await verifyAuthentication(request);
	request.cookies.delete('__session');
	await admin.auth(app).revokeRefreshTokens(claims.sub);
};

export const verifyAuthentication = async (request: { cookies: Cookies }) => {
	const authenticated = await isAuthenticated(request);
	if (!authenticated) {
		throw redirect(302, '/');
	}

	return authenticated;
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
