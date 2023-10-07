import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { defineSecret } from 'firebase-functions/params';

const secrets: Record<string, string> = {};

export const getSecret = async (name: string): Promise<string | null> => {
	if (secrets[name]) {
		console.info(`Returning ${name} from cache`);
		return secrets[name];
	}

	let value: string | undefined = undefined;
	if (name.startsWith('PUBLIC_')) {
		value = publicEnv[name as `PUBLIC_${string}`];
	} else {
		value = privateEnv[name];
	}

	if (!value) {
		try {
			const secret = defineSecret(name);
			value = secret.value();
		} catch (e) {
			console.error(e);
		}
	}

	if (value) {
		secrets[name] = value;
	}

	console.info(`Secret ${name} does ${value ? '' : 'not '}have a value`);
	return value ?? null;
};
