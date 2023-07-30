import { redirect, type Cookies } from '@sveltejs/kit';
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword
} from 'firebase/auth';
import { addDoc, doc, setDoc } from 'firebase/firestore';

import { auth } from '../../firebase/authentication';
import type { AppUser } from '../../models/entities/user';
import { Roles } from '../../models/enums/roles';
import { getSecret } from '../secrets';
import { adminAuth } from './firebase-admin';
import { getUser, usersCollection } from './users';

export const signIn = async (
	email: string,
	password: string
): Promise<{ cookie: string; options: import('cookie').CookieSerializeOptions }> => {
	const result = await signInWithEmailAndPassword(auth, email, password);
	const idToken = await result.user.getIdToken();

	const cookieAge = 14 * 24 * 60 * 60 * 1000;
	const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn: cookieAge });

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

export const register = async (
	email: string,
	password: string,
	displayName: string
): Promise<void> => {
	const credential = await createUserWithEmailAndPassword(auth, email, password);
	await usersCollection.doc(credential.user.uid).set({
		id: credential.user.uid,
		role: Roles.User,
		name: displayName
	});
};

export const forgotPassword = async (email: string): Promise<void> => {
	await sendPasswordResetEmail(auth, email);
};

export const signOut = async (request: { cookies: Cookies }): Promise<void> => {
	const claims = await isAuthenticated(request);
	request.cookies.delete('__session');

	if (claims) {
		await adminAuth.revokeRefreshTokens(claims.sub);
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
		const claims = await adminAuth.verifySessionCookie(cookie, true);
		return claims;
	} catch (e) {
		console.warn('Failed to verify session cookie');
		return false;
	}
};
