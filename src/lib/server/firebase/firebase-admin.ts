import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

import { getSecret } from '../secrets';

export let adminApp: App = admin.apps.find((x) => x && x.name === '[DEFAULT]')!;
const firebaseAdminKey = await getSecret('ADMIN_PRIVATE_KEY');
if (!adminApp && firebaseAdminKey) {
	console.info(`Initializing firebase admin with a key ${firebaseAdminKey.length} characters long`);
	adminApp = admin.initializeApp({
		credential: admin.credential.cert(JSON.parse(atob(firebaseAdminKey)))
	});
}

export const adminAuth = admin.auth(adminApp);
export const adminFirestore = admin.firestore(adminApp);
