<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import FormButton from '$lib/components/buttons/FormButton.svelte';
	import EmailField from '$lib/components/form-fields/EmailField.svelte';
	import PasswordField from '$lib/components/form-fields/PasswordField.svelte';

	export let data;

	const { form, errors, constraints, enhance, submitting, message } = superForm(data.form, {
		taintedMessage: null
	});
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
		<FormButton color="primary" type="submit" submitting={$submitting}>Submit</FormButton>
		<a class="btn btn-secondary" href="/auth/forgot-password">Forgot password?</a>
	</div>
	{#if $message}
		<p class='text-danger'>{$message}</p>
	{/if}
</form>
