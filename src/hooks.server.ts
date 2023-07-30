import { getSecret } from './lib/server/secrets';

if ((await getSecret('ENVIRONMENT')) !== 'Development') {
	import('firebase-functions/logger/compat');
}

export function handleError(data) {
	console.error('An error occurred while processing a request:', data.error);
}
