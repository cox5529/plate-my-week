<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import FormButton from '$lib/components/buttons/FormButton.svelte';
	import EmailField from '$lib/components/form-fields/EmailField.svelte';

	export let data;

	const form = superForm(data.form, {
		taintedMessage: null
	});

	$: submitting = form.submitting;
	$: message = form.message;
</script>

<svelte:head>
	<title>Forgot Password | Plate my week</title>
</svelte:head>

<h1>Forgot password</h1>
<form class="d-flex flex-column gap-4" method={'post'} use:form.enhance>
	<EmailField name="email" label="Email Address" {form} />
	<div>
		<FormButton color="primary" type="submit" submitting={$submitting}>Submit</FormButton>
		<a class="btn btn-secondary" href="/auth/login">Cancel</a>
	</div>
	{#if $message}
		<p>{$message}</p>
	{/if}
</form>
