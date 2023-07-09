import { env } from '$env/dynamic/private';
import { redirect, type Cookies } from '@sveltejs/kit';
import admin from 'firebase-admin';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase/authentication';

if (admin.apps.length === 0) {
	admin.initializeApp({
		credential: admin.credential.cert(JSON.parse(atob(env.ADMIN_PRIVATE_KEY)))
	});
}

export const signIn = async (
	email: string,
	password: string
): Promise<{ cookie: string; options: import('cookie').CookieSerializeOptions }> => {
	const result = await signInWithEmailAndPassword(auth, email, password);
	const idToken = await result.user.getIdToken();

	const cookieAge = 14 * 24 * 60 * 60 * 1000;
	const cookie = await admin.auth().createSessionCookie(idToken, { expiresIn: cookieAge });

	return {
		cookie,
		options: {
			maxAge: cookieAge,
			httpOnly: true,
			secure: env.ENVIRONMENT !== 'Development',
			path: '/',
			sameSite: 'strict'
		}
	};
};

export const signOut = async (request: { cookies: Cookies }): Promise<void> => {
	const claims = await verifyAuthentication(request);
  request.cookies.delete('session');
	await admin.auth().revokeRefreshTokens(claims.sub);
};

export const verifyAuthentication = async (request: { cookies: Cookies }) => {
	const authenticated = await isAuthenticated(request);
	if (!authenticated) {
		throw redirect(302, '/');
	}

	return authenticated;
};

export const isAuthenticated = async (request: { cookies: Cookies }) => {
	const cookie = request.cookies.get('session');
	if (!cookie) {
		return false;
	}

	try {
		const claims = await admin.auth().verifySessionCookie(cookie, true);
		return claims;
	} catch {
		return false;
	}
};
