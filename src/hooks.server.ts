import 'firebase-functions/logger/compat';

export function handleError(data) {
  console.error('An error occurred while processing a request:', data.error);
}
