import { fail, json, redirect } from '@sveltejs/kit';
import { FirebaseError } from 'firebase/app';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { forgotPassword, signIn } from '../../../lib/server/firebase/authentication';

const schema = z.object({
	email: z.string().email().nonempty()
});

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		await forgotPassword(form.data.email);
		return message(form, 'Check your email for a link to reset your password');
	}
};

export const load = async (event) => {
	const form = await superValidate(schema);
	return { form };
};
