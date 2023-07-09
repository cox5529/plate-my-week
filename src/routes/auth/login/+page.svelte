<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import EmailField from '$lib/components/form-fields/EmailField.svelte';
	import PasswordField from '$lib/components/form-fields/PasswordField.svelte';

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form, { taintedMessage: null });
</script>

<svelte:head>
	<title>Login | Plate my week</title>
</svelte:head>

<h1>Login to Plate my week</h1>
<form class="d-flex flex-column gap-4" method={'post'} use:enhance>
	<EmailField
		name="email"
		label="Email Address"
		bind:value={$form.email}
		errors={$errors}
		constraints={$constraints}
	/>
	<PasswordField
		name="password"
		label="Password"
		bind:value={$form.password}
		errors={$errors}
		constraints={$constraints}
	/>
	<div>
		<button class="btn btn-primary" type="submit">Submit</button>
	</div>
</form>
