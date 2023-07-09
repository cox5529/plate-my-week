import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { writable } from 'svelte/store';

export const authenticationStore = writable<DecodedIdToken | null>(null);
