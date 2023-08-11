<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import FormButton from '$lib/components/buttons/FormButton.svelte';
	import EmailField from '$lib/components/form-fields/EmailField.svelte';
	import PasswordField from '$lib/components/form-fields/PasswordField.svelte';
	import TextField from '$lib/components/form-fields/TextField.svelte';

	export let data;

	const form = superForm(data.form, {
		taintedMessage: null
	});

	$: message = form.message;
	$: submitting = form.submitting;
</script>

<svelte:head>
	<title>Sign Up | Plate my week</title>
</svelte:head>

<h1>Sign up for Plate my week</h1>
<form class="d-flex flex-column gap-4" method={'post'} use:form.enhance>
	<EmailField name="email" label="Email Address" {form} />
	<TextField name="displayName" label="Display Name" {form} />
	<PasswordField name="password" label="Password" {form} />
	<PasswordField name="confirmPassword" label="Confirm Password" {form} />
	<div>
		<FormButton color="primary" type="submit" submitting={$submitting}>Submit</FormButton>
		<a class="btn btn-secondary" href="/auth/forgot-password">Forgot password?</a>
	</div>
	{#if $message}
		<p class="text-danger">{$message}</p>
	{/if}
</form>
