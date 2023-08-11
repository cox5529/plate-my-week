import { fail, redirect } from '@sveltejs/kit';
import { FirebaseError } from 'firebase/app';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { register, signIn } from '../../../lib/server/firebase/authentication';

const schema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().nonempty(),
	confirmPassword: z.string().nonempty(),
	displayName: z.string().nonempty()
});

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await register(form.data.email, form.data.password, form.data.displayName);
			const cookie = await signIn(form.data.email, form.data.password);
			cookies.set('__session', cookie.cookie, cookie.options);
		} catch (e) {
			if (e instanceof FirebaseError) {
				console.warn(e);
				return message(form, 'Invalid email or password', { status: 401 });
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
