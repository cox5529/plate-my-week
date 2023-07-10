import { fail, redirect } from '@sveltejs/kit';
import { FirebaseError } from 'firebase/app';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { signIn } from '../../../lib/server/firebase/authentication';

const schema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().nonempty()
});

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const cookie = await signIn(form.data.email, form.data.password);
			event.cookies.set('__session', cookie.cookie, cookie.options);
		} catch (e) {
			if (e instanceof FirebaseError) {
				return fail(401, { form });
			}

			console.error(e);
			return fail(500, { form });
		}

		throw redirect(302, '/');
	}
};

export const load = async () => {
	const form = await superValidate(schema);

	return { form };
};
