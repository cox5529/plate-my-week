import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { writable } from 'svelte/store';

import type { Roles } from './lib/models/enums/roles';

export const authenticationStore = writable<DecodedIdToken | null>(null);
export const roleStore = writable<Roles | null>(null);
